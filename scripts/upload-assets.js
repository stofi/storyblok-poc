/**
 * Upload Assets to Storyblok
 * Avoids duplicates by checking existing assets and tracks file hashes
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import { createManagementClient, getSpaceId, validateEnvironment } from '../src/config/storyblok.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize management client and get space ID
const storyblokApi = createManagementClient();
const SPACE_ID = getSpaceId();

/**
 * Calculate file hash to detect duplicates
 * @param {string} filePath - Path to the file
 * @returns {string} SHA-256 hash of the file
 */
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Load existing asset tracking data
 * @returns {Object} Existing asset data with file hashes
 */
function loadAssetRegistry() {
  const registryPath = path.join(__dirname, '..', 'src', 'data', 'asset-registry.json');
  
  if (fs.existsSync(registryPath)) {
    const data = fs.readFileSync(registryPath, 'utf-8');
    return JSON.parse(data);
  }
  
  return { assets: {}, lastSync: null };
}

/**
 * Save asset registry with file hashes
 * @param {Object} registry - Asset registry data
 */
function saveAssetRegistry(registry) {
  const registryPath = path.join(__dirname, '..', 'src', 'data', 'asset-registry.json');
  const dataDir = path.dirname(registryPath);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  registry.lastSync = new Date().toISOString();
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log(`💾 Updated asset registry`);
}

/**
 * Get all existing assets from Storyblok
 * @returns {Promise<Object[]>} Array of existing assets
 */
async function getExistingAssets() {
  try {
    console.log('🔍 Fetching existing assets from Storyblok...');
    const response = await storyblokApi.get(`spaces/${SPACE_ID}/assets`);
    console.log(`   Found ${response.data.assets.length} existing assets`);
    return response.data.assets;
  } catch (error) {
    console.error('❌ Error fetching existing assets:', error.response?.data || error.message);
    return [];
  }
}

/**
 * Upload a single asset to Storyblok (same as original)
 * @param {string} filePath - Path to the file to upload
 * @param {number} assetFolderId - Optional folder ID to upload to
 * @returns {Promise<Object>} The uploaded asset data
 */
async function uploadAsset(filePath, assetFolderId = null) {
  const filename = path.basename(filePath);
  const fileStats = fs.statSync(filePath);
  
  console.log(`📤 Uploading ${filename}...`);
  
  try {
    // Step 1: Request signed response
    const signRequest = {
      filename: filename,
      validate_upload: 1
    };
    
    if (assetFolderId) {
      signRequest.asset_folder_id = assetFolderId;
    }
    
    const signedResponse = await storyblokApi.post(`spaces/${SPACE_ID}/assets/`, signRequest);
    const signedResponseData = signedResponse.data;
    
    console.log(`   ✅ Got signed response for ${filename}`);
    
    // Step 2: Upload to S3
    await uploadToS3(filePath, signedResponseData);
    console.log(`   ✅ Uploaded to S3`);
    
    // Step 3: Finalize upload
    const finalizeResponse = await storyblokApi.get(
      `spaces/${SPACE_ID}/assets/${signedResponseData.id}/finish_upload`
    );
    
    console.log(`   ✅ Upload complete! Asset ID: ${finalizeResponse.data.id}`);
    console.log(`   📎 URL: ${finalizeResponse.data.filename}`);
    
    return finalizeResponse.data;
    
  } catch (error) {
    console.error(`❌ Error uploading ${filename}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Upload file to S3 using signed response (same as original)
 */
function uploadToS3(filePath, signedResponse) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    
    // Add all fields from signed response
    for (const key in signedResponse.fields) {
      form.append(key, signedResponse.fields[key]);
    }
    
    // Add the file
    form.append('file', fs.createReadStream(filePath));
    
    // Parse the S3 URL
    const url = new URL(signedResponse.post_url);
    
    // Submit the form with proper headers
    form.submit({
      host: url.hostname,
      path: url.pathname,
      protocol: url.protocol,
      headers: form.getHeaders()
    }, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (res.statusCode === 204) {
        resolve();
      } else {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          reject(new Error(`S3 upload failed with status ${res.statusCode}: ${body}`));
        });
      }
    });
  });
}

/**
 * Upload images with duplicate detection
 * @returns {Promise<Object[]>} Array of asset data (uploaded + existing)
 */
async function uploadAllImages() {
  const mediaPath = path.join(__dirname, '..', 'media');
  const images = fs.readdirSync(mediaPath).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif')
  );
  
  console.log(`🖼️  Found ${images.length} images in media folder\n`);
  
  // Load existing registry
  const registry = loadAssetRegistry();
  
  // Get existing assets from Storyblok
  const existingAssets = await getExistingAssets();
  
  const finalAssets = [];
  let uploadedCount = 0;
  let skippedCount = 0;
  
  for (const image of images) {
    const imagePath = path.join(mediaPath, image);
    const fileHash = getFileHash(imagePath);
    
    console.log(`🔍 Processing ${image}...`);
    console.log(`   File hash: ${fileHash.substring(0, 12)}...`);
    
    // Check if we already have this exact file
    if (registry.assets[image] && registry.assets[image].hash === fileHash) {
      const existingAsset = existingAssets.find(asset => 
        asset.id === registry.assets[image].id
      );
      
      if (existingAsset) {
        console.log(`   ✅ File unchanged, using existing asset (ID: ${existingAsset.id})`);
        finalAssets.push({
          id: existingAsset.id,
          filename: existingAsset.filename,
          name: existingAsset.name || image,
          alt: existingAsset.alt || '',
          title: existingAsset.title || '',
          focus: existingAsset.focus || null,
          content_type: existingAsset.content_type
        });
        skippedCount++;
        console.log('');
        continue;
      }
    }
    
    // Check if any existing asset has the same name (but different content)
    const sameNameAsset = existingAssets.find(asset => 
      asset.name === image || asset.filename.includes(image.split('.')[0])
    );
    
    if (sameNameAsset && registry.assets[image]?.hash !== fileHash) {
      console.log(`   ⚠️  Found existing asset with same name but different content`);
      console.log(`   🔄 This will create a new version`);
    }
    
    try {
      // Upload the new/changed file
      const uploadedAsset = await uploadAsset(imagePath);
      
      // Update registry
      registry.assets[image] = {
        id: uploadedAsset.id,
        hash: fileHash,
        filename: uploadedAsset.filename,
        uploadedAt: new Date().toISOString()
      };
      
      finalAssets.push({
        id: uploadedAsset.id,
        filename: uploadedAsset.filename,
        name: uploadedAsset.name || image,
        alt: uploadedAsset.alt || '',
        title: uploadedAsset.title || '',
        focus: uploadedAsset.focus || null,
        content_type: uploadedAsset.content_type
      });
      
      uploadedCount++;
      console.log('');
      
    } catch (error) {
      console.error(`Failed to upload ${image}, continuing with next...`);
    }
  }
  
  // Save updated registry
  saveAssetRegistry(registry);
  
  // Save final asset list for backward compatibility
  const legacyAssetPath = path.join(__dirname, '..', 'src', 'data', 'uploaded-assets.json');
  fs.writeFileSync(legacyAssetPath, JSON.stringify(finalAssets, null, 2));
  
  console.log(`\n📊 Summary:`);
  console.log(`   📤 Uploaded: ${uploadedCount} files`);
  console.log(`   ⏭️  Skipped: ${skippedCount} files (unchanged)`);
  console.log(`   📁 Total: ${finalAssets.length} assets available`);
  
  return finalAssets;
}

// Main function
async function main() {
  console.log('🚀 Uploading assets to Storyblok...\n');
  
  // Validate environment
  try {
    validateEnvironment();
  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    console.log('Please ensure your .env file contains all required tokens.');
    process.exit(1);
  }
  
  try {
    // Test API connection
    console.log('🔌 Testing API connection...');
    const testResponse = await storyblokApi.get(`spaces/${SPACE_ID}`);
    console.log(`✅ Connected to space: ${testResponse.data.space.name}\n`);
    
    // Upload images
    const finalAssets = await uploadAllImages();
    
    if (finalAssets.length > 0) {
      console.log('\n✅ Asset management completed!');
      console.log('All assets are now available for use in blog posts.');
      console.log('\nNext steps:');
      console.log('- Run "yarn create-posts-with-images" to use these assets');
      console.log('- Check asset-registry.json to see the tracking data');
    } else {
      console.log('\n⚠️  No assets available.');
    }
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export for use in other scripts
export { uploadAllImages, getFileHash };