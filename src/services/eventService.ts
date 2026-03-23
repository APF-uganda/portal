import axios from 'axios';
import { API_V1_BASE_URL } from '../config/api'; 

import { getAccessToken } from '../utils/authStorage'; 

const EVENTS_BASE_ROUTE = `${API_V1_BASE_URL}/events`; 

/**
 * Dynamically retrieves the Bearer token from sessionStorage.
 * 
 */
const getAuthHeader = () => {
  const token = getAccessToken(); 
  
  if (!token) {
    console.warn('[EventService] Request made without an active session token.');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

const eventService = {
  /**
   * Submit Registration (Public Access)
   * No auth header needed here as attendees are guests.
   */
  registerAttendee: async (formData: FormData) => {
    const response = await axios.post(`${EVENTS_BASE_ROUTE}/register/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Admin: Get all registrations
   * Uses URLSearchParams for cleaner query string handling.
   */
  getAllRegistrations: async (search: string = '') => {
    const url = `${EVENTS_BASE_ROUTE}/admin/registrations/`;
    
    const response = await axios.get(url, {
      headers: getAuthHeader(),
     
      params: search ? { event_title: search } : {}
    });
    return response.data;
  },

  /**
   * Admin: Verify Payment Status
   */
  verifyPayment: async (id: number) => {
    const response = await axios.patch(
      `${EVENTS_BASE_ROUTE}/admin/verify/${id}/`, 
      {}, 
      { headers: getAuthHeader() }
    );
    return response.data;
  },

 
  getExportPdfUrl: (search: string = '') => {
    const token = getAccessToken();
    const baseUrl = `${EVENTS_BASE_ROUTE}/admin/export-pdf/`;
    const params = new URLSearchParams();
    
    if (search) params.append('event_title', search);
    if (token) params.append('token', token);

    return `${baseUrl}?${params.toString()}`;
  }
};

export default eventService;