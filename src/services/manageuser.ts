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
      renewalStatus: member.renewal_status || 'unknown',
      hasDocuments: member.has_documents || false,
      documentCount: member.document_count || 0,
      lastDocumentUpload: member.last_document_upload || null,
      emailVerified: member.email_verified || false,
      mustChangePassword: member.must_change_password || false,
      apfMembershipNumber: member.apf_membership_number || null,
    }));
  },

  suspendMember: async (id: string, reason: string = "Administrative suspension", suspensionType: string = "non_payment") => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/suspend/`, 
      { reason, suspension_type: suspensionType }, 
      { headers: getHeaders() }
    );
  },

  reactivateMember: async (id: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/reactivate/`, 
      {}, 
      { headers: getHeaders() }
    );
  },

  assignApfNumber: async (id: string, apfNumber: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/apf-number/`,
      { apf_membership_number: apfNumber },
      { headers: getHeaders() }
    );
  },

  deleteMember: async (id: string) => {
    return axios.delete(
      `${API_BASE_URL}/api/v1/admin-management/members/${id}/delete/`,
      { headers: getHeaders() }
    );
  },

  deletePayment: async (paymentId: number) => {
    return axios.delete(
      `${API_BASE_URL}/api/v1/admin-management/payments/${paymentId}/delete/`,
      { headers: getHeaders() }
    );
  },

  fetchMemberDocuments: async (userId: string) => {
    console.log(`[API] Fetching documents for user ${userId}`);
    console.log(`[API] URL: ${API_BASE_URL}/api/v1/documents/member-documents/${userId}/`);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/documents/member-documents/${userId}/`,
        { headers: getHeaders() }
      );
      console.log('[API] Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[API] Error fetching documents:', error);
      console.error('[API] Error response:', error.response?.data);
      throw error;
    }
  },

  updateDocumentStatus: async (documentId: string, status: string, feedback?: string) => {
    return axios.patch(
      `${API_BASE_URL}/api/v1/documents/${documentId}/admin-review/`,
      { status, admin_feedback: feedback },
      { headers: getHeaders() }
    );
  },

  // Send notification to admin when document is uploaded
  notifyAdminDocumentUpload: async (userId: string, documentType: string, userName: string) => {
    try {
      return axios.post(
        `${API_BASE_URL}/api/v1/notifications/admin-notifications/`,
        {
          title: 'New Document Uploaded',
          message: `${userName} has uploaded a new ${documentType} document for review.`,
          notification_type: 'system',
          priority: 'medium',
          metadata: {
            userId,
            documentType,
            actionUrl: `/admin/manage-users?user=${userId}`
          }
        },
        { headers: getHeaders() }
      );
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      // Don't throw error to avoid breaking document upload flow
    }
  }
};
