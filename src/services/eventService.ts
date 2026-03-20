import axios from 'axios';
import { API_BASE_URL } from '../config/api'; 


const EVENTS_BASE_ROUTE = `${API_BASE_URL}/events`;

const eventService = {
 
  // 1. Submit Registration
  registerAttendee: async (formData: FormData) => {
    
    const response = await axios.post(`${EVENTS_BASE_ROUTE}/register/`, formData);
    return response.data;
  },

  // 2. Fetch all registrations for Admin
  getAllRegistrations: async () => {
    // Matches: path('admin/registrations/', ...)
    const response = await axios.get(`${EVENTS_BASE_ROUTE}/admin/registrations/`);
    return response.data;
  },

  // 3. Verify Payment
  verifyPayment: async (id: number) => {
    // Matches: path('admin/verify/<int:id>/', ...)
    const response = await axios.patch(`${EVENTS_BASE_ROUTE}/admin/verify/${id}/`);
    return response.data;
  }
};

export default eventService;