import axios from 'axios';
import { API_BASE_URL } from '../config/api'; 


const EVENTS_BASE_ROUTE = `${API_BASE_URL}/events`;

const eventService = {
 
  registerAttendee: async (formData: FormData) => {
    return await axios.post(`${EVENTS_BASE_ROUTE}/register/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Matches: path('admin/registrations/', AdminRegistrationListView.as_view(), ...)
  getAllRegistrations: async () => {
    const response = await axios.get(`${EVENTS_BASE_ROUTE}/admin/registrations/`);
    return response.data;
  },

   verifyPayment: async (id: number) => {

    const response = await axios.patch(`${EVENTS_BASE_ROUTE}/admin/verify/${id}/`);
    return response.data;
  }
};

export default eventService;