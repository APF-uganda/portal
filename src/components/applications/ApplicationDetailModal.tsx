import React, { useEffect, useState } from 'react';
import { X, User, FileText, Loader2, Download } from 'lucide-react';
import { getAccessToken } from '../../utils/authStorage';
import { API_BASE_URL } from '../../config/api';

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age_range: string;
  address: string;
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
      
      // Robust URL Construction
      let finalUrl = path;
      if (!path.startsWith('http')) {
        const baseUrl = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
        const cleanPath = path.startsWith('/') ? path : `/${path}`; // Ensure leading slash
        finalUrl = `${baseUrl}${cleanPath}`;
      }

      const response = await fetch(finalUrl, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const blob = await response.blob();
      const type = blob.type || 'application/octet-stream';
      const objectUrl = URL.createObjectURL(blob);
      
      setPreviewUrl(objectUrl);
      setFileType(type);
      setLoading(false);
    } catch (err) {
      console.error("Document Load Error:", err);
      setError("Document could not be opened");
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm font-sans">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-black" size={20} />
          <div>
            <p className="text-sm font-bold text-black">{formatDocumentType(doc.document_type)}</p>
            <p className="text-xs text-gray-500">{doc.file_name}</p>
          </div>
        </div>
        {previewUrl && (
          <a 
            href={previewUrl} 
            download={doc.file_name || 'document'} 
            className="flex items-center gap-1 text-xs font-bold text-black bg-white px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all border border-gray-300"
          >
            <Download size={14} />
            Download
          </a>
        )}
      </div>
      
      <div className="p-4 bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-black" size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-black font-medium">{error}</p>
          </div>
        ) : fileType?.startsWith('image/') ? (
          <div className="flex justify-center">
            <img 
              src={previewUrl!} 
              alt={doc.file_name}
              className="max-w-full h-auto max-h-[500px] object-contain rounded shadow-sm border border-gray-100"
            />
          </div>
        ) : fileType === 'application/pdf' ? (
          <iframe 
            src={previewUrl!} 
            className="w-full h-[500px] border rounded shadow-inner"
            title={doc.file_name}
          />
        ) : (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-black mb-3 font-medium">Preview not supported for this file type</p>
            <a 
              href={previewUrl!} 
              download={doc.file_name || 'document'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-bold rounded-lg text-sm"
            >
              <Download size={16} />
              Download to View
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const formatDocumentType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'icpau_certificate': 'ICPAU Certificate',
    'firm_license': 'Firm License',
    'proof_of_payment': 'Proof of Payment',
    'passport_photo': 'Passport Photo',
    'cv': 'Curriculum Vitae (CV)',
    'recommendation_letter': 'Recommendation Letter',
    'proof_of_employment': 'Proof of Employment',
    'academic_certificate': 'Academic Certificate',
    'professional_certificate': 'Professional Certificate',
  };
  return typeMap[type] || type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
      const response = await fetch(`${API_BASE_URL}/api/v1/applications/${applicationId}/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch details');
      setApplication(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action?: (id: number) => Promise<void>) => {
    if (!action || !application) return;
    const confirmAction = window.confirm("Are you sure you want to perform this action?");
    if (!confirmAction) return;
    
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans text-black">
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 sm:items-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-60" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-t-2xl sm:rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full w-full">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-black text-black uppercase tracking-tight">Application Details</h3>
            <button onClick={onClose} className="text-black hover:bg-gray-100 p-1 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white px-4 sm:px-6 py-6 max-h-[75vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="animate-spin text-black" size={40} />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-bold text-sm">{error}</div>
            ) : application ? (
              <div className="space-y-8">
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                  <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-gray-100 border border-gray-200">
                    Status: {application.status}
                  </span>
                  <div className="sm:text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Submitted On</p>
                    <p className="text-sm font-bold text-black">{new Date(application.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-xs font-black text-black mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <User size={16} /> Profile Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    {[
                      { label: "Full Name", value: `${application.firstName || (application as any).first_name} ${application.lastName || (application as any).last_name}` },
                      { label: "Email Address", value: application.email },
                      { label: "Phone Number", value: application.phoneNumber || (application as any).phone_number },
                      { label: "Age Group", value: application.age_range },
                      { label: "Physical Address", value: application.address },
                      { label: "ICPAU Cert No.", value: application.icpauCertificateNumber || (application as any).icpau_certificate_number },
                      { label: "Organization", value: application.organization || (application as any).employer_name }
                    ].map((info, idx) => (
                      <div key={idx} className="border-b border-gray-200 sm:border-none pb-2 sm:pb-0">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{info.label}</label>
                        <p className="text-sm font-bold text-black break-words">{info.value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents Section */}
                {application.documents && application.documents.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-black mb-4 flex items-center gap-2 uppercase tracking-widest">
                      <FileText size={16} /> Attachments ({application.documents.length})
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

          {/* Action Buttons - Mobile Responsive Grid */}
          <div className="bg-gray-50 px-4 sm:px-6 py-5 border-t">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-4">
              <button 
                onClick={onClose} 
                className="px-6 py-3 bg-white border border-gray-300 text-black font-bold rounded-xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
              >
                Close
              </button>
              
              {application && !loading && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {application.status.toLowerCase() === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleAction(onReject)} 
                        disabled={submitting} 
                        className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 text-xs uppercase tracking-widest disabled:opacity-50 transition-all shadow-sm"
                      >
                        {submitting ? 'Processing...' : 'Reject'}
                      </button>
                      <button 
                        onClick={() => handleAction(onApprove)} 
                        disabled={submitting} 
                        className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 text-xs uppercase tracking-widest shadow-lg transition-all"
                      >
                        {submitting ? 'Processing...' : 'Approve'}
                      </button>
                    </>
                  )}

                  {(application.status.toLowerCase() === 'approved' || application.status.toLowerCase() === 'rejected') && onRetry && (
                    <button 
                      onClick={() => handleAction(onRetry)} 
                      disabled={submitting} 
                      className="px-6 py-3 bg-white border border-gray-300 text-black font-bold rounded-xl hover:bg-gray-100 text-xs uppercase tracking-widest transition-all"
                    >
                      Reset to Pending
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;