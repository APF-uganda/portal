import { useEffect, useState } from 'react';
import axios from 'axios';

// Admin Layout Components
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminInquiryDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('adminToken'); 
        const res = await axios.get(`${API_URL}/api/inquiries/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(res.data);
      } catch (err) {
        console.error("Error fetching inquiries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="flex min-h-screen">
     
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        
        
        <Header title="Contact Inquiries" />

       
        <div className="flex-1 bg-[#F4F2FE] p-8 space-y-10">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
            {/* Title Section */}
            <div>
              
              <p className="text-slate-500 mt-1">Review and manage inquiries sent through the contact us page.</p>
            </div>

            {/* Inquiries Table Card */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 border-b border-gray-100">Date Received</th>
                      <th className="px-6 py-4 border-b border-gray-100">Sender Details</th>
                      <th className="px-6 py-4 border-b border-gray-100">Subject</th>
                      <th className="px-6 py-4 border-b border-gray-100">Message Snippet</th>
                      <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr>
                         <td colSpan={5} className="text-center py-12">
                           <div className="flex flex-col items-center space-y-2">
                             <div className="w-6 h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
                             <span className="text-gray-400 text-sm font-medium">Loading inquiries...</span>
                           </div>
                         </td>
                       </tr>
                    ) : inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400 font-medium">
                          No inquiries found in the system.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((iq) => (
                        <tr key={iq.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(iq.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-bold text-gray-800">{iq.name}</div>
                            <div className="text-xs text-[#5E2590]">{iq.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700 uppercase tracking-tight">
                            {iq.subject}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {iq.message}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <a 
                              href={`mailto:${iq.email}`}
                              className="font-bold transition-colors whitespace-nowrap text-sm px-4 py-2 rounded-lg hover:bg-purple-50 text-[#5E2590]"
                            >
                              Reply to Inquiry
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* 4. Footer Component */}
        <Footer />
      </main>
    </div>
  );
};

export default AdminInquiryDashboard;