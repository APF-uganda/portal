import { useState, useEffect } from 'react';
import { Payment, DashboardStats } from '../components/payment-components/types'; 
import { adminPaymentService, AdminPaymentResponse } from '../services/adminPaymentService';

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
      
      // Fetch payments using the new admin service
      const paymentsData = await adminPaymentService.fetchPayments();
      
      // Fetch revenue and pending count
      const [revenueData] = await Promise.all([
        adminPaymentService.getRevenue().catch(() => ({ total_revenue: 0 })),
        adminPaymentService.getPendingCount().catch(() => ({ pending: 0 }))
      ]);

      // Calculate statistics
      const pendingPayments = paymentsData.filter((p: AdminPaymentResponse) => p.status === 'pending');
      
      const totalRevenue = revenueData.total_revenue;
      const pendingRevenue = pendingPayments.reduce((sum: number, p: AdminPaymentResponse) => sum + Number(p.amount || 0), 0);

      setStats({
        total_transactions: paymentsData.length || 0,
        pending_revenue: pendingRevenue,
        total_revenue: totalRevenue,
        growth_rates: {
          transactions: 0,
          pending: 0,
          revenue: 0,
        },
      });

      // Map backend payments to Payment shape
      const mappedPayments: Payment[] = (paymentsData || []).slice(0, 10).map((p: AdminPaymentResponse) => ({
        id: p.id,
        member_name: p.member_name,
        member_email: '',
        description: p.description,
        amount: p.amount || 0,
        currency: 'UGX',
        status: p.status || 'unknown',
        created_at: p.created_at || null,
        invoice_number: p.invoice_number,
        application_id: p.application_id,
        reference: p.reference,
        proof_of_payment: p.proof_of_payment,
        user: p.member_name,
      }));
      setPayments(mappedPayments);

      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId: number, notes?: string) => {
    try {
      await adminPaymentService.verifyPayment(paymentId, notes);
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
