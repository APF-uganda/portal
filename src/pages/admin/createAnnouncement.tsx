import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ArrowLeft, Send, Save, Calendar } from "lucide-react";
import { announcementsApi, AnnouncementCreate } from "../../services/announcementsApi";

//  Import ReactQuill and its styles
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const QuillEditor = ReactQuill as any;
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

  // Specialized handler for the Rich Text Editor
  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
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

  //Toolbar configuration for a clean look
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
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
              <div>
                <button
                  onClick={() => navigate("/admin/announcements")}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#5C32A3] mb-4 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Back to Announcements</span>
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create New Announcement</h1>
                <nav className="text-sm font-medium text-gray-400 mt-2 break-words">
                  Admin Dashboard <span className="mx-1">&gt;</span> Communications{" "}
                  <span className="mx-1">&gt;</span> Create Announcement
                </nav>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Form */}
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

                {/* Content - Updated to Rich Text Editor */}
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="rich-text-wrapper">
                    <QuillEditor
                      theme="snow"
                      value={formData.content}
                      onChange={handleEditorChange}
                      modules={modules}
                      placeholder="Enter announcement content..."
                      className="rounded-lg"
                    />
                  </div>
                </div>

                {/* Audience and Channel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Audience <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] focus:border-transparent"
                    >
                      <option value="all_users">All Users</option>
                      <option value="members">Members</option>
                      <option value="applicants">Applicants</option>
                      <option value="admins">Admins</option>
                      <option value="expired_members">Expired Members</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Channel <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="channel"
                      value={formData.channel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] focus:border-transparent"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Schedule For (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduled_for"
                      value={formData.scheduled_for}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={loading || !formData.title || !formData.content || formData.content === '<p><br></p>'}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    Save as Draft
                  </button>

                  {formData.scheduled_for && (
                    <button
                      onClick={() => handleSubmit("scheduled")}
                      disabled={loading || !formData.title || !formData.content || formData.content === '<p><br></p>'}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Calendar size={20} />
                      Schedule
                    </button>
                  )}

                  <button
                    onClick={() => handleSubmit("sent")}
                    disabled={loading || !formData.title || !formData.content || formData.content === '<p><br></p>'}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#5C32A3] text-white rounded-lg font-semibold hover:bg-[#4A2882] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        .rich-text-wrapper .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: #e5e7eb;
          background-color: #f9fafb;
        }
        .rich-text-wrapper .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: #e5e7eb;
          min-height: 250px;
          font-family: inherit;
        }
        .rich-text-wrapper .ql-editor {
          min-height: 250px;
          font-size: 1rem;
          color: #374151;
        }
        .rich-text-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-wrapper .ql-snow.ql-toolbar button:hover,
        .rich-text-wrapper .ql-snow.ql-toolbar button.ql-active {
          color: #5C32A3;
        }
        .rich-text-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #5C32A3;
        }
      `}</style>
    </div>
  );
}