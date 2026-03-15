import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Mail, X, Send } from 'lucide-react';


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
      await axios.post(`${API_URL}/api/v1/contacts/${selectedInquiry.id}/reply/`, 
        { reply_text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Reply sent successfully via email!");
      setReplyText("");
      setSelectedInquiry(null);
      fetchInquiries(); 
    } catch (err) {
      console.error(err);
      alert("Failed to send email. Ensure your Django SMTP settings are configured.");
    } finally {
      setSending(false);
    }
  };

  const handleToggleRead = async (id: number) => {
    try {
      const token = getAccessToken();
      await axios.patch(`${API_URL}/api/v1/contacts/${id}/toggle-read/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.map(iq => 
        iq.id === id ? { ...iq, is_read: !iq.is_read } : iq
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_URL}/api/v1/contacts/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(inquiries.filter(iq => iq.id !== id));
    } catch (err) {
      alert("Failed to delete inquiry");
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
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
                                <button onClick={() => handleToggleRead(iq.id)} className={`p-1.5 md:p-2 rounded-lg ${iq.is_read ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}>
                                  <CheckCircle size={14} className="md:w-[18px] md:h-[18px]" />
                                </button>
                                <button 
                                  onClick={() => setSelectedInquiry(iq)} 
                                  className="p-1.5 md:p-2 text-[#5E2590] bg-purple-50 rounded-lg"
                                >
                                  <Mail size={14} className="md:w-[18px] md:h-[18px]" />
                                </button>
                                <button onClick={() => handleDelete(iq.id)} className="p-1.5 md:p-2 text-red-600 bg-red-50 rounded-lg">
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

        {/* REPLY MODAL */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-xl w-full p-4 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setSelectedInquiry(null)} 
                className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 pr-8">Reply to Inquiry</h2>
              <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">From: <span className="font-semibold text-[#5E2590] break-all">{selectedInquiry.name} ({selectedInquiry.email})</span></p>

              <div className="bg-gray-50 p-3 md:p-4 rounded-xl mb-4 md:mb-6 max-h-32 overflow-y-auto border border-gray-100">
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1">Original Message:</p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed italic break-words">"{selectedInquiry.message}"</p>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your professional response here..."
                className="w-full h-32 md:h-48 p-3 md:p-4 rounded-xl border-2 border-gray-100 focus:border-[#5E2590] outline-none transition-all resize-none text-gray-700 text-sm md:text-base"
              />

              <div className="mt-4 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="flex-1 py-2 md:py-3 px-4 md:px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="flex-1 sm:flex-2 flex items-center justify-center gap-2 py-2 md:py-3 px-6 md:px-10 rounded-xl bg-[#5E2590] text-white font-bold hover:bg-[#4a1d72] disabled:bg-gray-300 transition-all shadow-lg shadow-purple-200 text-sm md:text-base"
                >
                  {sending ? "Sending..." : <><Send size={16} className="md:w-[18px] md:h-[18px]" /> Send Reply</>}
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
