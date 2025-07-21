import { createManagementClient, getSpaceId, validateEnvironment } from '../src/config/storyblok.js';
import { blogPostSchema } from '../src/models/blog-post.js';
import { gallerySchema, galleryItemImageSchema, galleryItemVideoSchema } from '../src/models/gallery.js';
import { pageSchema } from '../src/models/page.js';
import { mockPosts } from '../src/data/mock-posts.js';

// Initialize management client and get space ID
const storyblokApi = createManagementClient();
const SPACE_ID = getSpaceId();

// Create all component types
async function createComponents() {
  const components = [
    { schema: pageSchema, name: 'Page' },
    { schema: galleryItemImageSchema, name: 'Gallery Item Image' },
    { schema: galleryItemVideoSchema, name: 'Gallery Item Video' },
    { schema: gallerySchema, name: 'Gallery' },
    { schema: blogPostSchema, name: 'Blog Post' }
  ];

  console.log('🔧 Creating component types...');
  
  for (const { schema, name } of components) {
    try {
      const response = await storyblokApi.post(`spaces/${SPACE_ID}/components`, {
        component: schema
      });

      console.log(`✅ ${name} component created successfully!`);
      console.log(`   Component ID: ${response.data.component.id}`);
    } catch (error) {
      if (error.response?.status === 422 && (
        error.response?.data?.error?.includes('already exists') ||
        error.response?.data?.name?.includes('has already been taken')
      )) {
        console.log(`ℹ️  ${name} component already exists, skipping creation.`);
      } else {
        console.error(`❌ Error creating ${name} component:`, error.response?.data || error.message);
        throw error;
      }
    }
  }
}

// Create mock blog posts
async function createMockBlogPosts() {
  console.log('📝 Creating mock blog posts...');

  const createdPosts = [];

  for (const post of mockPosts) {
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
      createdPosts.push(response.data.story);
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.error?.includes('Slug has already been taken')) {
        console.log(`ℹ️  Post "${post.name}" already exists, skipping.`);
      } else {
        console.error(`❌ Error creating "${post.name}":`, error.response?.data || error.message);
      }
    }
  }

  return createdPosts;
}

// Main setup function
async function setup() {
  console.log('🚀 Setting up Storyblok POC...');

  // Validate environment variables
  try {
    validateEnvironment();
    console.log('🔍 Debug Info:');
    console.log(`   Space ID: ${SPACE_ID}`);
    console.log(`   Management Token: ${process.env.STORYBLOK_MANAGEMENT_TOKEN ? '***' + process.env.STORYBLOK_MANAGEMENT_TOKEN.slice(-4) : 'missing'}`);
    console.log('');
  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    console.log('Please copy .env.example to .env and fill in your Storyblok credentials.');
    process.exit(1);
  }

  try {
    // Test API connection first
    console.log('🔌 Testing API connection...');
    const testResponse = await storyblokApi.get(`spaces/${SPACE_ID}`);
    console.log(`✅ Connected to space: ${testResponse.data.space.name}`);
    console.log('');

    // Step 1: Create all components
    await createComponents();

    // Step 2: Create mock data
    await createMockBlogPosts();

    console.log('✅ Setup completed successfully!');
    console.log('Next steps:');
    console.log('1. Run "npm run query" to see query examples');
    console.log('2. Check your Storyblok space to see the created content');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setup();