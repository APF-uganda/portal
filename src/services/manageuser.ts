import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { User } from '../components/manageusers-components/users';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export const userManagementApi = {
  
  fetchMembers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/admin-management/members/`, {
      headers: getAuthHeaders(),
      timeout: 30000,
    });

   
    console.log("Raw API Response:", response.data);

    
    const rawData = Array.isArray(response.data) 
      ? response.data 
      : (response.data.results || []);

    return rawData.map((member: any) => ({
      id: member.id.toString(),
    
      name: (member.first_name || member.last_name) 
        ? `${member.first_name || ''} ${member.last_name || ''}`.trim() 
        : (member.username || member.email || "Unknown Member"),
      email: member.email,
     
      status: member.status || 'Active', 
      renewalDate: member.renewal_date || 'N/A',
    }));
  },

  suspendMember: async (id: string) => {
    
    return axios.post(`${API_BASE_URL}/api/v1/admin-management/members/${id}/suspend/`, {}, {
      headers: getAuthHeaders(),
    });
  },

  reactivateMember: async (id: string) => {
  
    return axios.post(`${API_BASE_URL}/api/v1/admin-management/members/${id}/reactivate/`, {}, {
      headers: getAuthHeaders(),
    });
  }
};