/**
 * Analytics API service for reports and dashboard data
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Analytics data types
export interface MembershipAnalytics {
  total_members: number;
  total_admins: number;
  applications_by_status: Array<{
    status: string;
    count: number;
  }>;
  monthly_growth: Array<{
    month: string;
    count: number;
  }>;
  profile_completion: {
    with_picture: number;
    total_profiles: number;
    completion_rate: number;
  };
}

export interface ApplicationAnalytics {
  total_applications: number;
  status_breakdown: {
    pending: number;
    approved: number;
    rejected: number;
  };
  weekly_trends: Array<{
    week: string;
    count: number;
  }>;
  daily_trends: Array<{
    day: string;
    count: number;
  }>;
}

export interface SystemAnalytics {
  active_users_period: number;
  active_users_30d?: number;
  recent_profile_updates: number;
  system_health: {
    total_users: number;
    users_with_profiles: number;
    profile_adoption_rate: number;
  };
  system_health_score?: number;
}

export interface ComprehensiveAnalytics {
  membership: MembershipAnalytics;
  applications: ApplicationAnalytics;
  system: SystemAnalytics;
  generated_at: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
  title: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  report_type: string;
  report_type_display: string;
  description: string;
  output_format: string;
  output_format_display: string;
  fields_to_include: string[];
  filters: Record<string, any>;
  chart_configs: Record<string, any>;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_system_template: boolean;
}

// API functions
export const analyticsApi = {
  // Get comprehensive analytics
  getComprehensiveAnalytics: async (): Promise<ComprehensiveAnalytics> => {
    try {
      const response = await api.get('/api/v1/reports/analytics/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch comprehensive analytics:', error);
      throw error;
    }
  },

  // Get membership analytics
  getMembershipAnalytics: async (): Promise<MembershipAnalytics> => {
    try {
      const response = await api.get('/api/v1/reports/analytics/membership/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch membership analytics:', error);
      throw error;
    }
  },

  // Get application analytics
  getApplicationAnalytics: async (): Promise<ApplicationAnalytics> => {
    try {
      const response = await api.get('/api/v1/reports/analytics/applications/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch application analytics:', error);
      throw error;
    }
  },

  // Get chart data
  getChartData: async (type: string, period: string = '30d'): Promise<ChartData> => {
    try {
      const response = await api.get(`/api/v1/reports/analytics/charts/?type=${type}&period=${period}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch chart data for ${type}:`, error);
      throw error;
    }
  },

  // Get specific chart types
  getMembershipGrowthChart: (period: string = '30d') => 
    analyticsApi.getChartData('membership_growth', period),

  getApplicationStatusChart: () => 
    analyticsApi.getChartData('application_status'),

  getDailyActivityChart: (period: string = '30d') => 
    analyticsApi.getChartData('daily_activity', period),

  // Get dashboard summary
  getDashboardSummary: async () => {
    try {
      const response = await api.get('/api/v1/reports/dashboard/summary/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
      throw error;
    }
  },

  // Get available charts
  getAvailableCharts: async () => {
    try {
      const response = await api.get('/api/v1/reports/analytics/charts/available/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch available charts:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/api/v1/reports/system/health/');
      return response.data;
    } catch (error) {
      console.error('Failed to check analytics health:', error);
      throw error;
    }
  },

  // Get report templates
  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    try {
      const response = await api.get('/api/v1/reports/templates/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch report templates:', error);
      throw error;
    }
  },

  // Get single report template
  getReportTemplate: async (id: string): Promise<ReportTemplate> => {
    try {
      const response = await api.get(`/api/v1/reports/templates/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch report template ${id}:`, error);
      throw error;
    }
  },
};

export default analyticsApi;