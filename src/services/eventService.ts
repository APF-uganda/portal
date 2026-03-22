import axios from 'axios';
import { API_V1_BASE_URL } from '../config/api'; 


const EVENTS_BASE_ROUTE = `${API_V1_BASE_URL}/events`; 

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); 
  
  if (!token || token === 'null' || token === 'undefined') return {};
  return { Authorization: `Bearer ${token}` };
};

const eventService = {
  // Submit Registration
  registerAttendee: async (formData: FormData) => {
   
    const response = await axios.post(`${EVENTS_BASE_ROUTE}/register/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },


  getAllRegistrations: async (search: string = '') => {
   
    const url = search 
      ? `${EVENTS_BASE_ROUTE}/admin/registrations/?event_title=${encodeURIComponent(search)}`
      : `${EVENTS_BASE_ROUTE}/admin/registrations/`;

    const response = await axios.get(url, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Verify Payment
  verifyPayment: async (id: number) => {
    
    const response = await axios.patch(`${EVENTS_BASE_ROUTE}/admin/verify/${id}/`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // New helper for PDF Export URL
  getExportPdfUrl: (search: string = '') => {
    const token = localStorage.getItem('token');
    return `${EVENTS_BASE_ROUTE}/export-pdf/?event_title=${encodeURIComponent(search)}&token=${token}`;
  }
};

export default eventService;