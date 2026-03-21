import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ExternalLink, CheckCircle, ShieldCheck, Mail, Loader2, 
  User, X, AlertCircle, ArrowLeft 
} from 'lucide-react';
import eventService from '../../services/eventService'; 

// Components for Layout Consistency
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  
  // Layout State
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Data State
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState<number | null>(null);

  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 4000);
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllRegistrations();
      setRegistrations(data);
    } catch (error) {
      showNotification("Could not load registration data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    setIsVerifying(id);
    try {
      await eventService.verifyPayment(id);
      showNotification("Attendee verified! Confirmation email sent.", "success");
      await fetchRegistrations(); 
    } catch (error) {
      showNotification("Verification failed. Please try again.", "error");
    } finally {
      setIsVerifying(null);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen`}>
        
        {/* Navigation Header */}
        <Header title="Registrations Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-6 md:p-10 lg:p-12">
          
          {/* Notification Overlay */}
          {notification.show && (
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 
              notification.type === 'error' ? 'bg-white border-red-100 text-red-800' : 
              'bg-white border-blue-100 text-blue-800'
            }`}>
              {notification.type === 'success' ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
              <p className="font-semibold text-sm">{notification.message}</p>
              <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 opacity-50 hover:opacity-100">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            
            {/* Top Navigation Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <button 
                  onClick={() => navigate('/admin/cmsPage')} 
                  className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-medium text-sm mb-2 transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Control Center
                </button>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Event Registrations</h1>
                <p className="text-slate-500 mt-1">Review attendees and verify payment proofs.</p>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-sm">
                <ShieldCheck size={16} className="text-purple-600" /> 
                Admin Secure Mode
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
                <p className="text-slate-400 font-medium">Loading attendee list...</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Attendee Details</th>
                        <th className="px-6 py-5">Event Name</th>
                        <th className="px-6 py-5">Payment Proof</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {registrations.length > 0 ? (
                        registrations.map((reg: any) => (
                          <tr key={reg.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                  <User size={20} />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{reg.full_name}</div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Mail size={12} /> {reg.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6 font-medium text-slate-700">
                              {reg.event_title}
                            </td>
                            <td className="px-6 py-6">
                              {reg.proof_of_payment ? (
                                <a 
                                  href={reg.proof_of_payment} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-purple-600 font-bold text-xs inline-flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg"
                                >
                                  View Receipt <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-slate-300 text-xs italic">No file</span>
                              )}
                            </td>
                            <td className="px-6 py-6">
                              <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border ${
                                reg.payment_status === 'Verified' 
                                  ? 'bg-green-50 text-green-700 border-green-100' 
                                  : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>
                                {reg.payment_status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              {reg.payment_status !== 'Verified' ? (
                                <button 
                                  onClick={() => handleVerify(reg.id)}
                                  disabled={isVerifying === reg.id}
                                  className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2 ml-auto"
                                >
                                  {isVerifying === reg.id && <Loader2 size={14} className="animate-spin" />}
                                  Verify Attendee
                                </button>
                              ) : (
                                <div className="text-green-600 flex items-center justify-end gap-1 text-xs font-bold uppercase tracking-wider">
                                  <CheckCircle size={14} /> Confirmed
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                            No registrations found for any events.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AdminEvents;