import { useState, useEffect } from 'react';
import { Payment, DashboardStats } from '../components/payment-components/types'; 
import { adminPaymentService, AdminPaymentResponse } from '../services/adminPaymentService';

const derivePaymentDescription = (payment: AdminPaymentResponse): string => {
  const applicationId = payment.application_id || '';
  const invoiceNumber = payment.invoice_number || '';
  const reference = payment.reference || '';
  const rawDescription = (payment.description || '').toLowerCase();

  if (applicationId.startsWith('APF-') || rawDescription.includes('application')) {
    return 'Application';
  }
  if (invoiceNumber.startsWith('INV-') || rawDescription.includes('renew')) {
    return 'Renewal';
  }
  if (reference.startsWith('EVT-') || rawDescription.includes('event')) {
    return 'Event';
  }
  return payment.description || 'Other';
};

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  
  const [stats, setStats] = useState<DashboardStats>({
    total_transactions: 0,
    pending_revenue: 0,
    total_revenue: 0,
    growth_rates: {
      transactions: 0,
      pending: 0,
      revenue: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // Fetch payments and statistics using the new admin service
      const [paymentsData, statisticsData] = await Promise.all([
        adminPaymentService.fetchPayments(),
        adminPaymentService.getPaymentStatistics().catch(() => ({
          total_transactions: 0,
          pending_revenue: 0,
          total_revenue: 0,
          verified_payments: 0,
          pending_payments: 0,
          growth_rates: { transactions: 0, pending: 0, revenue: 0 },
          last_month_stats: { new_transactions: 0, new_revenue: 0, verified_payments: 0 }
        }))
      ]);

      // Set statistics from backend response
      setStats({
        total_transactions: statisticsData.total_transactions,
        pending_revenue: statisticsData.pending_revenue,
        total_revenue: statisticsData.total_revenue,
        growth_rates: {
          transactions: statisticsData.growth_rates.transactions,
          pending: statisticsData.growth_rates.pending,
          revenue: statisticsData.growth_rates.revenue,
        },
      });

      // Map backend payments to Payment shape
      const mappedPayments: Payment[] = (paymentsData || []).map((p: AdminPaymentResponse) => ({
        id: p.id,
        member_name: p.member_name,
        member_email: p.member_email || '',
        description: derivePaymentDescription(p),
        amount: p.amount || 0,
        currency: p.currency || 'UGX',
        status: p.status || 'unknown',
        created_at: p.created_at || null,
        invoice_number: p.invoice_number,
        application_id: p.application_id,
        reference: p.reference,
        proof_of_payment: p.proof_of_payment,
        user: p.member_name,
        requires_document_review: p.requires_document_review,
        linked_document_id: p.linked_document_id ?? null,
        linked_document_status: p.linked_document_status ?? null,
      }));
      setPayments(mappedPayments);

      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId: number, notes?: string, linkedDocumentId?: number | null) => {
    try {
      await adminPaymentService.verifyPayment(paymentId, notes, linkedDocumentId);
      await fetchPayments(); // Refresh data
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const rejectPayment = async (paymentId: number, notes?: string) => {
    try {
      await adminPaymentService.rejectPayment(paymentId, notes);
      await fetchPayments(); // Refresh data
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
    
    // Auto-refresh every 2 hours to keep payment stats current
    const intervalId = setInterval(() => {
      fetchPayments();
    }, 2 * 60 * 60 * 1000); // 2 hours = 2 * 60 * 60 * 1000 milliseconds

    return () => clearInterval(intervalId);
  }, []);

  return { 
    payments, 
    stats, 
    loading, 
    error, 
    refresh: fetchPayments,
    verifyPayment,
    rejectPayment
  };
};
