/**
 * Verify Components Script
 * Compares local component definitions with the expected schema from components.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPostSchema } from '../src/models/blog-post.js';
import { gallerySchema, galleryItemImageSchema, galleryItemVideoSchema } from '../src/models/gallery.js';
import { pageSchema } from '../src/models/page.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load expected components from components.json
async function loadExpectedComponents() {
  const componentsPath = path.join(__dirname, '../.storyblok/components/285794549031161/components.json');
  const data = await fs.readFile(componentsPath, 'utf-8');
  return JSON.parse(data);
}

// Convert our schema format to match the expected format
function normalizeSchema(schema) {
  const normalized = {
    name: schema.name,
    display_name: schema.display_name || null,
    description: schema.description || null,
    schema: {},
    is_root: schema.is_root || false,
    is_nestable: schema.is_nestable !== false
  };

  // Normalize the schema fields
  for (const [key, field] of Object.entries(schema.schema)) {
    normalized.schema[key] = {
      type: field.type,
      pos: field.pos
    };

    // Add optional properties only if they exist
    if (field.display_name) normalized.schema[key].display_name = field.display_name;
    if (field.required) normalized.schema[key].required = field.required;
    if (field.description) normalized.schema[key].description = field.description;
    if (field.options) normalized.schema[key].options = field.options;
    if (field.minimum !== undefined) normalized.schema[key].minimum = field.minimum;
    if (field.maximum !== undefined) normalized.schema[key].maximum = field.maximum;
    if (field.restrict_type !== undefined) normalized.schema[key].restrict_type = field.restrict_type;
    if (field.restrict_components !== undefined) normalized.schema[key].restrict_components = field.restrict_components;
    if (field.component_whitelist) normalized.schema[key].component_whitelist = field.component_whitelist;
    if (field.filetypes) normalized.schema[key].filetypes = field.filetypes;
    if (field.decimals !== undefined) normalized.schema[key].decimals = field.decimals;
  }

  return normalized;
}

// Compare two schemas
function compareSchemas(local, expected) {
  const issues = [];
  
  // Compare basic properties
  if (local.name !== expected.name) {
    issues.push(`Name mismatch: ${local.name} vs ${expected.name}`);
  }
  
  if (local.display_name !== expected.display_name) {
    issues.push(`Display name mismatch: ${local.display_name} vs ${expected.display_name}`);
  }
  
  if (local.is_root !== expected.is_root) {
    issues.push(`is_root mismatch: ${local.is_root} vs ${expected.is_root}`);
  }
  
  if (local.is_nestable !== expected.is_nestable) {
    issues.push(`is_nestable mismatch: ${local.is_nestable} vs ${expected.is_nestable}`);
  }

  // Compare schema fields
  const localFields = Object.keys(local.schema);
  const expectedFields = Object.keys(expected.schema);
  
  // Check for missing fields
  const missingFields = expectedFields.filter(f => !localFields.includes(f));
  if (missingFields.length > 0) {
    issues.push(`Missing fields: ${missingFields.join(', ')}`);
  }
  
  // Check for extra fields
  const extraFields = localFields.filter(f => !expectedFields.includes(f));
  if (extraFields.length > 0) {
    issues.push(`Extra fields: ${extraFields.join(', ')}`);
  }
  
  // Compare field properties
  for (const fieldName of expectedFields) {
    if (!local.schema[fieldName]) continue;
    
    const localField = local.schema[fieldName];
    const expectedField = expected.schema[fieldName];
    
    // Compare relevant properties
    const propsToCompare = ['type', 'pos', 'required', 'minimum', 'maximum', 'restrict_components', 'component_whitelist', 'filetypes', 'decimals'];
    
    for (const prop of propsToCompare) {
      if (expectedField[prop] !== undefined && localField[prop] !== expectedField[prop]) {
        // Special handling for arrays
        if (Array.isArray(expectedField[prop]) && Array.isArray(localField[prop])) {
          const localStr = JSON.stringify(localField[prop].sort());
          const expectedStr = JSON.stringify(expectedField[prop].sort());
          if (localStr !== expectedStr) {
            issues.push(`Field ${fieldName}.${prop} mismatch: ${localStr} vs ${expectedStr}`);
          }
        } else {
          issues.push(`Field ${fieldName}.${prop} mismatch: ${localField[prop]} vs ${expectedField[prop]}`);
        }
      }
    }
  }
  
  return issues;
}

// Main verification function
async function verifyComponents() {
  console.log('🔍 Verifying component schemas...\n');
  
  try {
    const expectedComponents = await loadExpectedComponents();
    
    // Map our schemas to their expected counterparts
    const schemaMap = {
      'blog_post': blogPostSchema,
      'gallery': gallerySchema,
      'gallery_item_image': galleryItemImageSchema,
      'gallery_item_video': galleryItemVideoSchema,
      'page': pageSchema
    };
    
    let allPassed = true;
    
    for (const expected of expectedComponents) {
      const localSchema = schemaMap[expected.name];
      
      if (!localSchema) {
        console.log(`❌ Missing local schema for: ${expected.name}`);
        allPassed = false;
        continue;
      }
      
      const normalized = normalizeSchema(localSchema);
      const issues = compareSchemas(normalized, expected);
      
      if (issues.length === 0) {
        console.log(`✅ ${expected.name} - Schema matches!`);
      } else {
        console.log(`❌ ${expected.name} - Schema mismatches:`);
        issues.forEach(issue => console.log(`   - ${issue}`));
        allPassed = false;
      }
    }
    
    console.log('\n' + (allPassed ? '✅ All schemas match!' : '❌ Some schemas have mismatches'));
    
  } catch (error) {
    console.error('Error verifying components:', error.message);
    process.exit(1);
  }
}

// Run verification
verifyComponents();