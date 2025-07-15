# Storyblok POC

This is a proof of concept demonstrating how to use Storyblok's JavaScript SDK to:
1. Define custom content types (Blog Post)
2. Create and push mock data
3. Query content with various filters

## Prerequisites

1. Create a free Storyblok account at [storyblok.com](https://www.storyblok.com)
2. Create a new space
3. Get your API tokens from Settings > Access Tokens

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your Storyblok credentials:
   - `STORYBLOK_SPACE_ID`: Found in Settings > General
   - `STORYBLOK_MANAGEMENT_TOKEN`: Create in Settings > Access Tokens (needs write access)
   - `STORYBLOK_PREVIEW_TOKEN`: Found in Settings > Access Tokens (preview access)

3. **Run the setup:**
   ```bash
   npm run setup
   ```
   
   This will:
   - Create the "Blog Post" content type
   - Add 4 sample blog posts

4. **Test querying:**
   ```bash
   npm run query
   ```

## What Gets Created

### Content Type: Blog Post
- **Title** (text, required)
- **Slug** (text, required)
- **Author** (text, required)
- **Category** (dropdown: Technology, Design, Business, Tutorial)
- **Tags** (multi-select: JavaScript, React, Node.js, API, Frontend, Backend)
- **Publication Date** (datetime, required)
- **Featured** (boolean)
- **Excerpt** (textarea)
- **Content** (rich text, required)

### Sample Data
4 blog posts with different categories, tags, and publication dates to test various query scenarios.

## Query Examples

The POC demonstrates these query patterns:

1. **Get all posts**
2. **Filter by featured status**
3. **Filter by category**
4. **Filter by tags**
5. **Filter by date range**
6. **Complex multi-filter queries**
7. **Text search in titles**
8. **Filter by author**
9. **Pagination**
10. **Get single post by slug**

## Key Query Operators

- `in` - Match any of the provided values
- `not_in` - Don't match any of the values
- `is` - Exact match
- `in_array` - For multi-select fields (like tags)
- `gt_date` / `lt_date` - Date comparisons
- `like` - Text search with wildcards (*)

## Example Query Patterns

```javascript
// Featured posts only
const featuredPosts = await deliveryClient.get('cdn/stories', {
  filter_query: {
    component: { in: 'blog_post' },
    featured: { is: true }
  }
});

// Posts by category
const techPosts = await deliveryClient.get('cdn/stories', {
  filter_query: {
    component: { in: 'blog_post' },
    category: { in: 'technology' }
  }
});

// Posts with specific tags
const jsPosts = await deliveryClient.get('cdn/stories', {
  filter_query: {
    component: { in: 'blog_post' },
    tags: { in_array: 'javascript' }
  }
});

// Complex query
const complexQuery = await deliveryClient.get('cdn/stories', {
  filter_query: {
    component: { in: 'blog_post' },
    category: { in: 'technology' },
    featured: { is: true },
    tags: { in_array: 'react,nodejs' }
  }
});
```

## Files Structure

```
storyblok-poc/
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── .env                  # Your actual environment variables
├── setup.js              # Creates content types and sample data
├── query-examples.js     # Demonstrates various query patterns
└── README.md            # This file
```

## Evaluation Criteria

This POC helps you evaluate:

✅ **Content Modeling**: Can you define the content structure you need?
✅ **Data Management**: How easy is it to create and manage content programmatically?
✅ **Query Flexibility**: Can you filter and retrieve content the way your application needs?
✅ **Developer Experience**: How straightforward is the API and SDK?
✅ **Performance**: How fast are the queries? (Test with more data for real assessment)

## Next Steps

If this POC meets your needs, consider:

1. **Testing with larger datasets** to evaluate query performance
2. **Exploring the visual editor** in the Storyblok admin interface
3. **Integrating with your frontend framework** (React, Vue, Next.js, etc.)
4. **Setting up webhooks** for real-time content updates
5. **Testing the publishing workflow** with draft/published states

## Troubleshooting

- **401 Unauthorized**: Check your API tokens in `.env`
- **422 Content already exists**: The setup script handles this gracefully
- **Rate limiting**: The management API has rate limits; add delays if needed
- **Content not found**: Make sure to publish content or use the preview token

## Resources

- [Storyblok Documentation](https://www.storyblok.com/docs)
- [JavaScript SDK Documentation](https://github.com/storyblok/storyblok-js-client)
- [Content Delivery API](https://www.storyblok.com/docs/api/content-delivery/v2)
- [Management API](https://www.storyblok.com/docs/api/management)