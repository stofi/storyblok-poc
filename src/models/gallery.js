/**
 * Gallery Component Schemas
 * Defines the structure for gallery and gallery item components in Storyblok
 */

export const GALLERY_COMPONENT = 'gallery';
export const GALLERY_ITEM_IMAGE_COMPONENT = 'gallery_item_image';
export const GALLERY_ITEM_VIDEO_COMPONENT = 'gallery_item_video';

export const gallerySchema = {
  name: GALLERY_COMPONENT,
  display_name: null,
  description: '',
  schema: {
    items: {
      type: 'bloks',
      pos: 0,
      minimum: 1,
      restrict_type: '',
      restrict_components: true,
      component_whitelist: [
        GALLERY_ITEM_IMAGE_COMPONENT,
        GALLERY_ITEM_VIDEO_COMPONENT
      ]
    }
  },
  is_root: false,
  is_nestable: true
};

export const galleryItemImageSchema = {
  name: GALLERY_ITEM_IMAGE_COMPONENT,
  display_name: null,
  description: 'Gallery Item Image',
  schema: {
    image: {
      type: 'asset',
      pos: 0,
      filetypes: ['images']
    },
    caption: {
      type: 'text',
      pos: 1
    }
  },
  is_root: false,
  is_nestable: true
};

export const galleryItemVideoSchema = {
  name: GALLERY_ITEM_VIDEO_COMPONENT,
  display_name: null,
  description: '',
  schema: {
    source: {
      type: 'multilink',
      pos: 0
    },
    caption: {
      type: 'text',
      pos: 1
    },
    poster: {
      type: 'asset',
      pos: 2,
      filetypes: ['images']
    },
    width: {
      type: 'number',
      pos: 3,
      decimals: 0
    },
    height: {
      type: 'number',
      pos: 4,
      decimals: 0
    }
  },
  is_root: false,
  is_nestable: true
};