import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ArrowLeft, Send, Save, Calendar } from "lucide-react";
import { announcementsApi, AnnouncementCreate } from "../../services/announcementsApi";

import { 
  Editor, 
  EditorProvider, 
  Toolbar, 
  BtnBold, 
  BtnItalic, 
  BtnUnderline, 
  BtnStrikeThrough, 
  BtnBulletList, 
  BtnNumberedList, 
  BtnLink, 
  BtnClearFormatting 
} from 'react-simple-wysiwyg';

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AnnouncementCreate>({
    title: "",
    content: "",
    audience: "all_users",
    channel: "both",
    status: "draft",
    priority: "medium",
    scheduled_for: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (e: any) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleSubmit = async (status: "draft" | "scheduled" | "sent") => {
    try {
      setLoading(true);
      setError(null);

      const dataToSubmit = {
        ...formData,
        status,
      };

      if (status !== "scheduled") {
        delete dataToSubmit.scheduled_for;
      }

      await announcementsApi.create(dataToSubmit);
      navigate("/admin/announcements");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-montserrat">
     
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main
        className={`flex-1 min-w-0 bg-gray-50 transition-all duration-300 min-h-screen flex flex-col ${
          collapsed ? "md:ml-20" : "md:ml-64"
        } ml-0`} // ml-0 for mobile, md:ml for desktop
      >
        <Header title="Create Announcement" />

        <div className="flex-1 bg-[#F4F7FE] px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto">
            
            {/* Navigation & Header */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={() => navigate("/admin/announcements")}
                className="flex items-center gap-2 text-gray-600 hover:text-[#5C32A3] mb-4 transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm sm:text-base">Back to Announcements</span>
              </button>
              
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight uppercase">
                Create New Announcement
              </h1>
              
              <nav className="hidden sm:flex text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">
                Admin <span className="mx-2 text-gray-300">/</span> Communications <span className="mx-2 text-gray-300">/</span> Create
              </nav>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 shadow-sm animate-pulse">
                <p className="text-xs font-black uppercase tracking-widest">Error Occurred</p>
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-5 sm:p-8">
              <div className="space-y-6 sm:space-y-8">
                
                {/* Title Input */}
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-[#5C32A3] transition-colors">
                    Announcement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Annual General Meeting 2026"
                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-[#5C32A3] transition-all font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-normal"
                    required
                  />
                </div>

                {/* Editor Section */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Message Content <span className="text-red-500">*</span>
                  </label>
                  <div className="rich-text-wrapper rounded-xl overflow-hidden border-2 border-gray-100 focus-within:border-[#5C32A3] transition-all">
                    <EditorProvider>
                      <Editor 
                        value={formData.content} 
                        onChange={handleEditorChange}
                        placeholder="Type your message here..."
                      >
                        <Toolbar>
                          <BtnBold />
                          <BtnItalic />
                          <BtnUnderline />
                          <BtnStrikeThrough />
                          <BtnNumberedList />
                          <BtnBulletList />
                          <BtnLink />
                          <BtnClearFormatting />
                        </Toolbar>
                      </Editor>
                    </EditorProvider>
                  </div>
                </div>

                {/* Responsive Grid for Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Audience</label>
                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-[#5C32A3] font-bold text-gray-700 bg-white"
                    >
                      <option value="all_users">All Users</option>
                      <option value="members">Members</option>
                      <option value="applicants">Applicants</option>
                      <option value="admins">Admins</option>
                      <option value="expired_members">Expired Members</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Channel</label>
                    <select
                      name="channel"
                      value={formData.channel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-[#5C32A3] font-bold text-gray-700 bg-white"
                    >
                      <option value="both">Both (Email & In-App)</option>
                      <option value="email">Email Only</option>
                      <option value="in_app">In-App Only</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority Level</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-[#5C32A3] font-bold text-gray-700 bg-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule Publication</label>
                    <input
                      type="datetime-local"
                      name="scheduled_for"
                      value={formData.scheduled_for}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-purple-50 focus:border-[#5C32A3] font-bold text-gray-700 bg-white"
                    />
                  </div>
                </div>

                {/* Footer Buttons  */}
                <div className="flex flex-col lg:flex-row gap-3 pt-8 border-t border-gray-50">
                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={loading || !formData.title || !formData.content}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    <Save size={18} />
                    Save Draft
                  </button>

                  {formData.scheduled_for && (
                    <button
                      onClick={() => handleSubmit("scheduled")}
                      disabled={loading || !formData.title || !formData.content}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                      <Calendar size={18} />
                      Schedule
                    </button>
                  )}

                  <button
                    onClick={() => handleSubmit("sent")}
                    disabled={loading || !formData.title || !formData.content}
                    className="flex-[1.5] flex items-center justify-center gap-2 px-8 py-4 bg-[#5C32A3] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4A2882] transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
                  >
                    <Send size={18} />
                    {loading ? "Processing..." : "Broadcast Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap');
        
        .font-montserrat { font-family: 'Montserrat', sans-serif; }

        .rich-text-wrapper .rsw-editor {
          border: none !important;
          background: white;
          min-height: 350px;
        }
        .rich-text-wrapper .rsw-toolbar {
          background-color: #fcfcfd;
          border-bottom: 2px solid #f9fafb;
          padding: 10px;
        }
        .rich-text-wrapper .rsw-ce {
          padding: 20px;
          min-height: 300px;
          outline: none;
          font-weight: 500;
          color: #374151;
        }
        .rich-text-wrapper .rsw-btn {
          border-radius: 6px;
          transition: all 0.2s;
        }
        .rich-text-wrapper .rsw-btn[data-active="true"] {
          color: #5C32A3 !important;
          background: #f3e8ff !important;
        }
        
        /* Custom scrollbar for better UX */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
}