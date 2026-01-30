/**
 * Authentication utilities
 */

export interface User {
  id: number;
  email: string;
  role: string;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}

/**
 * Get current user data
 */
export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === '1';
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

/**
 * Redirect to login if not authenticated
 */
export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

/**
 * Redirect to login if not admin
 */
export function requireAdmin(): boolean {
  if (!isAuthenticated() || !isAdmin()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}