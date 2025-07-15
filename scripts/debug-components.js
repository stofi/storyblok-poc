import { createManagementClient, getSpaceId } from '../src/config/storyblok.js';

const storyblokApi = createManagementClient();
const SPACE_ID = getSpaceId();

async function checkComponents() {
  try {
    console.log('🔍 Checking available components in space...\n');
    
    // Get all components
    const response = await storyblokApi.get(`spaces/${SPACE_ID}/components`);
    const components = response.data.components;
    
    console.log('Available components:');
    components.forEach(component => {
      console.log(`- Name: "${component.name}"`);
      console.log(`  ID: ${component.id}`);
      console.log(`  Component Key: "${component.name.toLowerCase().replace(/\s+/g, '_')}"`);
      console.log(`  Schema Fields: ${Object.keys(component.schema).length}`);
      console.log('');
    });
    
    // Find the blog post component
    const blogPostComponent = components.find(c => c.name === 'Blog Post');
    if (blogPostComponent) {
      console.log('✅ Found Blog Post component!');
      console.log(`   Component ID: ${blogPostComponent.id}`);
      console.log(`   Use this in content: "${blogPostComponent.name.toLowerCase().replace(/\s+/g, '_')}"`);
      console.log('');
      
      // Check schema fields
      console.log('Schema fields:');
      Object.keys(blogPostComponent.schema).forEach(fieldName => {
        const field = blogPostComponent.schema[fieldName];
        console.log(`- ${fieldName}: ${field.type} (${field.display_name})`);
      });
    } else {
      console.log('❌ Blog Post component not found');
    }
    
  } catch (error) {
    console.error('❌ Error checking components:', error.response?.data || error.message);
  }
}

checkComponents();