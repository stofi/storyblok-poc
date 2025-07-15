/**
 * Query Helper Functions
 * Reusable functions for common Storyblok queries
 */

/**
 * Get posts by category
 * @param {Object} storyblokApi - Storyblok API client
 * @param {string} category - Category to filter by
 * @returns {Promise<Object>} API response
 */
export async function getPostsByCategory(storyblokApi, category) {
  return await storyblokApi.get('cdn/stories', {
    filter_query: {
      component: { in: 'blog_post' },
      category: { in: category }
    }
  });
}

/**
 * Get featured posts
 * @param {Object} storyblokApi - Storyblok API client
 * @returns {Promise<Object>} API response
 */
export async function getFeaturedPosts(storyblokApi) {
  return await storyblokApi.get('cdn/stories', {
    filter_query: {
      component: { in: 'blog_post' },
      featured: { is: true }
    }
  });
}

/**
 * Get posts by tag
 * @param {Object} storyblokApi - Storyblok API client
 * @param {string} tag - Tag to filter by
 * @returns {Promise<Object>} API response
 */
export async function getPostsByTag(storyblokApi, tag) {
  return await storyblokApi.get('cdn/stories', {
    filter_query: {
      component: { in: 'blog_post' },
      tags: { in_array: tag }
    }
  });
}

/**
 * Get recent posts
 * @param {Object} storyblokApi - Storyblok API client
 * @param {number} limit - Number of posts to return
 * @returns {Promise<Object>} API response
 */
export async function getRecentPosts(storyblokApi, limit = 5) {
  return await storyblokApi.get('cdn/stories', {
    filter_query: {
      component: { in: 'blog_post' }
    },
    sort_by: 'content.publication_date:desc',
    per_page: limit
  });
}

/**
 * Get all blog posts
 * @param {Object} storyblokApi - Storyblok API client
 * @param {Object} options - Query options
 * @returns {Promise<Object>} API response
 */
export async function getAllPosts(storyblokApi, options = {}) {
  const defaultOptions = {
    filter_query: {
      component: { in: 'blog_post' }
    },
    sort_by: 'content.publication_date:desc'
  };

  return await storyblokApi.get('cdn/stories', { ...defaultOptions, ...options });
}

/**
 * Get single post by slug
 * @param {Object} storyblokApi - Storyblok API client
 * @param {string} slug - Post slug
 * @returns {Promise<Object>} API response
 */
export async function getPostBySlug(storyblokApi, slug) {
  return await storyblokApi.get(`cdn/stories/${slug}`);
}