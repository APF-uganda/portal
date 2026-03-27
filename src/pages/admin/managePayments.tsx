import { useState, useEffect } from 'react';
import { FileDown, RefreshCw, X, FileText, Loader2, Download } from 'lucide-react';
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { usePayments } from '../../hooks/usepayment';
import { PaymentStats } from '../../components/adminpayments-components/paymentstats';
import { PaymentTable } from '../../components/adminpayments-components/paymentTable';
import { Payment } from '../../components/payment-components/types';
import { getAccessToken } from '../../utils/authStorage';
import { API_BASE_URL } from '../../config/api';

// Document Preview Component (same as ApplicationDetailModal)
const DocumentPreview: React.FC<{ documentUrl: string; fileName?: string }> = ({ documentUrl, fileName = 'Proof of Payment' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    loadDocument();
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [documentUrl]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    
    if (!documentUrl) {
      setError("Path missing");
      setLoading(false);
      return;
    }

    try {
      const token = getAccessToken();
      let finalUrl = documentUrl;
      
      if (!documentUrl.startsWith('http')) {
        const cleanBase = API_BASE_URL.replace(/\/+$/, '');
        const cleanPath = documentUrl.startsWith('/') ? documentUrl : `/${documentUrl}`;
        finalUrl = `${cleanBase}${cleanPath}`;
      }

      const response = await fetch(finalUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      setPreviewUrl(objectUrl);
      setFileType(blob.type || 'application/octet-stream');
    } catch (err) {
      setError("Load failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-[#5C32A3]" size={18} />
          <div>
            <p className="text-sm font-semibold text-gray-700">Proof of Payment</p>
            <p className="text-xs text-gray-400">{fileName}</p>
          </div>
        </div>
        {previewUrl && (
          <a href={previewUrl} download={fileName} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Download size={16} className="text-gray-600" />
          </a>
        )}
      </div>
      
      <div className="p-4 bg-white min-h-[100px] flex items-center justify-center">
        {loading ? <Loader2 className="animate-spin text-gray-300" /> : 
         error ? <p className="text-xs text-red-500">{error}</p> :
         fileType?.startsWith('image/') ? <img src={previewUrl!} alt="preview" className="max-h-80 rounded" /> :
         fileType === 'application/pdf' ? <iframe src={previewUrl!} title="pdf-preview" className="w-full h-80 border-none" /> :
         <p className="text-xs text-gray-500">Preview unavailable. Please download to view.</p>}
      </div>
    </div>
  );
};

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
      const currentPayment = payments.find((p) => Number(p.id) === Number(id));
      if (newStatus === 'verified') {
        await verifyPayment(id, undefined, currentPayment?.linked_document_id ?? null);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Payment Information */}
              <section>
                <h4 className="text-[10px] font-semibold text-[#5C32A3] uppercase tracking-widest mb-4">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl">
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 block mb-0.5">Member</span>
                    <span className="text-sm text-gray-700">{selectedPayment.member_name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 block mb-0.5">Email</span>
                    <span className="text-sm text-gray-700">{selectedPayment.member_email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 block mb-0.5">Description</span>
                    <span className="text-sm text-gray-700">{selectedPayment.description}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 block mb-0.5">Amount</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedPayment.currency || 'UGX'} {Number(selectedPayment.amount).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 block mb-0.5">Reference</span>
                    <span className="text-sm text-gray-700 font-mono">{selectedPayment.application_id || selectedPayment.invoice_number || selectedPayment.reference || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 block mb-0.5">Date</span>
                    <span className="text-sm text-gray-700">{selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleString() : '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-gray-400 block mb-0.5">Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      selectedPayment.status === 'verified' || selectedPayment.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : selectedPayment.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {selectedPayment.status === 'verified' ? 'Approved' : selectedPayment.status}
                    </span>
                  </div>
                </div>
              </section>

              {/* Proof of Payment Document */}
              {selectedPayment.proof_of_payment && (
                <section>
                  <h4 className="text-[10px] font-semibold text-[#5C32A3] uppercase tracking-widest mb-4">Proof of Payment</h4>
                  <DocumentPreview 
                    documentUrl={selectedPayment.proof_of_payment}
                    fileName={`Payment_${selectedPayment.application_id || selectedPayment.invoice_number || selectedPayment.id}`}
                  />
                </section>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-between">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-5 py-2 text-sm font-medium text-gray-600"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <div className="flex gap-2">
                {selectedPayment.status?.toLowerCase() === 'pending' && (
                  <>
                    <button
                      disabled={actionLoading}
                      onClick={async () => {
                        await handleStatusUpdate(Number(selectedPayment.id), 'rejected');
                        setSelectedPayment(null);
                      }}
                      className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={async () => {
                        await handleStatusUpdate(Number(selectedPayment.id), 'verified');
                        setSelectedPayment(null);
                      }}
                      className="px-6 py-2 bg-[#5C32A3] text-white rounded-lg text-sm font-medium hover:bg-[#4A2783] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Processing...' : 'Approve Payment'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;
