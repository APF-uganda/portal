import { useState } from 'react';
import { FileDown, RefreshCw, X, ExternalLink } from 'lucide-react';
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { usePayments } from '../../hooks/usepayment';
import { PaymentStats } from '../../components/adminpayments-components/paymentstats';
import { PaymentTable } from '../../components/adminpayments-components/paymentTable';
import { Payment } from '../../components/payment-components/types';

const ManagePayments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { payments, stats, loading, error, refresh, verifyPayment, rejectPayment } = usePayments();

  // Updated signature to use number and union type
  const handleStatusUpdate = async (id: number, newStatus: 'verified' | 'rejected') => {
    setActionLoading(true);
    try {
      if (newStatus === 'verified') {
        await verifyPayment(id);
      } else if (newStatus === 'rejected') {
        await rejectPayment(id);
      }
    } catch (err: any) {
      console.error('Payment action failed:', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadReport = () => {
    if (payments.length === 0) return;
    const headers = ["Member Name", "Email", "Description", "Currency", "Amount", "Status"];
    const csvContent = [
      headers.join(","),
      ...payments.map(p => [
        `"${p.member_name}"`,
        `"${p.member_email}"`,
        `"${p.description}"`,
        p.currency,
        p.amount,
        p.status
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Payments_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />
      
      <main className={`w-full transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col`}>
        <Header 
          title="Payments Management" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />
        
        <div className="flex-1 bg-[#F4F2FE] overflow-y-auto w-full">
          <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8 w-full">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-[28px] font-black text-slate-800 tracking-tight">Payments Dashboard</h1>
                <p className="text-slate-500 font-medium">Monitor member financial transactions.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={refresh}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button 
                  onClick={downloadReport}
                  className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-[#5E2590] text-white rounded-xl text-sm font-bold hover:bg-[#4a1d72] transition-all shadow-md active:scale-95"
                >
                  <FileDown className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  <span className="hidden sm:inline">Download Report</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 md:p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs md:text-sm">Connection Error: {error}</span>
              </div>
            )}

            <PaymentStats stats={stats} />

            <div className="w-full">
              <PaymentTable
                payments={payments}
                loading={loading}
                onStatusUpdate={handleStatusUpdate}
                onView={setSelectedPayment}
              />
            </div>

            <div className="bg-white p-4 md:p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">Financial Summary</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {stats && stats.growth_rates.revenue !== 0 ? (
                    <>
                      Your revenue is tracking{' '}
                      <span className={`font-bold ${stats.growth_rates.revenue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {stats.growth_rates.revenue >= 0 ? '+' : ''}{stats.growth_rates.revenue.toFixed(1)}%
                      </span>{' '}
                      {stats.growth_rates.revenue >= 0 ? 'higher' : 'lower'} than last month.
                    </>
                  ) : (
                    'No revenue change data available yet.'
                  )}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last synced: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

      {/* View Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-black text-slate-800 text-lg">Payment Details</h2>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <Row label="Member" value={selectedPayment.member_name} />
              <Row label="Email" value={selectedPayment.member_email || '—'} />
              <Row label="Description" value={selectedPayment.description} />
              <Row label="Amount" value={`${selectedPayment.currency || 'UGX'} ${Number(selectedPayment.amount).toLocaleString()}`} />
              <Row label="Reference" value={selectedPayment.application_id || selectedPayment.invoice_number || selectedPayment.reference || '—'} />
              <Row label="Date" value={selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleString() : '—'} />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                  selectedPayment.status === 'verified' || selectedPayment.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : selectedPayment.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {selectedPayment.status === 'verified' ? 'Approved' : selectedPayment.status}
                </span>
              </div>
              {selectedPayment.proof_of_payment && (
                <a
                  href={selectedPayment.proof_of_payment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-[#5E2590] hover:underline"
                >
                  <ExternalLink size={14} /> View Proof of Payment
                </a>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              {selectedPayment.status?.toLowerCase() === 'pending' && (
                <>
                  <button
  disabled={actionLoading}
  onClick={async () => {
    // Force the ID to be a number to satisfy the function's type
    await handleStatusUpdate(Number(selectedPayment.id), 'verified');
    setSelectedPayment(null);
  }}
  className="..."
>
  {actionLoading ? 'Processing...' : 'Approve'}
</button>

<button
  disabled={actionLoading}
  onClick={async () => {
    // Force the ID to be a number here too
    await handleStatusUpdate(Number(selectedPayment.id), 'rejected');
    setSelectedPayment(null);
  }}
  className="..."
>
  {actionLoading ? 'Processing...' : 'Reject'}
</button>
                </>
              )}
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-semibold text-slate-800 text-right max-w-[60%] truncate">{value}</span>
  </div>
);

export default ManagePayments;