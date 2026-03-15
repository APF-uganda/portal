import { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  FileText, 
  Settings, 
  ChevronRight, 
  Hash, 
  Clock, 
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

  // Update last updated time when stats change
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

  // Format last updated time
  const formatLastUpdated = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen min-w-0 overflow-hidden`}>
        
        <Header 
          title="Payments Management" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 bg-[#F4F2FE] p-3 md:p-6 lg:p-8 space-y-6 md:space-y-10 overflow-y-auto">
          <div className="max-w-full lg:max-w-[1400px] mx-auto space-y-6 md:space-y-10">
            
            {/* Title Section with Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-slate-800 tracking-tight">Payments Dashboard</h1>
                <p className="text-slate-500 mt-1 text-sm md:text-base">Monitor transactions, revenue trends, and payment statuses.</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs md:text-sm text-gray-500">
                  Updated: {formatLastUpdated()}
                </span>
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh payment data"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-xs md:text-sm font-medium">
                    <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    <span className="sm:hidden">{refreshing ? '...' : 'Refresh'}</span>
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 md:px-4 py-2 md:py-3 rounded-xl text-sm mx-3 md:mx-0">
                <strong>Error:</strong> {error}
              </div>
            )}

           
            {/* Debug Stats Display */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-100 p-4 rounded-lg mb-4">
                <h4 className="font-bold">Debug - Stats Object:</h4>
                <pre className="text-xs">{JSON.stringify(stats, null, 2)}</pre>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              
              <PaymentStatCard 
                title="Total Transactions" 
                value={(stats?.total_transactions ?? 0).toLocaleString()} 
                change={25.8}
                icon={Hash}
                iconBg="bg-blue-600"
                color="border-blue-500" 
              />
              
              <PaymentStatCard 
                title="Pending Amount" 
                value={`UGX ${(stats?.pending_revenue ?? 0).toLocaleString()}`} 
                change={-12.4}
                icon={Clock}
                iconBg="bg-amber-500"
                color="border-yellow-500" 
              />

              <PaymentStatCard 
                title="Total Revenue" 
                value={`UGX ${(stats?.total_revenue ?? 0).toLocaleString()}`} 
                change={35.6}
                icon={Banknote}
                iconBg="bg-emerald-600"
                color="border-green-500" 
              />
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
              
              <div className="lg:col-span-2 bg-white rounded-xl md:rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-3 md:px-6 py-3 md:py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h2 className="font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
                    <RotateCcw size={16} className="md:w-[18px] md:h-[18px] text-slate-400" /> Recent Transactions
                  </h2>
                  {/* <button className="text-xs font-bold text-[#5E2590] hover:underline">View All</button> */}
                </div>

                <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
                  <div className="min-w-[1000px]">
                    <table className="w-full leading-normal text-left">
                      <thead>
                        <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 min-w-[150px]">Member</th>
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 min-w-[140px]">Transaction ID</th>
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 min-w-[120px]">Description</th>
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 min-w-[120px]">Reference</th>
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 text-right min-w-[100px]">Amount</th>
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 text-center min-w-[80px]">Status</th>
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 text-center min-w-[80px]">Date</th>
                          <th className="px-2 md:px-4 py-3 md:py-4 border-b border-gray-100 text-center min-w-[120px]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {loading ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12">
                              <div className="w-6 h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </td>
                          </tr>
                        ) : (
                          payments.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors text-sm">
                              <td className="px-2 md:px-4 py-3 md:py-4">
                                <div className="font-bold text-gray-800 truncate">{p.member_name}</div>
                                <div className="text-[10px] md:text-[11px] text-gray-400 truncate">{p.member_email}</div>
                              </td>
                              <td className="px-2 md:px-4 py-3 md:py-4">
                                <div className="font-mono text-xs text-blue-600 font-semibold truncate">
                                  {p.application_id || p.invoice_number || '-'}
                                </div>
                                <div className="text-[9px] md:text-[10px] text-gray-400 mt-1">
                                  {p.application_id ? 'Application' : p.invoice_number ? 'Invoice' : 'N/A'}
                                </div>
                              </td>
                              <td className="px-2 md:px-4 py-3 md:py-4">
                                <div className="text-xs md:text-sm text-gray-700 truncate">{p.description}</div>
                              </td>
                              <td className="px-2 md:px-4 py-3 md:py-4">
                                <div className="font-mono text-xs text-gray-600 truncate">{p.reference}</div>
                              </td>
                              <td className="px-2 md:px-4 py-3 md:py-4 font-black text-gray-800 text-right">
                                <div className="text-xs md:text-sm">
                                  {p.currency || 'UGX'} {Number(p.amount || 0).toLocaleString()}
                                </div>
                              </td>
                              <td className="px-2 md:px-4 py-3 md:py-4 text-center">
                                <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(p.status)}`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-2 md:px-4 py-3 md:py-4 text-center text-xs text-gray-500">
                                {p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-2 md:px-4 py-3 md:py-4 text-center">
                                <div className="flex items-center justify-center gap-1 md:gap-2">
                                  {p.proof_of_payment && (
                                    <button
                                      onClick={() => openProofOfPayment(p.proof_of_payment!)}
                                      className="text-blue-600 hover:text-blue-800 p-1"
                                      title="View Proof"
                                    >
                                      <ExternalLink size={12} className="md:w-[14px] md:h-[14px]" />
                                    </button>
                                  )}
                                  {p.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleVerifyPayment(Number(p.id))}
                                        disabled={actionLoading[`verify-${p.id}`]}
                                        className="bg-green-600 hover:bg-green-700 text-white px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-medium disabled:opacity-50 flex items-center gap-1"
                                      >
                                        {actionLoading[`verify-${p.id}`] ? (
                                          <div className="w-2 md:w-3 h-2 md:h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Check size={10} className="md:w-3 md:h-3" />
                                        )}
                                        <span className="hidden sm:inline">Verify</span>
                                        <span className="sm:hidden">✓</span>
                                      </button>
                                      <button
                                        onClick={() => handleRejectPayment(Number(p.id))}
                                        disabled={actionLoading[`reject-${p.id}`]}
                                        className="bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-medium disabled:opacity-50 flex items-center gap-1"
                                      >
                                        {actionLoading[`reject-${p.id}`] ? (
                                          <div className="w-2 md:w-3 h-2 md:h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <X size={10} className="md:w-3 md:h-3" />
                                        )}
                                        <span className="hidden sm:inline">Reject</span>
                                        <span className="sm:hidden">✗</span>
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
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-[20px] shadow-sm border border-gray-100">
                  <h2 className="font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2 text-base md:text-lg">
                    <Settings size={16} className="md:w-[18px] md:h-[18px] text-slate-400" /> Quick Actions
                  </h2>
                  <div className="space-y-2 md:space-y-3">
                    {[
                      { label: 'Process Refund', icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-50' },
                      { label: 'Generate Report', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Payment Settings', icon: Settings, color: 'text-blue-600', bg: 'bg-blue-50' }
                    ].map((action, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`${action.bg} ${action.color} p-1.5 md:p-2 rounded-lg`}>
                            <action.icon size={16} className="md:w-[18px] md:h-[18px]" />
                          </div>
                          <span className="font-bold text-gray-700 text-xs md:text-sm">{action.label}</span>
                        </div>
                        <ChevronRight size={14} className="md:w-4 md:h-4 text-gray-300 group-hover:text-gray-500" />
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