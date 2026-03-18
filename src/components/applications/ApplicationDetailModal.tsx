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
      setError("No file path found");
      setLoading(false);
      return;
    }

    try {
      const token = getAccessToken();
      let finalUrl = path;
      if (!path.startsWith('http')) {
        const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        finalUrl = `${cleanBase}${cleanPath}`;
      }

      const response = await fetch(finalUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        setError(response.status === 404 ? "File not found" : `Error: ${response.status}`);
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
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm font-montserrat">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-[#5C32A3]" size={20} />
          <div>
            <p className="text-sm font-bold text-gray-800">{formatDocumentType(doc.document_type)}</p>
            <p className="text-xs text-gray-500">{doc.file_name}</p>
          </div>
        </div>
        {previewUrl && (
          <a href={previewUrl} download={doc.file_name} className="flex items-center gap-1 text-xs font-bold text-[#5C32A3] bg-white px-3 py-1.5 rounded-lg hover:bg-[#5C32A3] hover:text-white transition-all border">
            <Download size={14} /> Download
          </a>
        )}
      </div>
      <div className="p-4 bg-gray-50 flex justify-center">
        {loading ? <Loader2 className="animate-spin text-[#5C32A3] py-12" size={32} /> : 
         error ? <p className="text-sm text-red-600 py-8">{error}</p> : 
         fileType?.startsWith('image/') ? <img src={previewUrl!} className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-md" alt="" /> :
         fileType === 'application/pdf' ? <iframe src={previewUrl!} className="w-full h-96 border-none rounded-lg shadow-md" title="pdf" /> :
         <p className="text-sm text-gray-600">Preview not available</p>}
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
  return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ applicationId, isOpen, onClose, onApprove, onReject, onRetry }) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (isOpen && applicationId) fetchApplicationDetails(); }, [isOpen, applicationId]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/applications/${applicationId}/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch details');
      setApplication(await response.json());
    } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred'); }
    finally { setLoading(false); }
  };

  const handleAction = async (action?: (id: number) => Promise<void>) => {
    if (!action || !application) return;
    setSubmitting(true);
    try { await action(application.id); await fetchApplicationDetails(); }
    catch (err) { alert("Action failed."); }
    finally { setSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-montserrat">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          
          <div className="bg-[#5C32A3] px-6 py-4 flex justify-between items-center text-white">
            <h3 className="text-xl font-bold uppercase tracking-tight">Application Details</h3>
            <button onClick={onClose} className="hover:text-gray-200"><X size={24} /></button>
          </div>

          <div className="bg-white px-6 py-6 max-h-[70vh] overflow-y-auto">
            {loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#5C32A3]" size={40} /></div> :
             error ? <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div> :
             application ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    application.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700' : 
                    application.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{application.status}</span>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Received</p>
                    <p className="text-sm font-bold text-gray-800">{new Date(application.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                   {[
                     { label: 'Name', val: `${application.firstName || ''} ${application.lastName || ''}` },
                     { label: 'Email', val: application.email },
                     { label: 'Phone', val: application.phoneNumber || (application as any).phone_number },
                     { label: 'Age Range', val: application.age_range },
                     { label: 'ICPAU No.', val: application.icpauCertificateNumber || (application as any).icpau_certificate_number },
                     { label: 'Organization', val: application.organization || (application as any).employer_name }
                   ].map((item, i) => (
                     <div key={i}>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{item.label}</label>
                       <p className="text-sm font-bold text-gray-800">{item.val || 'N/A'}</p>
                     </div>
                   ))}
                </div>

                {application.documents && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#5C32A3] uppercase tracking-widest flex items-center gap-2"><FileText size={16}/> Documents</h4>
                    {application.documents.map(doc => <DocumentPreview key={doc.id} doc={doc} />)}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="bg-gray-50 px-6 py-5 flex justify-between items-center border-t">
            <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">Close</button>
            
            {application && !loading && (
              <div className="flex gap-3">
                {/* 1. PENDING STATE: Show Approve and Reject */}
                {application.status.toLowerCase() === 'pending' && (
                  <>
                    <button onClick={() => handleAction(onReject)} disabled={submitting} className="px-6 py-2.5 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 text-xs uppercase tracking-widest disabled:opacity-50">
                      {submitting ? '...' : 'Reject'}
                    </button>
                    <button onClick={() => handleAction(onApprove)} disabled={submitting} className="px-6 py-2.5 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] text-xs uppercase tracking-widest shadow-lg shadow-purple-100">
                      {submitting ? '...' : 'Approve'}
                    </button>
                  </>
                )}

                {/* 2. APPROVED STATE: REJECT IS HIDDEN */}
                {application.status.toLowerCase() === 'approved' && (
                  <>
                    {onRetry && (
                      <button onClick={() => handleAction(onRetry)} disabled={submitting} className="px-6 py-2.5 border-2 border-blue-100 text-blue-600 font-bold rounded-xl hover:bg-blue-50 text-xs uppercase tracking-widest">
                        Reset to Pending
                      </button>
                    )}
                    <span className="flex items-center text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-4 rounded-xl">Verified</span>
                  </>
                )}

                {/* 3. REJECTED STATE: Show Approve and Reset */}
                {application.status.toLowerCase() === 'rejected' && (
                  <>
                    <button onClick={() => handleAction(onApprove)} disabled={submitting} className="px-6 py-2.5 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] text-xs uppercase tracking-widest">
                      Approve
                    </button>
                    {onRetry && (
                      <button onClick={() => handleAction(onRetry)} disabled={submitting} className="px-6 py-2.5 border-2 border-blue-100 text-blue-600 font-bold rounded-xl hover:bg-blue-50 text-xs uppercase tracking-widest">
                        Reset to Pending
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;