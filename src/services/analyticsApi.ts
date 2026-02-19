import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';

// Define the Interface here so other files can import it
export interface ReportTemplate {
  id: string;
  name: string;
  report_type: string;
  report_type_display: string;
  description: string;
  output_format: string;
  created_at: string;
  chart_configs?: {
    preview_data?: number[];
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyticsApi = {
  // Get all templates
  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    const response = await api.get('/api/v1/reports/templates/');
    return response.data;
  },

  // CREATE a new Template
  createReportTemplate: async (data: any): Promise<ReportTemplate> => {
    const response = await api.post('/api/v1/reports/templates/', data);
    return response.data;
  },

  // TRIGGER a new Report Generation
  generateReport: async (templateId: string, title: string, format: string) => {
    const response = await api.post('/api/v1/reports/generated-reports/', {
      template: templateId,
      title: title,
      file_format: format
    });
    return response.data;
  },

  // GET Recently Generated Reports
  getGeneratedReports: async () => {
    const response = await api.get('/api/v1/reports/generated-reports/');
    return response.data;
  }
};

export default analyticsApi;