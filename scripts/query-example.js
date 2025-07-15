import { createDeliveryClient } from '../src/config/storyblok.js';
import { 
  getAllPosts, 
  getFeaturedPosts, 
  getPostsByCategory, 
  getPostsByTag, 
  getRecentPosts,
  getPostBySlug 
} from '../src/utils/query-helpers.js';

// Initialize Storyblok client
const storyblokApi = createDeliveryClient();

// Query Examples
async function runQueryExamples() {
  console.log('🔍 Storyblok Query Examples\\n');

  try {
    // Example 1: Get all blog posts
    console.log('1️⃣  All blog posts:');
    const allPosts = await getAllPosts(storyblokApi);
    
    console.log(`   Found ${allPosts.data.stories.length} blog posts total`);
    allPosts.data.stories.forEach((story, index) => {
      console.log(`   ${index + 1}. ${story.content.title} by ${story.content.author}`);
    });

    // Example 2: Get featured posts only
    console.log('\\n2️⃣  Featured posts only:');
    const featuredPosts = await getFeaturedPosts(storyblokApi);
    
    console.log(`   Found ${featuredPosts.data.stories.length} featured posts`);
    featuredPosts.data.stories.forEach(story => {
      console.log(`   ⭐ ${story.content.title}`);
    });

    // Example 3: Get posts by category
    console.log('\\n3️⃣  Technology posts:');
    const techPosts = await getPostsByCategory(storyblokApi, 'technology');
    
    console.log(`   Found ${techPosts.data.stories.length} technology posts`);
    techPosts.data.stories.forEach(story => {
      console.log(`   🔧 ${story.content.title} by ${story.content.author}`);
    });

    // Example 4: Get posts by tags
    console.log('\\n4️⃣  Posts tagged with "javascript":');
    const jsPosts = await getPostsByTag(storyblokApi, 'javascript');
    
    console.log(`   Found ${jsPosts.data.stories.length} JavaScript posts`);
    jsPosts.data.stories.forEach(story => {
      console.log(`   📝 ${story.content.title} (Tags: ${story.content.tags?.join(', ')})`);
    });

    // Example 5: Get posts by date range
    console.log('\\n5️⃣  Posts published after February 1, 2024:');
    const recentPosts = await storyblokApi.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        publication_date: {
          gt_date: '2024-02-01'
        }
      }
    });
    
    console.log(`   Found ${recentPosts.data.stories.length} recent posts`);
    recentPosts.data.stories.forEach(story => {
      const date = new Date(story.content.publication_date).toLocaleDateString();
      console.log(`   📅 ${story.content.title} (${date})`);
    });

    // Example 6: Complex query - Featured tech posts with specific tags
    console.log('\\n6️⃣  Featured technology posts with React or Node.js tags:');
    const complexQuery = await storyblokApi.get('cdn/stories', {
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
    
    console.log(`   Found ${complexQuery.data.stories.length} posts matching complex criteria`);
    complexQuery.data.stories.forEach(story => {
      console.log(`   🎯 ${story.content.title} (Tags: ${story.content.tags?.join(', ')})`);
    });

    // Example 7: Search by text content
    console.log('\\n7️⃣  Posts with "API" in the title:');
    const apiPosts = await storyblokApi.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        title: {
          like: '*API*'
        }
      }
    });
    
    console.log(`   Found ${apiPosts.data.stories.length} posts with "API" in title`);
    apiPosts.data.stories.forEach(story => {
      console.log(`   🔍 ${story.content.title}`);
    });

    // Example 8: Get posts by specific author
    console.log('\\n8️⃣  Posts by Jane Smith:');
    const authorPosts = await storyblokApi.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        },
        author: {
          is: 'Jane Smith'
        }
      }
    });
    
    console.log(`   Found ${authorPosts.data.stories.length} posts by Jane Smith`);
    authorPosts.data.stories.forEach(story => {
      console.log(`   👤 ${story.content.title} (${story.content.category})`);
    });

    // Example 9: Pagination example
    console.log('\\n9️⃣  Pagination example (first 2 posts):');
    const paginatedPosts = await storyblokApi.get('cdn/stories', {
      filter_query: {
        component: {
          in: 'blog_post'
        }
      },
      per_page: 2,
      page: 1,
      sort_by: 'content.publication_date:desc'
    });
    
    console.log(`   Showing page 1, ${paginatedPosts.data.stories.length} of ${allPosts.data.stories.length} total posts`);
    paginatedPosts.data.stories.forEach((story, index) => {
      console.log(`   ${index + 1}. ${story.content.title}`);
    });

    // Example 10: Get single post by slug
    console.log('\\n🔟 Get single post by slug:');
    try {
      const singlePost = await getPostBySlug(storyblokApi, 'getting-started-storyblok');
      console.log(`   📖 Found: ${singlePost.data.story.content.title}`);
      console.log(`   📝 Excerpt: ${singlePost.data.story.content.excerpt}`);
    } catch (error) {
      console.log('   ❌ Post not found or not published yet');
    }

    console.log('\\n✅ All query examples completed!');
    console.log('\\n💡 Pro tips:');
    console.log('   - Use "gt_date", "lt_date" for date ranges');
    console.log('   - Use "in_array" for multi-select fields like tags');
    console.log('   - Use "like" with wildcards (*) for text search');
    console.log('   - Combine multiple filters for complex queries');
    console.log('   - Use pagination for large result sets');

  } catch (error) {
    console.error('❌ Error running queries:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\\n🔑 Check your STORYBLOK_PREVIEW_TOKEN in .env file');
    }
  }
}

// Export utility functions
export {
  runQueryExamples,
  getAllPosts,
  getFeaturedPosts,
  getPostsByCategory,
  getPostsByTag,
  getRecentPosts
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runQueryExamples();
}