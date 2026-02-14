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
    const response = await axios.get(`${API_BASE_URL}/api/v1/members/`, {
      headers: getAuthHeaders(),
      timeout: 30000,
    });

   
    return response.data.map((member: any) => ({
      id: member.id.toString(),
      name: `${member.first_name} ${member.last_name}`,
      email: member.email,
      status: member.status, 
      renewalDate: member.renewal_date,
    }));
  },

  
  suspendMember: async (id: string) => {
    return axios.post(`${API_BASE_URL}/api/v1/members/${id}/suspend/`, {}, {
      headers: getAuthHeaders(),
    });
  },

  reactivateMember: async (id: string) => {
    return axios.post(`${API_BASE_URL}/api/v1/members/${id}/reactivate/`, {}, {
      headers: getAuthHeaders(),
    });
  }
};