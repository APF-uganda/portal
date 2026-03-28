import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { 
  Plus, Megaphone, FileEdit, Clock, 
  Eye, ChevronLeft, ChevronRight, Trash2, Send, Copy, AlertCircle, CheckCircle2, X
} from 'lucide-react';
import { StatCard, Badge } from '../../components/comm-components/stats';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { announcementsApi } from '../../services/announcementsApi';

// Confirm Modal Component
const ModernAlert = ({ 
  isOpen, 
  type = 'confirm', 
  title, 
  message, 
  onConfirm, 
  onClose,
  isLoading = false 
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-montserrat">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-[#5C32A3]'
          }`}>
            {type === 'danger' ? <Trash2 size={32} /> : type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
          </div>
          <h3 className="text-xl  text-gray-800 uppercase tracking-tight mb-2">{title}</h3>
          <p className="text-gray-500 font-medium leading-relaxed">{message}</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          {type === 'confirm' || type === 'danger' ? (
            <>
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg ${
                  type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-[#5C32A3] hover:bg-[#4A2882] shadow-purple-100'
                }`}
              >
                {isLoading ? 'Processing...' : 'Proceed'}
              </button>
            </>
          ) : (
            <button 
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] transition-all text-xs uppercase tracking-widest shadow-lg shadow-purple-100"
            >
              Understand
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CommunicationsDashboard() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Alert State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'danger' | 'success' | 'error';
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const { announcements, stats, loading, refetch } = useAnnouncements({
    status: statusFilter,
    search: searchQuery,
  });

  const showAlert = (type: any, title: string, message: string, onConfirm = () => {}) => {
    setAlertConfig({
      isOpen: true,
      type,
      title,
      message,
      onConfirm: async () => {
        await onConfirm();
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDelete = (id: number) => {
    showAlert(
      'danger', 
      'Delete Announcement', 
      'This action is permanent. Are you sure you want to remove this announcement?',
      async () => {
        try {
          await announcementsApi.delete(id);
          refetch();
        } catch (error) {
          showAlert('error', 'Action Failed', 'We could not delete the announcement at this time.');
        }
      }
    );
  };

  const handleSend = (id: number) => {
    showAlert(
      'confirm', 
      'Broadcast Now', 
      'This will immediately send the announcement to the selected audience. Proceed?',
      async () => {
        try {
          await announcementsApi.send(id);
          refetch();
        } catch (error) {
          showAlert('error', 'Delivery Failed', 'The announcement could not be sent.');
        }
      }
    );
  };

  const handleDuplicate = async (id: number) => {
    try {
      await announcementsApi.duplicate(id);
      refetch();
    } catch (error) {
      showAlert('error', 'Copy Failed', 'Unable to duplicate this item.');
    }
  };

  // Formatting helpers remain the same...
  const formatAudience = (audience: string) => {
    const map: Record<string, string> = {
      'all_users': 'All Users', 'members': 'Members', 'applicants': 'Applicants',
      'admins': 'Admins', 'expired_members': 'Expired Members',
    };
    return map[audience] || audience;
  };
  const formatChannel = (channel: string) => {
    const map: Record<string, string> = { 'both': 'Both', 'email': 'Email', 'in_app': 'In-App' };
    return map[channel] || channel;
  };
  const formatStatus = (status: string) => {
    const map: Record<string, string> = { 'draft': 'Draft', 'scheduled': 'Scheduled', 'sent': 'Sent' };
    return map[status] || status;
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="flex min-h-screen overflow-hidden font-montserrat">
      {/* Modern Alert Component Instance */}
      <ModernAlert 
        {...alertConfig} 
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))} 
      />

      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col w-full min-w-0`}>
        <Header 
          title="Communications Dashboard" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 bg-[#F4F7FE] py-3 md:py-6 overflow-y-auto">
          <div className="w-full space-y-4 md:space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-3 md:px-6">
              <div>
                <h1 className="text-2xl md:text-3xl  text-gray-800 mb-1 md:mb-2 uppercase tracking-tight">Communications</h1>
                <nav className="text-[10px] md:text-xs  text-gray-400 uppercase tracking-widest">
                  Admin <span className="mx-1 text-gray-300">/</span> Communications
                </nav>
              </div>
              <button 
                onClick={() => navigate('/admin/create-announcement')}
                className="bg-[#5C32A3] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl flex items-center gap-2  uppercase tracking-widest shadow-lg shadow-purple-100 hover:bg-[#4A2882] transition-all text-xs md:text-sm w-full md:w-auto justify-center"
              >
                <Plus size={18} className="md:w-5 md:h-5" strokeWidth={3} /> 
                <span>New Announcement</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 px-3 md:px-6">
              <StatCard title="Total Volume" value={stats?.total || 0} subtext="Lifetime items" icon={Megaphone} color="bg-purple-100 text-purple-600" />
              <StatCard title="Drafts" value={stats?.draft || 0} subtext="Pending review" icon={FileEdit} color="bg-orange-50 text-orange-500" />
              <StatCard title="Scheduled" value={stats?.scheduled || 0} subtext="Upcoming delivery" icon={Clock} color="bg-green-50 text-green-500" />
            </div>

            {/* Announcements Table */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden mx-3 md:mx-6">
              <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 gap-3">
                <h2 className="text-sm  text-gray-800 uppercase tracking-widest">Active Archives</h2>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5C32A3] w-full sm:w-auto"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 text-xs border-2 border-gray-50 rounded-lg focus:outline-none focus:border-[#5C32A3] w-full sm:w-auto font-medium"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C32A3]"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-50/50">
                      <tr className="text-[10px]  text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Audience</th>
                        <th className="px-6 py-4">Channel</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Author</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {announcements.map((item) => (
                        <tr key={item.id} className="hover:bg-purple-50/30 transition-colors group">
                          <td className="px-6 py-5 font-bold text-gray-800 max-w-xs truncate text-sm">
                            {item.title}
                          </td>
                          <td className="px-6 py-5"><Badge label={formatAudience(item.audience)} type="Audience" /></td>
                          <td className="px-6 py-5"><Badge label={formatChannel(item.channel)} type={item.channel} /></td>
                          <td className="px-6 py-5"><Badge label={formatStatus(item.status)} type={item.status} /></td>
                          <td className="px-6 py-5 text-gray-600 font-bold text-xs">{item.created_by_name}</td>
                          <td className="px-6 py-5 text-gray-400 text-[10px] font-bold uppercase">{formatDate(item.created_at)}</td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              {item.status !== 'sent' && (
                                <button onClick={() => handleSend(item.id)} className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                  <Send size={18} />
                                </button>
                              )}
                              <button onClick={() => handleDuplicate(item.id)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Copy size={18} />
                              </button>
                              <button onClick={() => navigate(`/admin/announcements/${item.id}`)} className="p-2 text-gray-400 hover:text-[#5C32A3] transition-colors">
                                <Eye size={18} />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}