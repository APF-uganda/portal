/**
 * Member Dashboard API Service
 *
 * Handles communication with the backend API for member dashboard data.
 */

import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';

export interface MemberDashboardProfile {
  display_name: string;
  membership_category: string;
  membership_status: string;
  member_since: string | null;
  next_renewal_date: string | null;
}

export interface MemberDashboardDocument {
  id: number;
  name: string;
  document_type: string;
  uploaded_at: string;
  file_url: string | null;
}

export interface MemberDashboardActivity {
  id: number;
  action: string;
  field_changed: string;
  timestamp: string;
}

export interface MemberDashboardNotification {
  id: number;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  application_id: number | null;
}

export interface MemberDashboardResponse {
  profile: MemberDashboardProfile;
  documents: MemberDashboardDocument[];
  recent_activity: MemberDashboardActivity[];
  notifications: MemberDashboardNotification[];
}

/**
 * Get authentication headers with JWT token
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('Member dashboard API error:', axiosError.response?.data || axiosError.message);
  }

  throw error;
}

/**
 * Fetch member dashboard data
 */
export async function fetchMemberDashboard(): Promise<MemberDashboardResponse> {
  try {
    const response = await axios.get<MemberDashboardResponse>(
      `${API_BASE_URL}/api/v1/member/dashboard/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch member dashboard data:', error);
    handleApiError(error);
  }
}
