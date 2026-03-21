/**
 * Forum API Client
 * * Handles communication with the backend API for forum operations.
 * Following SOLID principles with proper separation of concerns.
 */

import axios, { AxiosError } from 'axios';
import { API_V1_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';
import {
  ForumPost,
  ForumPostDetail,
  Category,
  Tag,
  Comment,
  Report,
  ForumStats,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  CreateReportRequest,
  ForumPostFilters,
  PaginatedResponse,
} from '../components/adminForum-components/types';

// Base URL for forum endpoints
const FORUM_BASE_URL = `${API_V1_BASE_URL}/forum`;

/**
 * Generic error handler for API calls
 */
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    
    // Handle authentication errors
    if (axiosError.response?.status === 401) {
      console.error('Authentication error: Token invalid or expired');
      throw new Error('Your session has expired. Please login again.');
    }
    
    // Handle other errors
    const message = axiosError.response?.data?.detail || 
                    axiosError.response?.data?.message || 
                    axiosError.message ||
                    'An unexpected error occurred';
    throw new Error(message);
  }
  throw error;
};

/**
 * Build query string from filters object
 */
const buildQueryString = (filters: Record<string, any>): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return params.toString();
};

/**
 * Get authentication token from storage
 */
const getAuthToken = (): string | null => {
  return getAccessToken();
};

/**
 * Get axios config with authentication
 */
const getAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
  };
};

// ============================================================================
// POST OPERATIONS
// ============================================================================

/**
 * Fetch all forum posts with optional filters
 */
export const fetchForumPosts = async (
  filters?: ForumPostFilters
): Promise<PaginatedResponse<ForumPost>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('No access token found. User may need to login.');
      throw new Error('Authentication required. Please login to view posts.');
    }

    const queryString = filters ? buildQueryString(filters) : '';
    const url = `${FORUM_BASE_URL}/posts/${queryString ? `?${queryString}` : ''}`;
    console.log('📤 Fetching forum posts from:', url);
    
    const response = await axios.get<PaginatedResponse<ForumPost>>(url, getAuthConfig());
    console.log('✅ Forum posts fetched successfully:', response.data);
    console.log('📊 Total posts received:', response.data.results?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching forum posts:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    return handleApiError(error);
  }
};

/**
 * Fetch a single forum post by ID
 */
export const fetchForumPostById = async (id: number): Promise<ForumPostDetail> => {
  try {
    const response = await axios.get<ForumPostDetail>(
      `${FORUM_BASE_URL}/posts/${id}/`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a new forum post
 */
export const createForumPost = async (data: CreatePostRequest): Promise<ForumPost> => {
  try {
    console.log('📤 Creating forum post:', data);
    
    const response = await axios.post<ForumPost>(
      `${FORUM_BASE_URL}/posts/`,
      data,
      getAuthConfig()
    );
    
    console.log('✅ Post created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating post:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
    return handleApiError(error);
  }
};

/**
 * Update an existing forum post
 */
export const updateForumPost = async (
  id: number,
  data: UpdatePostRequest
): Promise<ForumPost> => {
  try {
    const response = await axios.patch<ForumPost>(
      `${FORUM_BASE_URL}/posts/${id}/`,
      data,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a forum post
 */
export const deleteForumPost = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${FORUM_BASE_URL}/posts/${id}/`, getAuthConfig());
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Like a forum post
 */
export const likeForumPost = async (id: number): Promise<{ message: string; like_count: number }> => {
  try {
    const response = await axios.post(
      `${FORUM_BASE_URL}/posts/${id}/like/`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Unlike a forum post
 */
export const unlikeForumPost = async (id: number): Promise<{ message: string; like_count: number }> => {
  try {
    const response = await axios.post(
      `${FORUM_BASE_URL}/posts/${id}/unlike/`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Toggle pin status of a post
 */
export const togglePinPost = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${FORUM_BASE_URL}/posts/${id}/toggle_pin/`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Toggle lock status of a post
 */
export const toggleLockPost = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${FORUM_BASE_URL}/posts/${id}/toggle_lock/`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// CATEGORY OPERATIONS (Now with Safety Fallback)
// ============================================================================

/**
 * Fetch all categories
 */
/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${FORUM_BASE_URL}/categories/`, getAuthConfig());
    const data = response.data;
    const results = Array.isArray(data) ? data : data.results || [];
    
    if (results.length > 0) return results;

    // Fallback with all required Category properties to satisfy TypeScript
    const now = new Date().toISOString();
    return [
      { id: 1, name: 'Announcements', slug: 'announcements', post_count: 0, description: 'Official updates', icon: 'megaphone', created_at: now, updated_at: now },
      { id: 2, name: 'Suggestions', slug: 'suggestions', post_count: 0, description: 'Share your ideas', icon: 'lightbulb', created_at: now, updated_at: now },
      { id: 3, name: 'General Discussion', slug: 'general', post_count: 0, description: 'Talk about anything', icon: 'message-square', created_at: now, updated_at: now },
      { id: 4, name: 'Q&A Support', slug: 'qa', post_count: 0, description: 'Get help from others', icon: 'help-circle', created_at: now, updated_at: now },
      { id: 5, name: 'Professional Tips', slug: 'tips', post_count: 0, description: 'Career advice', icon: 'briefcase', created_at: now, updated_at: now },
      { id: 6, name: 'Networking', slug: 'networking', post_count: 0, description: 'Connect with peers', icon: 'users', created_at: now, updated_at: now }
    ] as Category[];
  } catch (error) {
    const now = new Date().toISOString();
    return [
      { id: 1, name: 'Announcements', slug: 'announcements', post_count: 0, description: 'Official updates', icon: 'megaphone', created_at: now, updated_at: now },
      { id: 2, name: 'Suggestions', slug: 'suggestions', post_count: 0, description: 'Share your ideas', icon: 'lightbulb', created_at: now, updated_at: now },
      { id: 3, name: 'General Discussion', slug: 'general', post_count: 0, description: 'Talk about anything', icon: 'message-square', created_at: now, updated_at: now },
      { id: 4, name: 'Q&A Support', slug: 'qa', post_count: 0, description: 'Get help from others', icon: 'help-circle', created_at: now, updated_at: now },
      { id: 5, name: 'Professional Tips', slug: 'tips', post_count: 0, description: 'Career advice', icon: 'briefcase', created_at: now, updated_at: now },
      { id: 6, name: 'Networking', slug: 'networking', post_count: 0, description: 'Connect with peers', icon: 'users', created_at: now, updated_at: now }
    ] as Category[];
  }
};

/**
 * Fetch a single category by slug
 */
export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const response = await axios.get<Category>(
      `${FORUM_BASE_URL}/categories/${slug}/`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// TAG & COMMENT & REPORT & STATS OPERATIONS 
// ============================================================================

export const fetchTags = async (search?: string): Promise<Tag[]> => {
  try {
    const url = search ? `${FORUM_BASE_URL}/tags/?search=${encodeURIComponent(search)}` : `${FORUM_BASE_URL}/tags/`;
    const response = await axios.get<Tag[]>(url, getAuthConfig());
    if (Array.isArray(response.data)) return response.data;
    if (response.data && 'results' in response.data) return (response.data as any).results;
    return [];
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchComments = async (postId: number, parentOnly?: boolean): Promise<Comment[]> => {
  try {
    const params = new URLSearchParams({ post: String(postId) });
    if (parentOnly) params.append('parent_only', 'true');
    const response = await axios.get<Comment[]>(`${FORUM_BASE_URL}/comments/?${params.toString()}`, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
  try {
    const response = await axios.post<Comment>(`${FORUM_BASE_URL}/comments/`, data, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateComment = async (id: number, content: string): Promise<Comment> => {
  try {
    const response = await axios.patch<Comment>(`${FORUM_BASE_URL}/comments/${id}/`, { content }, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteComment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${FORUM_BASE_URL}/comments/${id}/`, getAuthConfig());
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchReports = async (status?: string): Promise<Report[]> => {
  try {
    const url = status ? `${FORUM_BASE_URL}/reports/?status=${encodeURIComponent(status)}` : `${FORUM_BASE_URL}/reports/`;
    const response = await axios.get<Report[]>(url, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createReport = async (data: CreateReportRequest): Promise<Report> => {
  try {
    const response = await axios.post<Report>(`${FORUM_BASE_URL}/reports/`, data, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const reviewReport = async (id: number): Promise<Report> => {
  try {
    const response = await axios.post<Report>(`${FORUM_BASE_URL}/reports/${id}/review/`, {}, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const resolveReport = async (id: number): Promise<Report> => {
  try {
    const response = await axios.post<Report>(`${FORUM_BASE_URL}/reports/${id}/resolve/`, {}, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const dismissReport = async (id: number): Promise<Report> => {
  try {
    const response = await axios.post<Report>(`${FORUM_BASE_URL}/reports/${id}/dismiss/`, {}, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchForumStats = async (): Promise<ForumStats> => {
  try {
    const response = await axios.get<ForumStats>(`${FORUM_BASE_URL}/posts/stats/`, getAuthConfig());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================================================================
// EXPORT
// ============================================================================

export const forumApi = {
  fetchForumPosts,
  fetchForumPostById,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  likeForumPost,
  unlikeForumPost,
  togglePinPost,
  toggleLockPost,
  fetchCategories,
  fetchCategoryBySlug,
  fetchTags,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  fetchReports,
  createReport,
  reviewReport,
  resolveReport,
  dismissReport,
  fetchForumStats,
};

export default forumApi;