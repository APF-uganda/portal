/**
 * CMS Service - Strapi API Integration
 * Handles all CMS content fetching from Strapi
 */

// import { CMS_API_URL } from '../config/api';
// import {
//   adaptStrapiCollection,
//   adaptStrapiSingle,
//   extractMediaUrl,
//   extractRelation,
//   buildStrapiQuery,
// } from './strapiAdapter';

// Type definitions matching frontend expectations
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  slug?: string;
  content?: string;
}