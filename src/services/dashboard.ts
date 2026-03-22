/**
 * Dashboard API Service
 * 
 * Handles communication with the backend API for dashboard statistics and data.
 */

import { getAccessToken } from '../utils/authStorage';
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
  total_revenue: number;
  trends: {
    total_change: number;
    pending_change: number;
    approved_change: number;
    rejected_change: number;
    paid_change: number;
    revenue_change: number;
  };
}

/**
 * Recent application item for dashboard display
 */
interface PaymentStatisticsApiResponse {
  total_transactions: number;
  pending_revenue: number;
  total_revenue: number;
  growth_rates: {
    transactions: number;
    pending: number;
    revenue: number;
  };
}

export interface RecentApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  submitted_at: string;
}

/**
 * Recent payment item for dashboard display
 */
export interface RecentPayment {
  id: number;
  payment_id?: string;
  member_name: string;
  member_email?: string;
  amount: number;
  payment_method?: string;
  description?: string;
  reference?: string;
  currency?: string;
  status: string;
  created_at: string;
}

/**
 * Dashboard stats for UI display
 */
export interface DashboardStats {
  totalMembers: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  totalApplications: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  revenue: {
    value: string;
    change: number;
    trend: 'up' | 'down';
  };
}

/**
 * Get authentication headers with JWT token
 */
function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
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
export async function fetchDashboardStatistics(signal?: AbortSignal): Promise<DashboardStatistics> {
  try {
    const response = await axios.get<DashboardStatistics>(
      `${API_BASE_URL}/api/v1/applications/statistics/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
        signal,
      }
    );

    const appStats = response.data;

    try {
      const paymentStatsRes = await axios.get<PaymentStatisticsApiResponse>(
        `${API_BASE_URL}/api/v1/payments/statistics/`,
        {
          headers: getAuthHeaders(),
          timeout: 30000,
          signal,
        }
      );

      return {
        ...appStats,
        total_revenue: paymentStatsRes.data.total_revenue ?? appStats.total_revenue,
        trends: {
          ...appStats.trends,
          revenue_change: paymentStatsRes.data.growth_rates?.revenue ?? appStats.trends.revenue_change,
        },
      };
    } catch (paymentStatsError) {
      console.warn('Failed to align dashboard revenue with payment statistics:', paymentStatsError);
      return appStats;
    }
  } catch (error) {
    // Don't log errors if request was aborted
    if (axios.isCancel(error) || (error as Error).name === 'AbortError') {
      throw error;
    }
    
    console.error('Failed to fetch dashboard statistics:', error);
    // Return default values if API fails
    return {
      total_applications: 0,
      pending_applications: 0,
      approved_applications: 0,
      rejected_applications: 0,
      paid_applications: 0,
      total_revenue: 0,
      trends: {
        total_change: 0,
        pending_change: 0,
        approved_change: 0,
        rejected_change: 0,
        paid_change: 0,
        revenue_change: 0,
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
export async function fetchRecentApplications(limit: number = 5): Promise<RecentApplication[]> {
  try {
    const response = await axios.get<RecentApplication[]>(
      `${API_BASE_URL}/api/v1/applications/recent/`,
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

/**
 * Fetch recent payments for dashboard display
 */
export async function fetchRecentPayments(limit: number = 5): Promise<RecentPayment[]> {
  try {
    const response = await axios.get<any[]>(
      `${API_BASE_URL}/api/v1/payments/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    const rows = Array.isArray(response.data) ? response.data : [];

    return rows
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
      .map((p) => ({
        id: Number(p.id),
        payment_id: p.reference || p.invoice_number || p.application_id || String(p.id),
        member_name: p.member_name || p.member_email || p.reference || "Payment Record",
        member_email: p.member_email || "",
        amount: Number(p.amount || 0),
        payment_method: "manual_payment",
        description: p.description || "Manual Payment",
        reference: p.reference || p.invoice_number || p.application_id || "",
        currency: p.currency || "UGX",
        status: p.status || "pending",
        created_at: p.created_at,
      }));
  } catch (error) {
    console.error('Failed to fetch recent payments:', error);
    return [];
  }
}

/**
 * Fetch manual payment revenue for dashboard display
 */
export async function fetchManualPaymentRevenue(): Promise<number> {
  try {
    const response = await axios.get<{ total_revenue: number }>(
      `${API_BASE_URL}/api/v1/payments/revenue/`,
      {
        headers: getAuthHeaders(),
        timeout: 30000,
      }
    );

    return response.data.total_revenue;
  } catch (error) {
    console.error('Failed to fetch manual payment revenue:', error);
    return 0;
  }
}
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const stats = await fetchDashboardStatistics();
    
    // Format revenue in UGX with proper formatting
    const formatUGX = (amount: number): string => {
      if (amount >= 1000000000) {
        return `UGX ${(amount / 1000000000).toFixed(2)}B`;
      } else if (amount >= 1000000) {
        return `UGX ${(amount / 1000000).toFixed(2)}M`;
      } else if (amount >= 1000) {
        return `UGX ${(amount / 1000).toFixed(2)}K`;
      }
      return `UGX ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    
    return {
      totalMembers: {
        value: stats.approved_applications,
        change: Math.abs(stats.trends.approved_change),
        trend: stats.trends.approved_change >= 0 ? 'up' : 'down'
      },
      totalApplications: {
        value: stats.total_applications,
        change: Math.abs(stats.trends.total_change),
        trend: stats.trends.total_change >= 0 ? 'up' : 'down'
      },
      revenue: {
        value: formatUGX(stats.total_revenue),
        change: Math.abs(stats.trends.revenue_change),
        trend: stats.trends.revenue_change >= 0 ? 'up' : 'down'
      }
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    // Return default values
    return {
      totalMembers: {
        value: 0,
        change: 0,
        trend: 'up'
      },
      totalApplications: {
        value: 0,
        change: 0,
        trend: 'up'
      },
      revenue: {
        value: 'UGX 0.00',
        change: 0,
        trend: 'up'
      }
    };
  }
}
