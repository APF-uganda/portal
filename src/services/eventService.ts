import axios from 'axios';
import { API_BASE_URL } from '../config/api'; 


const cleanBaseUrl = API_BASE_URL.endsWith('/') 
  ? API_BASE_URL.slice(0, -1) 
  : API_BASE_URL;

const EVENTS_BASE_ROUTE = `${cleanBaseUrl}/api/events/`; 

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); 
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const eventService = {
  //  Submit Registration
  registerAttendee: async (formData: FormData) => {
   
    const response = await axios.post(`${EVENTS_BASE_ROUTE}register/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  },

  //  Fetch all registrations for Admin
  getAllRegistrations: async () => {
    const response = await axios.get(`${EVENTS_BASE_ROUTE}admin/registrations/`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

 
  verifyPayment: async (id: number) => {
    
    const response = await axios.patch(`${EVENTS_BASE_ROUTE}admin/verify/${id}/`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default eventService;