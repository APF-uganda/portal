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
      setError("Document path missing");
      setLoading(false);
      return;
    }

    try {
      const token = getAccessToken();
      if (!token) throw new Error("Auth token missing");

      // Fix URL construction to avoid double slashes
      let finalUrl = path;
      if (!path.startsWith('http')) {
        const cleanBase = API_BASE_URL.replace(/\/+$/, '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        finalUrl = `${cleanBase}${cleanPath}`;
      }

      const response = await fetch(finalUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      setPreviewUrl(objectUrl);
      setFileType(blob.type || 'application/octet-stream');
    } catch (err) {
      console.error("Preview fail:", err);
      setError("Could not load file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-[#5C32A3]" size={18} />
          <div>
            <p className="text-sm font-semibold text-gray-700">{formatDocumentType(doc.document_type)}</p>
            <p className="text-xs text-gray-400">{doc.file_name}</p>
          </div>
        </div>
        {previewUrl && (
          <a href={previewUrl} download={doc.file_name} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Download size={16} className="text-gray-600" />
          </a>
        )}
      </div>
      
      <div className="p-4 bg-white min-h-[100px] flex items-center justify-center">
        {loading ? <Loader2 className="animate-spin text-gray-300" /> : 
         error ? <p className="text-xs text-red-500">{error}</p> :
         fileType?.startsWith('image/') ? <img src={previewUrl!} className="max-h-80 rounded" /> :
         fileType === 'application/pdf' ? <iframe src={previewUrl!} className="w-full h-80 border-none" /> :
         <p className="text-xs text-gray-500">Preview unavailable. Please download.</p>}
      </div>
    </div>
  );
};

const formatDocumentType = (type: string) => {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  applicationId, isOpen, onClose, onApprove, onReject, onRetry
}) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) fetchDetails();
  }, [isOpen, applicationId]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/applications/${applicationId}/`, {
        headers: { 'Authorization': `Bearer ${getAccessToken()}` }
      });
      setApplication(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Application Review</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin" /></div> : 
           application && (
            <>
              <section>
                <h4 className="text-[10px] font-semibold text-[#5C32A3] uppercase tracking-widest mb-4">Applicant Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl">
                  {[
                    { label: "Name", value: `${application.firstName} ${application.lastName}` },
                    { label: "Email", value: application.email },
                    { label: "Phone", value: application.phoneNumber },
                    { label: "Organization", value: application.organization },
                    { label: "Address", value: application.address }
                  ].map((item, i) => (
                    <div key={i}>
                      <span className="text-[9px] uppercase text-gray-400 block mb-0.5">{item.label}</span>
                      <span className="text-sm text-gray-700">{item.value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-semibold text-[#5C32A3] uppercase tracking-widest mb-4">Submitted Documents</h4>
                <div className="space-y-4">
                  {application.documents?.map(doc => <DocumentPreview key={doc.id} doc={doc} />)}
                </div>
              </section>
            </>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600">Cancel</button>
          <div className="flex gap-2">
            <button onClick={() => onReject?.(applicationId)} className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium">Reject</button>
            <button onClick={() => onApprove?.(applicationId)} className="px-6 py-2 bg-[#5C32A3] text-white rounded-lg text-sm font-medium">Approve Application</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;