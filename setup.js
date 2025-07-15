import dotenv from 'dotenv';
import { storyblokInit, apiPlugin } from '@storyblok/js';

dotenv.config();

// Initialize management client for creating content types and data
const { storyblokApi } = storyblokInit({
  accessToken: process.env.STORYBLOK_MANAGEMENT_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    oauthToken: process.env.STORYBLOK_MANAGEMENT_TOKEN,
  }
});

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;

// Create the Blog Post Content Type
async function createBlogPostContentType() {
  try {
    console.log('🔧 Creating Blog Post content type...');

    const blogPostSchema = {
      name: 'Blog Post',
      schema: {
        title: {
          type: 'text',
          pos: 0,
          display_name: 'Title',
          required: true
        },
        slug: {
          type: 'text',
          pos: 1,
          display_name: 'Slug',
          required: true
        },
        author: {
          type: 'text',
          pos: 2,
          display_name: 'Author',
          required: true
        },
        category: {
          type: 'option',
          pos: 3,
          display_name: 'Category',
          options: [
            { name: 'Technology', value: 'technology' },
            { name: 'Design', value: 'design' },
            { name: 'Business', value: 'business' },
            { name: 'Tutorial', value: 'tutorial' }
          ],
          required: true
        },
        tags: {
          type: 'options',
          pos: 4,
          display_name: 'Tags',
          options: [
            { name: 'JavaScript', value: 'javascript' },
            { name: 'React', value: 'react' },
            { name: 'Node.js', value: 'nodejs' },
            { name: 'API', value: 'api' },
            { name: 'Frontend', value: 'frontend' },
            { name: 'Backend', value: 'backend' }
          ]
        },
        publication_date: {
          type: 'datetime',
          pos: 5,
          display_name: 'Publication Date',
          required: true
        },
        featured: {
          type: 'boolean',
          pos: 6,
          display_name: 'Featured Post'
        },
        excerpt: {
          type: 'textarea',
          pos: 7,
          display_name: 'Excerpt',
          description: 'Short description of the blog post'
        },
        content: {
          type: 'richtext',
          pos: 8,
          display_name: 'Content',
          required: true
        }
      }
    };

    const response = await storyblokApi.post(`spaces/${SPACE_ID}/components`, {
      component: blogPostSchema
    });

    console.log('✅ Blog Post content type created successfully!');
    console.log(`   Component ID: ${response.data.component.id}`);
    return response.data.component;

  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.error?.includes('already exists')) {
      console.log('ℹ️  Blog Post content type already exists, skipping creation.');
      return null;
    }
    console.error('❌ Error creating content type:', error.response?.data || error.message);
    throw error;
  }
}

// Create mock blog posts
async function createMockBlogPosts() {
  console.log('\n📝 Creating mock blog posts...');

  const mockPosts = [
    {
      name: 'Getting Started with Storyblok',
      slug: 'getting-started-storyblok',
      content: {
        component: 'blog_post',
        title: 'Getting Started with Storyblok',
        slug: 'getting-started-storyblok',
        author: 'John Doe',
        category: 'tutorial',
        tags: ['javascript', 'api'],
        publication_date: '2024-01-15 10:00',
        featured: true,
        excerpt: 'Learn how to set up and use Storyblok for your next project.',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Storyblok is a powerful headless CMS that makes content management easy for both developers and content creators. In this tutorial, we\'ll walk through the basics of setting up a Storyblok project.'
                }
              ]
            }
          ]
        }
      }
    },
    {
      name: 'Advanced React Patterns',
      slug: 'advanced-react-patterns',
      content: {
        component: 'blog_post',
        title: 'Advanced React Patterns',
        slug: 'advanced-react-patterns',
        author: 'Jane Smith',
        category: 'technology',
        tags: ['react', 'javascript', 'frontend'],
        publication_date: '2024-02-20 14:30',
        featured: false,
        excerpt: 'Explore advanced patterns in React development.',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'In this post, we will explore compound components, render props, and custom hooks. These patterns will help you write more reusable and maintainable React code.'
                }
              ]
            }
          ]
        }
      }
    },
    {
      name: 'Building APIs with Node.js',
      slug: 'building-apis-nodejs',
      content: {
        component: 'blog_post',
        title: 'Building APIs with Node.js',
        slug: 'building-apis-nodejs',
        author: 'Mike Johnson',
        category: 'technology',
        tags: ['nodejs', 'api', 'backend'],
        publication_date: '2024-03-10 09:15',
        featured: true,
        excerpt: 'A comprehensive guide to building RESTful APIs with Node.js.',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Learn how to create scalable and maintainable APIs using Node.js and Express. We\'ll cover everything from basic routing to advanced authentication.'
                }
              ]
            }
          ]
        }
      }
    },
    {
      name: 'UI/UX Design Principles',
      slug: 'ui-ux-design-principles',
      content: {
        component: 'blog_post',
        title: 'UI/UX Design Principles',
        slug: 'ui-ux-design-principles',
        author: 'Sarah Wilson',
        category: 'design',
        tags: ['frontend'],
        publication_date: '2024-03-25 16:45',
        featured: false,
        excerpt: 'Essential design principles for creating great user experiences.',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Good design is not just about aesthetics, but about creating intuitive and accessible experiences. Let\'s explore the fundamental principles that guide great design.'
                }
              ]
            }
          ]
        }
      }
    }
  ];

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
  console.log('🚀 Setting up Storyblok POC...\n');

  // Check for required environment variables
  if (!process.env.STORYBLOK_SPACE_ID || !process.env.STORYBLOK_MANAGEMENT_TOKEN) {
    console.error('❌ Missing required environment variables!');
    console.log('Please copy .env.example to .env and fill in your Storyblok credentials.');
    process.exit(1);
  }

  // Debug logging
  console.log('🔍 Debug Info:');
  console.log(`   Space ID: ${process.env.STORYBLOK_SPACE_ID}`);
  console.log(`   Management Token: ${process.env.STORYBLOK_MANAGEMENT_TOKEN ? '***' + process.env.STORYBLOK_MANAGEMENT_TOKEN.slice(-4) : 'missing'}`);
  console.log('');

  try {
    // Test API connection first
    console.log('🔌 Testing API connection...');
    const testResponse = await storyblokApi.get(`spaces/${SPACE_ID}`);
    console.log(`✅ Connected to space: ${testResponse.data.space.name}`);
    console.log('');

    // Step 1: Create content type
    await createBlogPostContentType();

    // Step 2: Create mock data
    await createMockBlogPosts();

    console.log('\n✅ Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run "npm run query" to see query examples');
    console.log('2. Check your Storyblok space to see the created content');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setup();