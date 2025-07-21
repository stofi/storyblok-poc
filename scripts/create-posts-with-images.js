/**
 * Create Blog Posts with Uploaded Images
 * Creates sample blog posts using images uploaded to Storyblok
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createManagementClient, getSpaceId, validateEnvironment } from '../src/config/storyblok.js';
import { BLOG_POST_COMPONENT } from '../src/models/blog-post.js';
import { GALLERY_COMPONENT, GALLERY_ITEM_IMAGE_COMPONENT } from '../src/models/gallery.js';
import { uploadAllImages } from './upload-assets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize management client and get space ID
const storyblokApi = createManagementClient();
const SPACE_ID = getSpaceId();

/**
 * Load uploaded asset data
 * @returns {Object[]} Array of uploaded assets
 */
function loadUploadedAssets() {
  const assetPath = path.join(__dirname, '..', 'src', 'data', 'uploaded-assets.json');
  
  if (!fs.existsSync(assetPath)) {
    console.log('⚠️  No uploaded assets found. Running asset upload first...');
    return null;
  }
  
  const data = fs.readFileSync(assetPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Create sample blog posts with uploaded images
 * @param {Object[]} assets - Array of uploaded asset data
 */
async function createBlogPostsWithImages(assets) {
  if (!assets || assets.length === 0) {
    console.log('❌ No assets available to create posts');
    return;
  }
  
  const blogPosts = [
    {
      name: 'Photography Portfolio Showcase',
      slug: 'photography-portfolio-showcase',
      content: {
        component: BLOG_POST_COMPONENT,
        title: 'Photography Portfolio Showcase',
        slug: 'photography-portfolio-showcase',
        author: 'Sarah Johnson',
        category: 'design',
        tags: ['frontend', 'design'],
        publication_date: new Date().toISOString(),
        featured: true,
        excerpt: 'Explore our latest photography collection featuring stunning visuals and creative compositions.',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Welcome to our photography showcase! This post demonstrates how to use real uploaded images in Storyblok galleries.'
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Each image in the gallery below has been uploaded to Storyblok\'s asset manager and is served through their CDN for optimal performance.'
                }
              ]
            }
          ]
        },
        gallery: assets.length > 0 ? [
          {
            component: GALLERY_COMPONENT,
            _uid: 'gallery-showcase-1',
            items: assets.map((asset, index) => ({
              component: GALLERY_ITEM_IMAGE_COMPONENT,
              _uid: `gallery-item-showcase-${index + 1}`,
              image: {
                id: asset.id,
                filename: asset.filename,
                name: asset.name,
                focus: asset.focus,
                title: asset.title || `Gallery Image ${index + 1}`,
                alt: asset.alt || `Showcase image ${index + 1}`
              },
              caption: `Photo ${index + 1}: ${asset.name || 'Untitled'}`
            }))
          }
        ] : []
      }
    },
    {
      name: 'Image Processing Techniques',
      slug: 'image-processing-techniques',
      content: {
        component: BLOG_POST_COMPONENT,
        title: 'Image Processing Techniques',
        slug: 'image-processing-techniques',
        author: 'Mike Chen',
        category: 'technology',
        tags: ['frontend', 'api'],
        publication_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        featured: false,
        excerpt: 'Learn about modern image processing techniques and optimization strategies for web applications.',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Image processing is a crucial aspect of modern web development. In this post, we\'ll explore various techniques for optimizing images.'
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'The images below demonstrate different processing techniques applied to the same source material.'
                }
              ]
            }
          ]
        },
        gallery: assets.length > 1 ? [
          {
            component: GALLERY_COMPONENT,
            _uid: 'gallery-techniques-1',
            items: assets.slice(0, 2).map((asset, index) => ({
              component: GALLERY_ITEM_IMAGE_COMPONENT,
              _uid: `gallery-item-techniques-${index + 1}`,
              image: {
                id: asset.id,
                filename: asset.filename,
                name: asset.name,
                focus: asset.focus,
                title: asset.title || `Technique Example ${index + 1}`,
                alt: asset.alt || `Image processing example ${index + 1}`
              },
              caption: index === 0 ? 'Original image' : 'Processed image with filters applied'
            }))
          }
        ] : []
      }
    },
    {
      name: 'Building a Media-Rich Blog',
      slug: 'building-media-rich-blog',
      content: {
        component: BLOG_POST_COMPONENT,
        title: 'Building a Media-Rich Blog',
        slug: 'building-media-rich-blog',
        author: 'Emma Wilson',
        category: 'tutorial',
        tags: ['javascript', 'frontend', 'api'],
        publication_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        featured: false,
        excerpt: 'Step-by-step guide to creating a blog with rich media content using Storyblok.',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Creating a media-rich blog requires careful planning and the right tools. Storyblok provides excellent support for managing media assets.'
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This post includes a gallery showcasing the types of media you can include in your blog posts.'
                }
              ]
            }
          ]
        },
        gallery: assets.length > 0 ? [
          {
            component: GALLERY_COMPONENT,
            _uid: 'gallery-media-1',
            items: [assets[assets.length - 1]].map((asset) => ({
              component: GALLERY_ITEM_IMAGE_COMPONENT,
              _uid: 'gallery-item-media-1',
              image: {
                id: asset.id,
                filename: asset.filename,
                name: asset.name,
                focus: asset.focus,
                title: asset.title || 'Media example',
                alt: asset.alt || 'Example of media content in blog'
              },
              caption: 'Example of high-quality media content'
            }))
          }
        ] : []
      }
    }
  ];
  
  console.log('📝 Creating blog posts with uploaded images...\n');
  
  for (const post of blogPosts) {
    try {
      const response = await storyblokApi.post(`spaces/${SPACE_ID}/stories`, {
        story: {
          name: post.name,
          slug: post.slug,
          content: post.content,
          is_folder: false,
          parent_id: 0
        }
      });
      
      console.log(`✅ Created: "${post.name}"`);
      console.log(`   URL: ${response.data.story.full_slug}`);
      console.log(`   Images: ${post.content.gallery?.[0]?.items?.length || 0} images in gallery\n`);
      
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.error?.includes('Slug has already been taken')) {
        console.log(`ℹ️  Post "${post.name}" already exists, skipping.\n`);
      } else {
        console.error(`❌ Error creating "${post.name}":`, error.response?.data || error.message);
        console.log('');
      }
    }
  }
}

// Main function
async function main() {
  console.log('🚀 Creating blog posts with uploaded images...\n');
  
  // Validate environment
  try {
    validateEnvironment();
  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    console.log('Please ensure your .env file contains all required tokens.');
    process.exit(1);
  }
  
  try {
    // Load or upload assets
    let assets = loadUploadedAssets();
    
    if (!assets) {
      console.log('\n📤 Uploading images first...\n');
      const uploadedAssets = await uploadAllImages();
      
      if (uploadedAssets.length > 0) {
        // Save asset data
        const dataPath = path.join(__dirname, '..', 'src', 'data', 'uploaded-assets.json');
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        fs.writeFileSync(dataPath, JSON.stringify(uploadedAssets.map(asset => ({
          id: asset.id,
          filename: asset.filename,
          name: asset.name,
          alt: asset.alt || '',
          title: asset.title || '',
          focus: asset.focus || null,
          content_type: asset.content_type
        })), null, 2));
        
        assets = uploadedAssets;
        console.log('\n');
      }
    } else {
      console.log(`📎 Found ${assets.length} previously uploaded assets\n`);
    }
    
    // Create blog posts
    await createBlogPostsWithImages(assets);
    
    console.log('✅ Blog posts creation completed!');
    console.log('Check your Storyblok space to see the posts with real images.');
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}