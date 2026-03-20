import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Mail, X, Send, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import StatCard from '../../components/manageusers-components/stats';

import { getAccessToken } from '../../utils/authStorage';
import { API_BASE_URL } from '../../config/api';

const API_URL = API_BASE_URL;

const AdminInquiryDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  // NOTIFICATION STATE
  const [notification, setNotification] = useState<{show: boolean, msg: string, type: 'success' | 'error'} | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const showNotice = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchInquiries = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/v1/contacts/list/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setInquiries(data);
    } catch (err: any) {
      console.error("Error fetching inquiries:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedInquiry) return;
    setSending(true);
    try {
      const token = getAccessToken();
      const response = await axios.post(`${API_URL}/api/v1/contacts/${selectedInquiry.id}/reply/`, 
        { reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotice(response.data.message || "Reply sent successfully via email!");
      setReplyText("");
      setSelectedInquiry(null);
      fetchInquiries(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to send email. Please check your email configuration.";
      console.error("Error sending reply:", err.response?.data || err.message);
      showNotice(errorMsg, "error");
    } finally {
      setSending(false);
    }
  };

  const handleToggleRead = async (id: number) => {
    try {
      const token = getAccessToken();
      const response = await axios.patch(`${API_URL}/api/v1/contacts/${id}/toggle-read/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state with the response data
      setInquiries(prev => prev.map(iq => 
        iq.id === id ? response.data.data : iq
      ));
      showNotice(response.data.message || "Status updated");
    } catch (err: any) {
      console.error("Error toggling status:", err.response?.data || err.message);
      showNotice(err.response?.data?.error || "Failed to update status", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getAccessToken();
      const response = await axios.delete(`${API_URL}/api/v1/contacts/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.filter(iq => iq.id !== id));
      setDeleteConfirm(null);
      showNotice(response.data.message || "Inquiry deleted");
    } catch (err: any) {
      console.error("Error deleting inquiry:", err.response?.data || err.message);
      showNotice(err.response?.data?.error || "Failed to delete inquiry", "error");
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden font-sans">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col w-full min-w-0`}>
        <Header 
          title="Inquiries Management" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* TOAST NOTIFICATION */}
        {notification?.show && (
          <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'}`}>
            {notification.type === 'success' ? <CheckCircle className="text-green-500" size={20}/> : <AlertCircle className="text-red-500" size={20}/>}
            <p className="text-sm font-bold uppercase tracking-wider">{notification.msg}</p>
          </div>
        )}

        <div className="flex-1 bg-[#F4F2FE] py-3 md:py-6 space-y-6 md:space-y-10 overflow-y-auto">
          <div className="w-full space-y-6 md:space-y-10 px-3 md:px-6">
            
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-slate-800 tracking-tight">Public Inquiries</h1>
                <p className="text-slate-500 mt-1 text-sm md:text-base">Manage communication with your website visitors.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                 <StatCard title="Total" value={inquiries.length} color="border-purple-500" />
                 <StatCard title="Unread" value={inquiries.filter(i => !i.is_read).length} color="border-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
                <table className="min-w-full leading-normal min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100">Received</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100">Sender</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100">Subject & Message</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100">Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr><td colSpan={5} className="text-center py-8 md:py-12 text-sm md:text-base">Loading...</td></tr>
                    ) : inquiries.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 md:py-12 text-gray-400 text-sm md:text-base">No inquiries found.</td></tr>
                    ) : (
                      inquiries.map((iq) => (
                        <tr key={iq.id} className={`hover:bg-gray-50 transition-colors ${!iq.is_read ? 'bg-blue-50/20' : ''}`}>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                             {new Date(iq.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm">
                            <div className="font-bold text-gray-800 truncate max-w-[120px] md:max-w-none">{iq.name}</div>
                            <div className="text-[10px] md:text-xs text-[#5E2590] truncate max-w-[120px] md:max-w-none">{iq.email}</div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm max-w-[150px] md:max-w-xs">
                            <div className="font-medium text-gray-700 truncate">{iq.subject}</div>
                            <div className="text-gray-400 text-[10px] md:text-xs truncate">{iq.message}</div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm">
                            <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                              ${iq.is_read ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {iq.is_read ? 'Read' : 'New'}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-right">
                            <div className="flex justify-end gap-1 md:gap-3">
                                <button 
                                  onClick={() => handleToggleRead(iq.id)} 
                                  title={iq.is_read ? "Mark as Unread" : "Mark as Read"}
                                  className={`p-1.5 md:p-2 rounded-lg transition-all active:scale-90 ${iq.is_read ? 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100' : 'text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100'}`}
                                >
                                  {iq.is_read ? <EyeOff size={14} className="md:w-[18px] md:h-[18px]" /> : <Eye size={14} className="md:w-[18px] md:h-[18px]" />}
                                </button>
                                <button 
                                  onClick={() => setSelectedInquiry(iq)} 
                                  title="Reply via Email"
                                  className="p-1.5 md:p-2 text-[#5E2590] bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
                                >
                                  <Mail size={14} className="md:w-[18px] md:h-[18px]" />
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirm(iq.id)} 
                                  title="Delete Inquiry"
                                  className="p-1.5 md:p-2 text-red-600 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 size={14} className="md:w-[18px] md:h-[18px]" />
                                </button>
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
        </div>

        {/*  DELETE CONFIRMATION MODAL */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-tight">Delete Inquiry?</h3>
              <p className="text-slate-500 text-sm mb-8">This action cannot be undone. The inquiry will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors uppercase text-[11px] tracking-widest">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-shadow shadow-lg shadow-red-100 uppercase text-[11px] tracking-widest">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* REPLY MODAL */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-3 md:p-4 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-6 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedInquiry(null)} 
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-purple-50 text-[#5E2590] rounded-2xl">
                    <Mail size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Professional Reply</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Direct Email Response</p>
                 </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                   <p className="text-[10px] font-black text-[#5E2590] uppercase tracking-widest">Original Message</p>
                   <span className="text-[10px] font-bold text-gray-400">{selectedInquiry.name}</span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic break-words line-clamp-4">"{selectedInquiry.message}"</p>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-40 md:h-56 p-5 rounded-2xl border-2 border-slate-100 focus:border-[#5E2590] outline-none transition-all resize-none text-slate-700 text-sm md:text-base bg-white shadow-inner"
              />

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase text-[11px] tracking-widest"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="flex-1 sm:flex-2 flex items-center justify-center gap-2 py-4 px-10 rounded-2xl bg-[#5E2590] text-white font-bold hover:bg-[#4a1d72] disabled:bg-slate-200 transition-all shadow-xl shadow-purple-100 uppercase text-[11px] tracking-widest"
                >
                  {sending ? "Processing..." : <><Send size={16} /> Send Email</>}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </main>
    </div>
  );
};

export default AdminInquiryDashboard;