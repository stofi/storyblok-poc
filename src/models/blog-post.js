/**
 * Blog Post Content Type Schema
 * Defines the structure and fields for blog posts in Storyblok
 */

export const blogPostSchema = {
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