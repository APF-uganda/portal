import { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  FileText, 
  Settings, 
  ChevronRight, 
  Hash, 
  Clock, 
  Loader2,
  Banknote,
  Check,
  X,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

// Layout Components
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { usePayments } from '../../hooks/usepayment';
import { PaymentStatCard } from '../../components/payment-components/statcard';

const ManagePayments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { payments, stats, loading, error, verifyPayment, rejectPayment, refresh } = usePayments();
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (!loading) {
      setLastUpdated(new Date());
    }
  }, [stats, loading]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatLastUpdated = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'failed': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const handleVerifyPayment = async (paymentId: number) => {
    setActionLoading(prev => ({ ...prev, [`verify-${paymentId}`]: true }));
    try {
      await verifyPayment(paymentId);
    } catch (error) {
      console.error('Failed to verify payment:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`verify-${paymentId}`]: false }));
    }
  };

  const handleRejectPayment = async (paymentId: number) => {
    setActionLoading(prev => ({ ...prev, [`reject-${paymentId}`]: true }));
    try {
      await rejectPayment(paymentId);
    } catch (error) {
      console.error('Failed to reject payment:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject-${paymentId}`]: false }));
    }
  };

  const openProofOfPayment = (proofUrl: string) => {
    window.open(proofUrl, '_blank');
  };

  return (
    <div className="flex min-h-screen overflow-hidden font-sans">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-[#F8FAFC] transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen min-w-0 overflow-hidden`}>
        
        <Header 
          title="Payments Management" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 p-6 md:p-10 lg:p-12 space-y-10 overflow-y-auto">
          <div className="max-w-full lg:max-w-[1400px] mx-auto space-y-10">
            
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Payments Dashboard</h1>
                <p className="text-gray-400 mt-2 text-sm font-medium">Monitor transactions, revenue trends, and payment statuses.</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Updated: {formatLastUpdated()}
                </span>
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-[#7E49B3] ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-medium">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PaymentStatCard 
                title="Total Transactions" 
                value={(stats?.total_transactions ?? 0).toLocaleString()} 
                change={25.8}
                icon={Hash}
                iconBg="bg-[#7E49B3]"
                color="border-purple-100" 
              />
              
              <PaymentStatCard 
                title="Pending Amount" 
                value={`UGX ${(stats?.pending_revenue ?? 0).toLocaleString()}`} 
                change={-12.4}
                icon={Clock}
                iconBg="bg-amber-500"
                color="border-amber-100" 
              />

              <PaymentStatCard 
                title="Total Revenue" 
                value={`UGX ${(stats?.total_revenue ?? 0).toLocaleString()}`} 
                change={35.6}
                icon={Banknote}
                iconBg="bg-emerald-500"
                color="border-emerald-100" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-3">
                    <RotateCcw size={18} className="text-[#7E49B3]" /> Recent Transactions
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-5 border-b border-gray-50">Member</th>
                        <th className="px-6 py-5 border-b border-gray-50">Transaction ID</th>
                        <th className="px-6 py-5 border-b border-gray-50 text-right">Amount</th>
                        <th className="px-6 py-5 border-b border-gray-50 text-center">Status</th>
                        <th className="px-6 py-5 border-b border-gray-50 text-center">Date</th>
                        <th className="px-6 py-5 border-b border-gray-50 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-20">
                            <Loader2 className="animate-spin text-[#7E49B3] mx-auto" size={32} />
                          </td>
                        </tr>
                      ) : (
                        payments.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="font-bold text-gray-900">{p.member_name}</div>
                              <div className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{p.member_email}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="font-mono text-xs text-[#7E49B3] font-bold">
                                {p.application_id || p.invoice_number || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-5 font-bold text-gray-900 text-right">
                              <div className="text-sm">
                                {p.currency || 'UGX'} {Number(p.amount || 0).toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(p.status)}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center text-xs font-medium text-gray-400">
                              {p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-3">
                                {p.proof_of_payment && (
                                  <button onClick={() => openProofOfPayment(p.proof_of_payment!)} className="text-gray-400 hover:text-[#7E49B3] transition-colors p-2 bg-gray-50 rounded-xl" title="View Proof">
                                    <ExternalLink size={14} />
                                  </button>
                                )}
                                {p.status === 'pending' && (
                                  <>
                                    <button onClick={() => handleVerifyPayment(Number(p.id))} disabled={actionLoading[`verify-${p.id}`]} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50">
                                      {actionLoading[`verify-${p.id}`] ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                    </button>
                                    <button onClick={() => handleRejectPayment(Number(p.id))} disabled={actionLoading[`reject-${p.id}`]} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-all shadow-lg shadow-red-100 disabled:opacity-50">
                                      {actionLoading[`reject-${p.id}`] ? <RefreshCw size={14} className="animate-spin" /> : <X size={14} />}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
                  <h2 className="font-bold text-gray-900 mb-8 flex items-center gap-3 text-lg">
                    <Settings size={18} className="text-[#7E49B3]" /> Quick Actions
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Process Refund', icon: RotateCcw, color: 'text-[#7E49B3]', bg: 'bg-purple-50' },
                      { label: 'Generate Report', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: 'Payment Settings', icon: Settings, color: 'text-blue-500', bg: 'bg-blue-50' }
                    ].map((action, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                        <div className="flex items-center gap-4">
                          <div className={`${action.bg} ${action.color} p-2 rounded-xl transition-transform group-hover:scale-110`}>
                            <action.icon size={18} />
                          </div>
                          <span className="font-bold text-gray-700 text-sm">{action.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ManagePayments;