import { useEffect, useState } from 'react';
import { X, User,  FileText, Eye,  Loader2,  Download,  } from 'lucide-react';

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age_range: string;
  address: string;
  nationalIdNumber: string;
  icpauCertificateNumber: string;
  organization: string;
  status: string;
  submitted_at: string;
  documents?: Array<{
    id: number;
    file_name: string;
    file_url?: string;
    file?: string;
    document?: string;
    document_type: string;
  }>;
}

interface ApplicationDetailModalProps {
  applicationId: number;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onRetry?: (id: number) => Promise<void>;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  applicationId,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRetry
}) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplicationDetails();
    }
    
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, applicationId]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/applications/${applicationId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch application details');
      const data = await response.json();
      setApplication(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // SECURE FETCH LOGIC
  const handleViewDocument = async (doc: any) => {
    setIsPreviewLoading(doc.id);
    const path = doc.file_url || doc.file || doc.document;
    if (!path) {
      alert("No file path found for this document.");
      setIsPreviewLoading(null);
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const finalUrl = path.startsWith('http') ? path : `${cleanBase}${cleanPath}`;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(finalUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      
      
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      const objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    } catch (err) {
      console.error("Authenticated fetch failed:", err);
      
      window.open(finalUrl, '_blank');
    } finally {
      setIsPreviewLoading(null);
    }
  };

  const handleAction = async (action?: (id: number) => Promise<void>) => {
    if (!action || !application) return;
    setSubmitting(true);
    try {
      await action(application.id);
      await fetchApplicationDetails(); 
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-[#5C32A3] px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Member Application Details</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white px-6 py-4 max-h-[75vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C32A3]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
            ) : application ? (
              <div className="space-y-6">
                {/* Status Bar */}
                <div className="flex justify-between items-center border-b pb-4">
                  <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Submitted</p>
                    <p className="text-sm text-gray-900">{formatDate(application.submitted_at)}</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-bold text-[#5C32A3] mb-3 flex items-center gap-2">
                    <User size={18} /> Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Name</label>
                      <p className="text-gray-900 font-medium">
                        {application.firstName || (application as any).first_name} {application.lastName || (application as any).last_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                      <p className="text-gray-900">{application.phoneNumber || (application as any).phone_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">National ID</label>
                      <p className="text-gray-900 font-mono text-sm">{application.nationalIdNumber || (application as any).national_id_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Organization</label>
                      <p className="text-gray-900">{application.organization || (application as any).employer_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                {application.documents && application.documents.length > 0 && (
                  <div>
                    <h4 className="text-md font-bold text-[#5C32A3] mb-3 flex items-center gap-2">
                      <FileText size={18} /> Documents
                    </h4>
                    <div className="space-y-2">
                      {application.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between bg-white border p-3 rounded-lg hover:border-[#5C32A3] transition-all shadow-sm">
                          <div className="flex items-center gap-3">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                              <p className="text-sm font-bold text-gray-800">{doc.file_name || 'Document'}</p>
                              <p className="text-[10px] text-gray-400 uppercase">{doc.document_type}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleViewDocument(doc)}
                            disabled={isPreviewLoading !== null}
                            className="flex items-center gap-1 text-xs font-bold text-[#5C32A3] bg-[#F4F2FE] px-4 py-2 rounded-lg hover:bg-[#5C32A3] hover:text-white transition-all disabled:opacity-50"
                          >
                            {isPreviewLoading === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            <button onClick={onClose} className="px-6 py-2 bg-white border text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all">
              Close
            </button>
            {application && !loading && application.status.toLowerCase() === 'pending' && (
              <div className="flex gap-3">
                <button onClick={() => handleAction(onReject)} disabled={submitting} className="px-6 py-2 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Reject'}
                </button>
                <button onClick={() => handleAction(onApprove)} disabled={submitting} className="px-6 py-2 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Approve'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    
      {previewUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h4 className="font-bold text-gray-700 flex items-center gap-2">
                <FileText size={20} className="text-[#5C32A3]" /> Secure Preview
              </h4>
              <div className="flex items-center gap-2">
                <a 
                  href={previewUrl} 
                  download="document" 
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                  title="Download"
                >
                  <Download size={20} />
                </a>
                <button onClick={() => setPreviewUrl(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-100 overflow-hidden relative">
              
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-none" 
                title="Document Preview" 
              />
            </div>
            
            <div className="p-4 border-t text-right bg-white">
              <button onClick={() => setPreviewUrl(null)} className="px-8 py-2 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] shadow-sm">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailModal;