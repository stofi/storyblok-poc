import { createManagementClient, getSpaceId } from '../src/config/storyblok.js';

const storyblokApi = createManagementClient();
const SPACE_ID = getSpaceId();

async function checkStories() {
  try {
    console.log('🔍 Checking existing stories...\n');
    
    // Get all stories with different parameters
    console.log('Trying different query parameters...\n');
    
    // Try 1: Basic query
    const response1 = await storyblokApi.get(`spaces/${SPACE_ID}/stories`);
    console.log(`Basic query: ${response1.data.stories?.length || 0} stories`);
    
    // Try 2: With pagination
    const response2 = await storyblokApi.get(`spaces/${SPACE_ID}/stories`, {
      per_page: 100,
      page: 1
    });
    console.log(`With pagination: ${response2.data.stories?.length || 0} stories`);
    
    // Try 3: Include drafts
    const response3 = await storyblokApi.get(`spaces/${SPACE_ID}/stories`, {
      version: 'draft'
    });
    console.log(`With draft version: ${response3.data.stories?.length || 0} stories`);
    
    // Use the response with the most stories
    const responses = [response1, response2, response3];
    const bestResponse = responses.reduce((best, current) => 
      (current.data.stories?.length || 0) > (best.data.stories?.length || 0) ? current : best
    );
    
    const stories = bestResponse.data.stories || [];
    
    console.log(`Found ${stories.length} stories:\n`);
    
    stories.forEach((story, index) => {
      console.log(`${index + 1}. "${story.name}" (${story.slug})`);
      console.log(`   ID: ${story.id}`);
      console.log(`   Component: ${story.content?.component || 'NO COMPONENT'}`);
      console.log(`   Content keys: ${Object.keys(story.content || {}).join(', ')}`);
      console.log(`   Published: ${story.published ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Check for blog post stories specifically
    const blogPostStories = stories.filter(story => 
      story.content?.component === 'blog_post' || 
      story.name.includes('Blog') ||
      story.slug.includes('blog')
    );
    
    if (blogPostStories.length > 0) {
      console.log('📝 Blog Post related stories:');
      blogPostStories.forEach(story => {
        console.log(`- ${story.name}: component="${story.content?.component}"`);
      });
    } else {
      console.log('❌ No blog post stories found with correct component association');
    }
    
  } catch (error) {
    console.error('❌ Error checking stories:', error.response?.data || error.message);
  }
}

checkStories();