/**
 * API configuration (single source of truth)
 *
 * Important: `VITE_API_URL` may be configured with a trailing slash.
 * If we naively concatenate paths, we can produce URLs with `//` which
 * some servers normalize via 301/302 redirects. Browsers may then turn
 * a redirected POST into a GET, causing "Method GET not allowed".
 */

// Django Backend API (Authentication, Applications, Payments)
const ENV_API_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const FALLBACK_ORIGIN =
  typeof window !== 'undefined' ? window.location.origin.replace(/\/+$/, '') : 'http://localhost:8000';

export const API_BASE_URL = ENV_API_URL || FALLBACK_ORIGIN;
export const API_V1_BASE_URL = `${API_BASE_URL}/api/v1`;

// Strapi CMS API (Public Content)
const ENV_CMS_URL = (import.meta.env.VITE_CMS_URL || '').trim().replace(/\/+$/, '');
const ENV_CMS_ADMIN_URL = (import.meta.env.VITE_CMS_ADMIN_URL || '').trim().replace(/\/+$/, '');

export const CMS_BASE_URL = ENV_CMS_URL || FALLBACK_ORIGIN;
export const CMS_API_URL = ENV_CMS_URL ? `${CMS_BASE_URL}/api` : `${CMS_BASE_URL}/cms-api`;
export const CMS_ADMIN_URL = ENV_CMS_ADMIN_URL || (ENV_CMS_URL ? `${CMS_BASE_URL}/admin` : `${CMS_BASE_URL}/cms-admin`);

