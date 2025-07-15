/**
 * Storyblok POC - Main Entry Point
 * 
 * This is the main module that exports all the functionality
 * for working with Storyblok's Content Delivery and Management APIs.
 */

// Configuration
export { 
  createDeliveryClient, 
  createManagementClient, 
  getSpaceId, 
  validateEnvironment 
} from './src/config/storyblok.js';

// Models
export { blogPostSchema, BLOG_POST_COMPONENT } from './src/models/blog-post.js';

// Data
export { mockPosts } from './src/data/mock-posts.js';

// Utilities
export { 
  getAllPosts, 
  getFeaturedPosts, 
  getPostsByCategory, 
  getPostsByTag, 
  getRecentPosts,
  getPostBySlug 
} from './src/utils/query-helpers.js';

// Scripts
export { runQueryExamples } from './scripts/query-example.js';

// Main demonstration function
export async function runStoryblokDemo() {
  console.log('🚀 Storyblok POC Demo');
  console.log('====================');
  
  console.log('This POC demonstrates:');
  console.log('✅ Content type creation');
  console.log('✅ Mock data generation');
  console.log('✅ Various query patterns');
  console.log('✅ Modular architecture');
  console.log('');
  
  console.log('Available scripts:');
  console.log('- yarn setup: Create content types and mock data');
  console.log('- yarn query: Run query examples');
  console.log('');
  
  console.log('Check the /src directory for modular components:');
  console.log('- /src/config: Client configuration');
  console.log('- /src/models: Content type schemas');
  console.log('- /src/data: Mock data');
  console.log('- /src/utils: Helper functions');
  console.log('- /scripts: Executable scripts');
}

// Run demo if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runStoryblokDemo();
}