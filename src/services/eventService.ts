import axios from 'axios';
import { API_V1_BASE_URL } from '../config/api'; 


const EVENTS_BASE_ROUTE = `${API_V1_BASE_URL}/events`; 

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); 
  // Prevent sending 'Bearer null' which causes 401/403 errors
  if (!token || token === 'null') return {};
  return { Authorization: `Bearer ${token}` };
};

const eventService = {
  //  Submit Registration
  registerAttendee: async (formData: FormData) => {
   
    const response = await axios.post(`${EVENTS_BASE_ROUTE}/register/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  },

  //  Fetch all registrations (Admin)
  getAllRegistrations: async () => {
    
    const response = await axios.get(`${EVENTS_BASE_ROUTE}/admin/registrations/`, {
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
  }
};

export default eventService;