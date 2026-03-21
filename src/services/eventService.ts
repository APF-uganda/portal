import axios from 'axios';
import { API_BASE_URL } from '../config/api'; 

const EVENTS_BASE_ROUTE = `${API_BASE_URL}/api/events`; 

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); 
  return { Authorization: `Bearer ${token}` };
};

const eventService = {
  // Submit Registration 
  registerAttendee: async (formData: FormData) => {
    
    const response = await axios.post(`${EVENTS_BASE_ROUTE}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  },

  //  Fetch all registrations 
  getAllRegistrations: async () => {
    const response = await axios.get(`${EVENTS_BASE_ROUTE}/admin/registrations/`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  //Verify Payment 
  verifyPayment: async (id: number) => {
 
    const response = await axios.patch(`${EVENTS_BASE_ROUTE}/admin/verify/${id}/`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default eventService;