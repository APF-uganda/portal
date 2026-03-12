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
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main
        className={`flex-1 min-w-0 bg-gray-50 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        } min-h-screen flex flex-col`}
      >
        <Header title="Create Announcement" />

        <div className="flex-1 bg-[#F4F7FE] px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/admin/announcements")}
                className="flex items-center gap-2 text-gray-600 hover:text-[#5C32A3] mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Announcements</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create New Announcement</h1>
              <nav className="text-sm font-medium text-gray-400 mt-2">
                Admin Dashboard <span className="mx-1">&gt;</span> Communications <span className="mx-1">&gt;</span> Create Announcement
              </nav>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter announcement title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Content - New Editor */}
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="rich-text-wrapper">
                    <EditorProvider>
                      <Editor 
                        value={formData.content} 
                        onChange={handleEditorChange}
                        placeholder="Enter announcement content..."
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

                {/* Audience and Channel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Audience *</label>
                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3]"
                    >
                      <option value="all_users">All Users</option>
                      <option value="members">Members</option>
                      <option value="applicants">Applicants</option>
                      <option value="admins">Admins</option>
                      <option value="expired_members">Expired Members</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Channel *</label>
                    <select
                      name="channel"
                      value={formData.channel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3]"
                    >
                      <option value="both">Both (Email & In-App)</option>
                      <option value="email">Email Only</option>
                      <option value="in_app">In-App Only</option>
                    </select>
                  </div>
                </div>

                {/* Priority and Scheduled Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority *</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule For</label>
                    <input
                      type="datetime-local"
                      name="scheduled_for"
                      value={formData.scheduled_for}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={loading || !formData.title || !formData.content}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <Save size={20} />
                    Save as Draft
                  </button>

                  {formData.scheduled_for && (
                    <button
                      onClick={() => handleSubmit("scheduled")}
                      disabled={loading || !formData.title || !formData.content}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Calendar size={20} />
                      Schedule
                    </button>
                  )}

                  <button
                    onClick={() => handleSubmit("sent")}
                    disabled={loading || !formData.title || !formData.content}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#5C32A3] text-white rounded-lg font-semibold hover:bg-[#4A2882] transition-colors disabled:opacity-50"
                  >
                    <Send size={20} />
                    {loading ? "Sending..." : "Send Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

     
      <style>{`
        .rich-text-wrapper .rsw-editor {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          min-height: 300px;
        }
        .rich-text-wrapper .rsw-toolbar {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 8px;
        }
        .rich-text-wrapper .rsw-ce {
          padding: 16px;
          min-height: 250px;
          outline: none;
        }
        .rich-text-wrapper .rsw-btn[data-active="true"] {
          color: #5C32A3;
          background: #f3e8ff;
        }
      `}</style>
    </div>
  );
}