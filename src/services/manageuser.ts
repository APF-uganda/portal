import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { User } from '../components/manageusers-components/users';
import { getAccessToken } from '../utils/authStorage';

const getHeaders = () => ({
  'Authorization': `Bearer ${getAccessToken()}`,
  'Content-Type': 'application/json'
});

export const userManagementApi = {
  fetchMembers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/admin-management/members/`, {
      headers: getHeaders()
    });

   
    const rawData = response.data.results || [];

    return rawData.map((member: any) => ({
      id: member.id.toString(),
     
      name: member.full_name || member.email || "Unknown Member",
      email: member.email,
     
      status: member.membership_status === 'SUSPENDED' ? 'Suspended' : 'Active',
   
      renewalDate: member.subscription_due_date || 'N/A',
    }));
  },

  suspendMember: async (id: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/suspend/`, 
      { reason: "Administrative suspension" }, 
      { headers: getHeaders() }
    );
  },

  reactivateMember: async (id: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/reactivate/`, 
      {}, 
      { headers: getHeaders() }
    );
  }
};
