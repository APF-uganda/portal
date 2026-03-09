import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Mail, X, Send } from 'lucide-react';


import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import StatCard from '../../components/manageusers-components/stats';


import { getAccessToken } from '../../utils/authStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminInquiryDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
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
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} h-screen overflow-hidden flex flex-col w-full`}>
        <Header title="Inquiries Management" />

        <div className="flex-1 bg-[#F4F2FE] py-6 space-y-10 overflow-y-auto">
          <div className="w-full space-y-10 px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Public Inquiries</h1>
                <p className="text-slate-500 mt-1">Manage communication with your website visitors.</p>
              </div>
              
              <div className="flex gap-4">
                 <StatCard title="Total" value={inquiries.length} color="border-purple-500" />
                 <StatCard title="Unread" value={inquiries.filter(i => !i.is_read).length} color="border-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 border-b border-gray-100">Received</th>
                      <th className="px-6 py-4 border-b border-gray-100">Sender</th>
                      <th className="px-6 py-4 border-b border-gray-100">Subject & Message</th>
                      <th className="px-6 py-4 border-b border-gray-100">Status</th>
                      <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr><td colSpan={5} className="text-center py-12">Loading...</td></tr>
                    ) : inquiries.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-gray-400">No inquiries found.</td></tr>
                    ) : (
                      inquiries.map((iq) => (
                        <tr key={iq.id} className={`hover:bg-gray-50 transition-colors ${!iq.is_read ? 'bg-blue-50/20' : ''}`}>
                          <td className="px-6 py-4 text-sm text-gray-600">
                             {new Date(iq.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-bold text-gray-800">{iq.name}</div>
                            <div className="text-xs text-[#5E2590]">{iq.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm max-w-xs">
                            <div className="font-medium text-gray-700 truncate">{iq.subject}</div>
                            <div className="text-gray-400 text-xs truncate">{iq.message}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                              ${iq.is_read ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {iq.is_read ? 'Read' : 'New'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex justify-end gap-3">
                                <button onClick={() => handleToggleRead(iq.id)} className={`p-2 rounded-lg ${iq.is_read ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}>
                                  <CheckCircle size={18} />
                                </button>
                                <button 
                                  onClick={() => setSelectedInquiry(iq)} 
                                  className="p-2 text-[#5E2590] bg-purple-50 rounded-lg"
                                >
                                  <Mail size={18} />
                                </button>
                                <button onClick={() => handleDelete(iq.id)} className="p-2 text-red-600 bg-red-50 rounded-lg">
                                  <Trash2 size={18} />
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

        {/* REPLY */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl relative">
              <button 
                onClick={() => setSelectedInquiry(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reply to Inquiry</h2>
              <p className="text-sm text-gray-500 mb-6">From: <span className="font-semibold text-[#5E2590]">{selectedInquiry.name} ({selectedInquiry.email})</span></p>

              <div className="bg-gray-50 p-4 rounded-xl mb-6 max-h-32 overflow-y-auto border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Original Message:</p>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedInquiry.message}"</p>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your professional response here..."
                className="w-full h-48 p-4 rounded-xl border-2 border-gray-100 focus:border-[#5E2590] outline-none transition-all resize-none text-gray-700"
              />

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="flex-2 flex items-center justify-center gap-2 py-3 px-10 rounded-xl bg-[#5E2590] text-white font-bold hover:bg-[#4a1d72] disabled:bg-gray-300 transition-all shadow-lg shadow-purple-200"
                >
                  {sending ? "Sending..." : <><Send size={18} /> Send Reply</>}
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