import { useState } from 'react';
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { usePayments } from '../../hooks/usepayment';
import { PaymentStats } from '../../components/adminpayments-components/paymentstats';
import { PaymentTable } from '../../components/adminpayments-components/paymentTable';

const ManagePayments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { payments, stats, loading, error } = usePayments();

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col`}>
        <Header title="Payments Management" />
        
        <div className="flex-1 bg-[#F4F2FE] p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div>
              <h1 className="text-[26px] font-bold text-slate-800">Payments Dashboard</h1>
              <p className="text-slate-500">Monitor member payments and renewals.</p>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl">Error: {error}</div>}

            <PaymentStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PaymentTable payments={payments} loading={loading} />
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