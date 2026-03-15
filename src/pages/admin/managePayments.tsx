import { useState } from 'react';
import { FileDown, RefreshCw } from 'lucide-react';
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { usePayments } from '../../hooks/usepayment';
import { PaymentStats } from '../../components/adminpayments-components/paymentstats';
import { PaymentTable } from '../../components/adminpayments-components/paymentTable';

const ManagePayments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { payments, stats, loading, error, refresh } = usePayments();

  // Function for handle Report Download
  const downloadReport = () => {
    if (payments.length === 0) return;
    
    // Create CSV Header
    const headers = ["Member Name", "Email", "Description", "Currency", "Amount", "Status"];
    
    // Create CSV Rows
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

    // Download 
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
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-[28px] font-black text-slate-600 tracking-tight">Payments Dashboard</h1>
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
                  <FileDown size={16} md:size={18} />
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
               <PaymentTable payments={payments} loading={loading} />
            </div>

           
            <div className="bg-white p-4 md:p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h3 className="font-bold text-slate-800">Financial Summary</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Your revenue is tracking <span className="text-emerald-500 font-bold">35.6%</span> higher than last month.
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
    </div>
  );
};

export default ManagePayments;