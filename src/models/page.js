/**
 * Page Component Schema
 * Defines the structure for the root page component in Storyblok
 */

export const PAGE_COMPONENT = 'page';

export const pageSchema = {
  name: PAGE_COMPONENT,
  display_name: null,
  schema: {
    body: {
      type: 'bloks'
    }
  },
  is_root: true,
  is_nestable: false
};