// Storyblok POC - Complete Example
// This demonstrates creating content types, adding data, and querying

const StoryblokClient = require('storyblok-js-client');

// Initialize clients
// You'll need to get these tokens from your Storyblok space settings
const managementClient = new StoryblokClient({
  oauthToken: 'YOUR_MANAGEMENT_TOKEN', // For creating content types and adding content
});

const deliveryClient = new StoryblokClient({
  accessToken: 'YOUR_PREVIEW_TOKEN', // For querying content
  cache: {
    clear: 'auto',
    type: 'memory'
  }
});

const SPACE_ID = 'YOUR_SPACE_ID'; // Your Storyblok space ID

// 1. Define the Blog Post Content Type
async function createBlogPostContentType() {
  try {
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
        },
        image: {
          type: 'asset',
          pos: 9,
          display_name: 'Featured Image',
          filetypes: ['images']
        }
      }
    };

    const response = await managementClient.post(`spaces/${SPACE_ID}/components`, {
      component: blogPostSchema
    });

    console.log('✅ Blog Post content type created:', response.data.component.name);
    return response.data.component;
  } catch (error) {
    console.error('❌ Error creating content type:', error.response?.data || error.message);
    throw error;
  }
}

// 2. Create Mock Blog Posts
async function createMockBlogPosts() {
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
                  text: 'Storyblok is a powerful headless CMS that makes content management easy for both developers and content creators.'
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
                  text: 'In this post, we will explore compound components, render props, and custom hooks.'
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
                  text: 'Learn how to create scalable and maintainable APIs using Node.js and Express.'
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
                  text: 'Good design is not just about aesthetics, but about creating intuitive and accessible experiences.'
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
      const response = await managementClient.post(`spaces/${SPACE_ID}/stories`, {
        story: {
          name: post.name,
          slug: post.slug,
          content: post.content,
          is_folder: false,
          parent_id: 0
        }
      });

      console.log(`✅ Created blog post: ${post.name}`);
      createdPosts.push(response.data.story);
    } catch (error) {
      console.error(`❌ Error creating post "${post.name}":`, error.response?.data || error.message);
    }
  }

  return createdPosts;
}

// 3. Query Examples
async function queryExamples() {
  console.log('\n🔍 Query Examples:');

  try {
    // Example 1: Get all blog posts
    console.log('\n1. All blog posts:');
    const allPosts = await deliveryClient.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        }
      }
    });
    console.log(`Found ${allPosts.data.stories.length} blog posts`);

    // Example 2: Get featured posts only
    console.log('\n2. Featured posts only:');
    const featuredPosts = await deliveryClient.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        featured: {
          is: true
        }
      }
    });
    console.log(`Found ${featuredPosts.data.stories.length} featured posts`);
    featuredPosts.data.stories.forEach(story => {
      console.log(`  - ${story.content.title}`);
    });

    // Example 3: Get posts by category
    console.log('\n3. Technology posts:');
    const techPosts = await deliveryClient.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        category: {
          in: 'technology'
        }
      }
    });
    console.log(`Found ${techPosts.data.stories.length} technology posts`);
    techPosts.data.stories.forEach(story => {
      console.log(`  - ${story.content.title} by ${story.content.author}`);
    });

    // Example 4: Get posts by tags
    console.log('\n4. Posts tagged with "javascript":');
    const jsPosts = await deliveryClient.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        tags: {
          in_array: 'javascript'
        }
      }
    });
    console.log(`Found ${jsPosts.data.stories.length} JavaScript posts`);
    jsPosts.data.stories.forEach(story => {
      console.log(`  - ${story.content.title}`);
    });

    // Example 5: Get posts by date range
    console.log('\n5. Posts published after February 1, 2024:');
    const recentPosts = await deliveryClient.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        publication_date: {
          gt_date: '2024-02-01'
        }
      }
    });
    console.log(`Found ${recentPosts.data.stories.length} recent posts`);
    recentPosts.data.stories.forEach(story => {
      console.log(`  - ${story.content.title} (${story.content.publication_date})`);
    });

    // Example 6: Complex query - Featured tech posts with specific tags
    console.log('\n6. Featured technology posts with React or Node.js tags:');
    const complexQuery = await deliveryClient.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        category: {
          in: 'technology'
        },
        featured: {
          is: true
        },
        tags: {
          in_array: 'react,nodejs'
        }
      }
    });
    console.log(`Found ${complexQuery.data.stories.length} posts matching complex criteria`);
    complexQuery.data.stories.forEach(story => {
      console.log(`  - ${story.content.title} (Tags: ${story.content.tags?.join(', ')})`);
    });

  } catch (error) {
    console.error('❌ Error querying content:', error.response?.data || error.message);
  }
}

// Main execution function
async function runPOC() {
  console.log('🚀 Starting Storyblok POC...\n');

  try {
    // Step 1: Create content type
    console.log('Step 1: Creating Blog Post content type...');
    await createBlogPostContentType();

    // Step 2: Create mock data
    console.log('\nStep 2: Creating mock blog posts...');
    await createMockBlogPosts();

    // Wait a moment for content to be indexed
    console.log('\nWaiting for content to be indexed...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Query examples
    console.log('\nStep 3: Running query examples...');
    await queryExamples();

    console.log('\n✅ POC completed successfully!');
  } catch (error) {
    console.error('\n❌ POC failed:', error.message);
  }
}

// Export for use
module.exports = {
  createBlogPostContentType,
  createMockBlogPosts,
  queryExamples,
  runPOC
};

// Run if called directly
if (require.main === module) {
  runPOC();
}