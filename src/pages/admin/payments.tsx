import { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  FileText, 
  Settings, 
  ChevronRight, 
  Hash, 
  Clock, 
  Banknote,
  RefreshCw
} from 'lucide-react';

// Layout Components
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { PaymentTable } from "../../components/adminpayments-components/paymentTable";

import { usePayments } from '../../hooks/usepayment';
import { PaymentStatCard } from '../../components/payment-components/statcard';

const ManagePayments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { payments, stats, loading, error, refresh } = usePayments();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [nextRefresh, setNextRefresh] = useState<Date>(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    if (!loading) {
      setLastUpdated(new Date());
      setNextRefresh(new Date(Date.now() + 2 * 60 * 60 * 1000)); // Next refresh in 2 hours
    }
  }, [stats, loading]);

  // Update current time every minute to keep countdown accurate
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000); // Update every minute

    return () => clearInterval(timeInterval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      setLastUpdated(new Date());
      setNextRefresh(new Date(Date.now() + 2 * 60 * 60 * 1000)); // Reset next refresh time
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatLastUpdated = () => {
    const seconds = Math.floor((currentTime.getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatNextRefresh = () => {
    const minutes = Math.floor((nextRefresh.getTime() - currentTime.getTime()) / (1000 * 60));
    if (minutes <= 0) return 'Refreshing soon...';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Updated: {formatLastUpdated()}
                  </span>
                  <span className="text-[9px] font-medium text-gray-300 uppercase tracking-wider">
                    Next: {formatNextRefresh()}
                  </span>
                </div>
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
              
              <div className="lg:col-span-2">
                <PaymentTable 
                  payments={payments}
                  loading={loading}
                />
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