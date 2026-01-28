/**
 * API configuration (single source of truth)
 *
 * Important: `VITE_API_URL` may be configured with a trailing slash.
 * If we naively concatenate paths, we can produce URLs with `//` which
 * some servers normalize via 301/302 redirects. Browsers may then turn
 * a redirected POST into a GET, causing "Method GET not allowed".
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(
  /\/+$/,
  ''
);

export const API_V1_BASE_URL = `${API_BASE_URL}/api/v1`;

