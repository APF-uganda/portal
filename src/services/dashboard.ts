/**
 * Dashboard API Service
 * 
 * Handles communication with the backend API for dashboard statistics and data.
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/api';

/**
 * Dashboard statistics response from backend
 */
export interface DashboardStatistics {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  paid_applications: number;
  trends: {
    total_change: number;
    pending_change: number;
    approved_change: number;
    rejected_change: number;
    paid_change: number;
  };
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

/**
 * Fetch comprehensive dashboard statistics
 */
export async function fetchDashboardStatistics(): Promise<DashboardStatistics> {
  try {
    const response = await axios.get<DashboardStatistics>(
      `${API_BASE_URL}/api/v1/statistics/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard statistics:', error);
    // Return default values if API fails
    return {
      total_applications: 0,
      pending_applications: 0,
      approved_applications: 0,
      rejected_applications: 0,
      paid_applications: 0,
      trends: {
        total_change: 0,
        pending_change: 0,
        approved_change: 0,
        rejected_change: 0,
        paid_change: 0,
      },
    };
  }
}

/**
 * Fetch total number of applications
 */
export async function fetchTotalApplications(): Promise<number> {
  try {
    const stats = await fetchDashboardStatistics();
    return stats.total_applications;
  } catch (error) {
    console.error('Failed to fetch total applications:', error);
    return 0;
  }
}

/**
 * Fetch total number of members (approved applications)
 */
export async function fetchTotalMembers(): Promise<number> {
  try {
    const stats = await fetchDashboardStatistics();
    return stats.approved_applications;
  } catch (error) {
    console.error('Failed to fetch total members:', error);
    return 0;
  }
}

/**
 * Fetch recent applications for dashboard display
 */
export async function fetchRecentApplications(limit: number = 5) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/recent-applications/`,
      {
        headers: getAuthHeaders(),
        params: { limit },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch recent applications:', error);
    return [];
  }
}