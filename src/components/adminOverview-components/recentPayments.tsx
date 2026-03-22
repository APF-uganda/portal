import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRecentPayments, RecentPayment } from "../../services/dashboard";

function RecentPayments() {
  const [payments, setPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await fetchRecentPayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to load recent payments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      loadPayments(true);
    }, 30 * 1000); // 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const formatPaymentMethod = (method?: string) => {
    if (!method) return "Manual Payment";
    const methodMap: Record<string, string> = {
      manual_payment: "Manual Payment",
      mobile_money: "Mobile Money",
      credit_card: "Credit Card",
      bank_transfer: "Bank Transfer",
      mtn: "MTN Mobile Money",
      airtel: "Airtel Money",
    };
    return methodMap[method] || method.replace(/_/g, " ").toUpperCase();
  };

  const formatDate = (date: string) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    if (hours < 24) {
      if (hours < 1) return "Just now";
      return `${hours} hours ago`;
    }

    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm md:text-base font-semibold">Recent Payments</h2>
          {refreshing && (
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        <Link to="/admin/payments" className="text-xs md:text-sm text-purple-600 hover:underline">
          View All -&gt;
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
                <p className="font-medium text-sm truncate">
                  {payment.member_name || payment.member_email || payment.reference || "Payment Record"}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="hidden sm:inline">
                    {(payment.description || formatPaymentMethod(payment.payment_method))} {"\u2022"} 
                  </span>
                  {formatDate(payment.created_at)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-sm">
                  {(payment.currency || "UGX")} {Number(payment.amount || 0).toLocaleString("en-US")}
                </p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    payment.status?.toLowerCase() === "verified" || payment.status?.toLowerCase() === "completed"
                      ? "border-green-600 text-green-600"
                      : payment.status?.toLowerCase() === "rejected" || payment.status?.toLowerCase() === "failed"
                        ? "border-red-600 text-red-600"
                        : "border-amber-600 text-amber-600"
                  }`}
                >
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
