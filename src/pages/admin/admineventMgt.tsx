import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ExternalLink, CheckCircle, Mail, Loader2, 
  User, X, AlertCircle, ArrowLeft, Search, FileDown, Eye, Download, FileText
} from 'lucide-react';
import eventService from '../../services/eventService'; 
import { getAccessToken } from '../../utils/authStorage';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


const ReceiptModal = ({ isOpen, onClose, proofPath, name }: { isOpen: boolean, onClose: () => void, proofPath: string, name: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://64.225.121.230';

  useEffect(() => {
    if (isOpen && proofPath) loadFile();
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [isOpen, proofPath]);

  const loadFile = async () => {
    setLoading(true); setError(null);
    try {
      const token = getAccessToken();
      const finalUrl = proofPath.startsWith('http') ? proofPath : `${BACKEND_URL.replace(/\/+$/, '')}/${proofPath.replace(/^\/+/, '')}`;
      
      const response = await fetch(finalUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Could not fetch file");
      const blob = await response.blob();
      setPreviewUrl(URL.createObjectURL(blob));
      setFileType(blob.type);
    } catch (err) {
      setError("Failed to load receipt. The file might be missing or restricted.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-600" size={18}/>
            <h2 className="font-bold text-slate-800">Payment Proof: {name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 flex items-center justify-center min-h-[300px]">
          {loading ? <Loader2 className="animate-spin text-purple-600" size={32} /> : 
           error ? <div className="text-center text-red-500 font-medium">{error}</div> :
           fileType?.includes('image') ? <img src={previewUrl!} className="max-w-full rounded-xl shadow-sm" alt="Receipt" /> :
           fileType?.includes('pdf') ? <iframe src={previewUrl!} className="w-full h-[60vh] rounded-xl border-none" title="PDF Preview" /> :
           <div className="text-slate-500">Preview not available. Please download.</div>
          }
        </div>
        <div className="p-4 border-t bg-white flex justify-end gap-3">
          {previewUrl && (
            <a href={previewUrl} download={`Receipt_${name}`} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-sm">
              <Download size={16}/> Download
            </a>
          )}
          <button onClick={onClose} className="px-5 py-2.5 text-slate-500 font-bold text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<{path: string, name: string} | null>(null);

  const [notification, setNotification] = useState<{
    show: boolean; message: string; type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 4000);
  };

  const fetchRegistrations = async (search: string = '') => {
    try {
      setLoading(true);
      const data = await eventService.getAllRegistrations(search);
      const results = data && data.results ? data.results : data;
      setRegistrations(Array.isArray(results) ? results : []);
    } catch (error: any) {
      showNotification("Could not load registration data.", "error");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    setIsVerifying(id);
    try {
      await eventService.verifyPayment(id);
      showNotification("Attendee verified! Confirmation email sent.", "success");
      await fetchRegistrations(searchTerm); 
    } catch (error) {
      showNotification("Verification failed.", "error");
    } finally {
      setIsVerifying(null);
    }
  };

  const handleExportPDF = () => {
    try {
      const pdfUrl = eventService.getExportPdfUrl(searchTerm);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      showNotification("Failed to generate PDF.", "error");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchRegistrations(searchTerm), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 relative">
      
      {/* Receipt Preview Popup */}
      <ReceiptModal 
        isOpen={!!selectedReceipt} 
        onClose={() => setSelectedReceipt(null)} 
        proofPath={selectedReceipt?.path || ''} 
        name={selectedReceipt?.name || ''} 
      />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-h-screen`}>
        <Header title="Registrations Management" onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />

        <div className="flex-1 p-4 md:p-10 lg:p-12">
          {notification.show && (
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 
              notification.type === 'error' ? 'bg-white border-red-100 text-red-800' : 'bg-white border-blue-100 text-blue-800'
            }`}>
              {notification.type === 'success' ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
              <p className="font-semibold text-sm">{notification.message}</p>
              <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 opacity-50"><X size={16} /></button>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <button onClick={() => navigate('/admin/cmsPage')} className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-medium text-sm mb-2 transition-colors">
                  <ArrowLeft size={16} /> Back to Control Center
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Event Registrations</h1>
                <p className="text-slate-500 mt-1">Review attendees and verify payment proofs.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search event title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-all" />
                </div>
                <button onClick={handleExportPDF} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm">
                  <FileDown size={18} /> Export PDF
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
                <p className="text-slate-400 font-medium">Loading attendee list...</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Attendee Details</th>
                        <th className="px-6 py-5">Event Name</th>
                        <th className="px-6 py-5">Payment Proof</th>
                        
                        <th className="px-6 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {registrations.length > 0 ? registrations.map((reg: any) => (
                        <tr key={reg.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={20} /></div>
                              <div>
                                <div className="font-bold text-slate-900">{reg.full_name}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Mail size={12} /> {reg.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 font-medium text-slate-700">{reg.event_title}</td>
                          <td className="px-6 py-6">
                            {reg.proof_of_payment ? (
                              <button 
                                onClick={() => setSelectedReceipt({path: reg.proof_of_payment, name: reg.full_name})}
                                className="text-purple-600 font-bold text-xs inline-flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                              >
                                View Receipt <Eye size={12} />
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs italic">No file</span>
                            )}
                          </td>
                          <td className="px-6 py-6">
                          
                            <div className="flex justify-center">
                              <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border whitespace-nowrap ${
                                reg.payment_status === 'Verified' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>
                                {reg.payment_status}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            {reg.payment_status !== 'Verified' ? (
                              <button onClick={() => handleVerify(reg.id)} disabled={isVerifying === reg.id} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm ml-auto flex items-center gap-2">
                                {isVerifying === reg.id && <Loader2 size={14} className="animate-spin" />} Verify Attendee
                              </button>
                            ) : (
                              <div className="text-green-600 flex items-center justify-end gap-1 text-xs font-bold uppercase tracking-wider">
                                <CheckCircle size={14} /> Confirmed
                              </div>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">No registrations found matching your search.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards  */}
                <div className="md:hidden divide-y divide-slate-100">
                  {registrations.length > 0 ? registrations.map((reg: any) => (
                    <div key={reg.id} className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0"><User size={20} /></div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{reg.full_name}</div>
                            <div className="text-xs text-slate-500 truncate">{reg.email}</div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border flex-shrink-0 ${
                          reg.payment_status === 'Verified' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {reg.payment_status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event</p>
                          <p className="text-xs font-medium text-slate-700 line-clamp-1">{reg.event_title}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</p>
                          {reg.proof_of_payment ? (
                            <button 
                              onClick={() => setSelectedReceipt({path: reg.proof_of_payment, name: reg.full_name})}
                              className="text-purple-600 font-bold text-[10px] inline-flex items-center gap-1"
                            >
                              View Receipt <Eye size={10} />
                            </button>
                          ) : (
                            <span className="text-slate-300 text-[10px] italic">No file</span>
                          )}
                        </div>
                      </div>
                      <div className="pt-2">
                        {reg.payment_status !== 'Verified' ? (
                          <button onClick={() => handleVerify(reg.id)} disabled={isVerifying === reg.id} className="w-full bg-purple-600 text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2">
                            {isVerifying === reg.id && <Loader2 size={14} className="animate-spin" />} Verify Attendee
                          </button>
                        ) : (
                          <div className="w-full py-3 bg-green-50 text-green-600 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border border-green-100">
                            <CheckCircle size={14} /> Confirmed
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="px-8 py-20 text-center text-slate-400 font-medium">No registrations found.</div>
                  )}
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