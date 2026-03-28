/**
 * AdminPaymentService - API client for admin payment management operations
 * 
 * This service handles admin-specific payment operations including:
 * - Fetching all manual payments with admin details
 * - Verifying payments
 * - Rejecting payments
 * - Getting revenue statistics
 */

import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';
import { Payment } from '../components/payment-components/types';

export interface AdminPaymentResponse {
  id: number;
  member_name: string;
  member_email: string;
  invoice_number?: string;
  application_id?: string;
  reference: string;
  description: string;
  payment_type?: string; // Added: donation, event, membership_renewal, etc.
  amount: number;
  currency: string;
  proof_of_payment?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  verification_notes?: string;
  verified_by_name?: string;
  requires_document_review?: boolean;
  linked_document_id?: number | null;
  linked_document_status?: string | null;
}

export interface RevenueResponse {
  total_revenue: number;
}

export interface PaymentStatisticsResponse {
  total_transactions: number;
  pending_revenue: number;
  total_revenue: number;
  verified_payments: number;
  pending_payments: number;
  growth_rates: {
    transactions: number;
    pending: number;
    revenue: number;
  };
  last_month_stats: {
    new_transactions: number;
    new_revenue: number;
    verified_payments: number;
  };
}

class AdminPaymentService {
  private getAuthHeaders(): Record<string, string> {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Fetch all manual payments for admin dashboard
   */
  async fetchPayments(): Promise<AdminPaymentResponse[]> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    
    return response.json();
  }

  /**
   * Verify a manual payment
   */
  async verifyPayment(paymentId: number, notes?: string, linkedDocumentId?: number | null): Promise<void> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}/verify/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ notes: notes || '' }),
    });
    
    if (response.ok) {
      return;
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage = String(errorData.error || errorData.message || errorData.detail || 'Failed to verify payment');
    const normalizedMessage = errorMessage.toLowerCase();
    const shouldRouteToDocumentReview =
      errorData.requires_document_review === true ||
      normalizedMessage.includes('document review') ||
      normalizedMessage.includes('linked receipt document');

    const resolvedDocumentId =
      linkedDocumentId ??
      (typeof errorData.linked_document_id === 'number' ? errorData.linked_document_id : null);

    if (shouldRouteToDocumentReview && resolvedDocumentId) {
      const documentResponse = await fetch(`${API_BASE_URL}/api/v1/documents/${resolvedDocumentId}/admin-review/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'approved', admin_feedback: notes || '' }),
      });

      if (!documentResponse.ok) {
        const documentErrorData = await documentResponse.json().catch(() => ({}));
        throw new Error(documentErrorData.error || documentErrorData.message || 'Failed to approve linked document');
      }

      return;
    }

    throw new Error(errorMessage);
  }

  /**
   * Reject a manual payment
   */
  async rejectPayment(paymentId: number, notes?: string): Promise<void> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}/reject/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ notes: notes || '' }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to reject payment');
    }
  }

  /**
   * Get total revenue from verified payments
   */
  async getRevenue(): Promise<RevenueResponse> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/revenue/`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch revenue');
    }
    
    return response.json();
  }

  /**
   * Get comprehensive payment statistics with growth rates
   */
  async getPaymentStatistics(): Promise<PaymentStatisticsResponse> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/statistics/`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment statistics');
    }
    
    return response.json();
  }

  /**
   * Get pending payments count
   */
  async getPendingCount(): Promise<{ pending: number }> {
    const headers = this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/pending-count/`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending count');
    }
    
    return response.json();
  }
}

export const adminPaymentService = new AdminPaymentService();
export default adminPaymentService;
