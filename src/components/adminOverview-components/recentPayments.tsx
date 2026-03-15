import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRecentPayments, RecentPayment } from "../../services/dashboard";

function RecentPayments() {
  const [payments, setPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPayments()
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  const formatAmount = (amount: number) => {
    return `UGX ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      'mobile_money': 'Mobile Money',
      'credit_card': 'Credit Card',
      'bank_transfer': 'Bank Transfer',
      'mtn': 'MTN Mobile Money',
      'airtel': 'Airtel Money',
    };
    return methodMap[method] || method.toUpperCase();
  };

  const formatDate = (date: string) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    
    // If less than 24 hours, show "hours ago"
    if (hours < 24) {
      if (hours < 1) return "Just now";
      return `${hours} hours ago`;
    }
    
    // If 24 hours or more, show date in dd/mm/yyyy format
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold">Recent Payments</h2>
        <Link to="/admin/payments" className="text-xs md:text-sm text-purple-600 hover:underline">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border p-3 animate-pulse">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3 gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{payment.member_name}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="hidden sm:inline">{formatPaymentMethod(payment.payment_method)} • </span>
                  {formatDate(payment.created_at)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-sm">{formatAmount(payment.amount)}</p>
                <span className="rounded-full border border-green-600 px-2 py-0.5 text-xs text-green-600">
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No recent payments found</p>
        </div>
      )}
    </div>
  );
}

export default RecentPayments;