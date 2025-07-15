/**
 * Storyblok Client Configuration
 * Centralized configuration for Storyblok API clients
 */

import dotenv from 'dotenv';
import { storyblokInit, apiPlugin } from '@storyblok/js';

dotenv.config();

/**
 * Create Storyblok client for Content Delivery API
 * @returns {Object} Storyblok API client
 */
export function createDeliveryClient() {
  const { storyblokApi } = storyblokInit({
    accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    cache: {
      clear: 'auto',
      type: 'memory'
    },
    apiOptions: {
      version: 'draft' // Use draft version to see unpublished content
    }
  });

  return storyblokApi;
}

/**
 * Create Storyblok client for Management API
 * @returns {Object} Storyblok API client
 */
export function createManagementClient() {
  const { storyblokApi } = storyblokInit({
    accessToken: process.env.STORYBLOK_MANAGEMENT_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      oauthToken: process.env.STORYBLOK_MANAGEMENT_TOKEN,
    }
  });

  return storyblokApi;
}

/**
 * Get space ID from environment variables
 * @returns {string} Space ID
 */
export function getSpaceId() {
  return process.env.STORYBLOK_SPACE_ID;
}

/**
 * Validate required environment variables
 * @throws {Error} If required environment variables are missing
 */
export function validateEnvironment() {
  const requiredVars = [
    'STORYBLOK_SPACE_ID',
    'STORYBLOK_MANAGEMENT_TOKEN',
    'STORYBLOK_PREVIEW_TOKEN'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}