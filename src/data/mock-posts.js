/**
 * Mock Blog Posts Data
 * Sample data for testing and demonstration purposes
 */

import { BLOG_POST_COMPONENT } from '../models/blog-post.js';

export const mockPosts = [
  {
    name: 'Getting Started with Storyblok',
    slug: 'getting-started-storyblok',
    content: {
      component: BLOG_POST_COMPONENT,
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
      component: BLOG_POST_COMPONENT,
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
      component: BLOG_POST_COMPONENT,
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
      component: BLOG_POST_COMPONENT,
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