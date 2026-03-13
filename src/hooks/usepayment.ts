import { useState, useEffect } from 'react';
import { Payment, DashboardStats } from '../components/payment-components/types'; 
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../utils/authStorage';

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

  const getAuthHeaders = (): Record<string, string> => {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      // Fetch all payments from the payments API
      const paymentsRes = await fetch(`${API_BASE_URL}/api/payments/`, { headers });

      if (!paymentsRes.ok) throw new Error('Failed to fetch payments');

      const paymentsData = await paymentsRes.json();

      // Calculate statistics from payments data
      const completedPayments = paymentsData.filter((p: any) => p.status === 'completed');
      const pendingPayments = paymentsData.filter((p: any) => p.status === 'pending' || p.status === 'processing');
      
      const totalRevenue = completedPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
      const pendingRevenue = pendingPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

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
      const mappedPayments: Payment[] = (paymentsData || []).slice(0, 10).map((p: any) => ({
        id: p.id,
        member_name: p.user?.full_name || p.user?.email || 'Unknown',
        member_email: p.user?.email || '',
        description: p.invoice_number 
          ? `Invoice ${p.invoice_number} (${p.payment_method || 'Mobile Money'})` 
          : `Payment via ${p.payment_method || 'Mobile Money'}`,
        amount: p.amount || 0,
        currency: p.currency || 'UGX',
        status: p.status || 'unknown',
        created_at: p.created_at || null,
      }));
      setPayments(mappedPayments);

      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return { payments, stats, loading, error, refresh: fetchPayments };
};
