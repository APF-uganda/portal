import { useEffect, useState } from 'react';
import { X, User,  FileText, Loader2,  Download,  } from 'lucide-react';
import { getAccessToken } from '../../utils/authStorage';

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

// Document Preview Component
const DocumentPreview: React.FC<{ doc: any }> = ({ doc }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    loadDocument();
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [doc.id]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    
    const path = doc.file_url || doc.file || doc.document;
    if (!path) {
      setError("No file path found");
      setLoading(false);
      return;
    }

    try {
      const token = getAccessToken();
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      let finalUrl = path;
      if (!path.startsWith('http')) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        finalUrl = `${cleanBase}${cleanPath}`;
      }

      const response = await fetch(finalUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        setError(`Failed to load: ${response.status}`);
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      const type = blob.type || doc.file_type || 'application/octet-stream';
      const objectUrl = URL.createObjectURL(blob);
      
      setPreviewUrl(objectUrl);
      setFileType(type);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch document:", err);
      setError("Failed to load document");
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-[#5C32A3]" size={20} />
          <div>
            <p className="text-sm font-bold text-gray-800">{formatDocumentType(doc.document_type)}</p>
            <p className="text-xs text-gray-500">{doc.file_name}</p>
          </div>
        </div>
        {previewUrl && (
          <a 
            href={previewUrl} 
            download={doc.file_name || 'document'} 
            className="flex items-center gap-1 text-xs font-bold text-[#5C32A3] bg-white px-3 py-1.5 rounded-lg hover:bg-[#5C32A3] hover:text-white transition-all border"
          >
            <Download size={14} />
            Download
          </a>
        )}
      </div>
      
      <div className="p-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-[#5C32A3]" size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : fileType?.startsWith('image/') ? (
          <div className="flex justify-center">
            <img 
              src={previewUrl!} 
              alt={doc.file_name}
              className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
            />
          </div>
        ) : fileType === 'application/pdf' ? (
          <iframe 
            src={previewUrl!} 
            className="w-full h-96 border-none rounded-lg shadow-md"
            title={doc.file_name}
          />
        ) : (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600 mb-3">Preview not available for this file type</p>
            {previewUrl && (
              <a 
                href={previewUrl} 
                download={doc.file_name || 'document'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C32A3] text-white font-bold rounded-lg hover:bg-[#4A2882] transition-colors text-sm"
              >
                <Download size={16} />
                Download File
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format document type names
const formatDocumentType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'passport_photo': 'Passport Photo',
    'national_id': 'National ID',
    'icpau_certificate': 'ICPAU Certificate',
    'cv': 'Curriculum Vitae (CV)',
    'recommendation_letter': 'Recommendation Letter',
    'proof_of_employment': 'Proof of Employment',
    'academic_certificate': 'Academic Certificate',
    'professional_certificate': 'Professional Certificate',
  };
  
  return typeMap[type] || type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

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

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplicationDetails();
    }
  }, [isOpen, applicationId]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }
      
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
                      <FileText size={18} /> Documents ({application.documents.length})
                    </h4>
                    <div className="space-y-4">
                      {application.documents.map((doc) => (
                        <DocumentPreview key={doc.id} doc={doc} />
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
            {application && !loading && (
              <div className="flex gap-3">
                {application.status.toLowerCase() === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleAction(onReject)} 
                      disabled={submitting} 
                      className="flex items-center gap-2 px-6 py-2 border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Reject'}
                    </button>
                    <button 
                      onClick={() => handleAction(onApprove)} 
                      disabled={submitting} 
                      className="flex items-center gap-2 px-6 py-2 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Approve'}
                    </button>
                  </>
                ) : application.status.toLowerCase() === 'approved' ? (
                  <>
                    <button 
                      onClick={() => handleAction(onReject)} 
                      disabled={submitting} 
                      className="flex items-center gap-2 px-6 py-2 border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Reject'}
                    </button>
                    {onRetry && (
                      <button 
                        onClick={() => handleAction(onRetry)} 
                        disabled={submitting} 
                        className="flex items-center gap-2 px-6 py-2 border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Reset to Pending'}
                      </button>
                    )}
                  </>
                ) : application.status.toLowerCase() === 'rejected' ? (
                  <>
                    <button 
                      onClick={() => handleAction(onApprove)} 
                      disabled={submitting} 
                      className="flex items-center gap-2 px-6 py-2 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Approve'}
                    </button>
                    {onRetry && (
                      <button 
                        onClick={() => handleAction(onRetry)} 
                        disabled={submitting} 
                        className="flex items-center gap-2 px-6 py-2 border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Reset to Pending'}
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;