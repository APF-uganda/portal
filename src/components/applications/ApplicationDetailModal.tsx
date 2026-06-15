import React, { useEffect, useState } from 'react';
import { X, FileText, Loader2, Download, Trash2, Hash } from 'lucide-react';
import { getAccessToken } from '../../utils/authStorage';
import { API_BASE_URL } from '../../config/api';
import { fetchApplicationDetail, deleteApplication } from '../../services/applicationApi';
import axios from 'axios';

interface Application {
  id: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phoneNumber?: string;
  phone_number?: string;
  age_range?: string;
  address?: string;
  icpauCertificateNumber?: string;
  icpau_certificate_number?: string;
  organization?: string;
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
  onDeleted?: () => void;
}

const DocumentPreview: React.FC<{ doc: any }> = ({ doc }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  // Helper to normalize backend keys
  const fileName = doc.file_name || doc.name || 'Document';
  const docType = doc.document_type || doc.type || 'File';
  const rawPath = doc.file_url || doc.fileUrl || doc.file || doc.document;

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
    
    if (!rawPath) {
      setError("Path missing");
      setLoading(false);
      return;
    }

    try {
      const token = getAccessToken();
      let finalUrl = rawPath;
      
      if (!rawPath.startsWith('http')) {
        const cleanBase = API_BASE_URL.replace(/\/+$/, '');
        const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
        finalUrl = `${cleanBase}${cleanPath}`;
      }

      const response = await fetch(finalUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      setPreviewUrl(objectUrl);
      setFileType(blob.type || 'application/octet-stream');
    } catch (err) {
      setError("Load failed");
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
            <p className="text-sm font-semibold text-gray-700">{formatDocumentType(docType)}</p>
            <p className="text-xs text-gray-400">{fileName}</p>
          </div>
        </div>
        {previewUrl && (
          <a href={previewUrl} download={fileName} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Download size={16} className="text-gray-600" />
          </a>
        )}
      </div>
      
      <div className="p-4 bg-white min-h-[100px] flex items-center justify-center">
        {loading ? <Loader2 className="animate-spin text-gray-300" /> : 
         error ? <p className="text-xs text-red-500">{error}</p> :
         fileType?.startsWith('image/') ? <img src={previewUrl!} alt="preview" className="max-h-80 rounded" /> :
         fileType === 'application/pdf' ? <iframe src={previewUrl!} title="pdf-preview" className="w-full h-80 border-none" /> :
         <p className="text-xs text-gray-500">Preview unavailable. Please download to view.</p>}
      </div>
    </div>
  );
};



const formatDocumentType = (type: string) => {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  applicationId, isOpen, onClose, onApprove, onReject, onRetry, onDeleted
}) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // APF number assignment on approval
  const [showApfModal, setShowApfModal] = useState(false);
  const [apfInput, setApfInput] = useState('');
  const [apfError, setApfError] = useState('');

  useEffect(() => {
    if (isOpen) fetchDetails();
  }, [isOpen, applicationId]);

  const fetchDetails = async () => {
    setLoading(true);
    setActionError(null);
    setActionSuccess(null);
    setShowApfModal(false);
    try {
      const detail = await fetchApplicationDetail(applicationId);
      if (detail) {
        setApplication(detail as unknown as Application);
      } else {
        setApplication(null);
        setActionError("Failed to load application details.");
      }
    } catch (err) {
      console.error(err);
      setActionError("Failed to load application details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!onApprove) return;
    // Step 1 — show APF number modal
    if (!showApfModal) {
      setApfInput('');
      setApfError('');
      setShowApfModal(true);
      return;
    }
    // Should not reach here — submission is handled by handleApfSubmit
  };

  const handleApfSubmit = async () => {
    if (!onApprove) return;
    const value = apfInput.trim().toUpperCase();

    // APF number is optional but if provided must be valid format
    if (value && !/^APF\/M\/\d+$/.test(value)) {
      setApfError('Format must be APF/M/*** (e.g. APF/M/001). Leave blank to skip.');
      return;
    }
    setApfError('');
    setSubmitting(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      // 1. Approve the application first
      await onApprove(applicationId);

      // 2. If an APF number was entered, assign it to the newly created user
      if (value) {
        try {
          // Find the linked user via the application detail (re-fetch to get user id)
          const detail = await fetchApplicationDetail(applicationId);
          const userId = (detail as any)?.user;
          if (userId) {
            await axios.patch(
              `${API_BASE_URL}/api/v1/admin-management/members/${userId}/apf-number/`,
              { apf_membership_number: value },
              { headers: { Authorization: `Bearer ${getAccessToken()}`, 'Content-Type': 'application/json' } }
            );
          }
        } catch (apfErr) {
          // Non-fatal — approval succeeded, APF assignment failed
          console.warn('APF number assignment failed after approval:', apfErr);
          setActionSuccess(`Application approved. APF number could not be assigned automatically — please assign it manually from the Members page.`);
          setShowApfModal(false);
          setApplication((prev) => (prev ? { ...prev, status: 'approved' } : prev));
          return;
        }
      }

      setActionSuccess(value
        ? `Application approved and APF number ${value} assigned. Approval email sent.`
        : 'Application approved successfully. Approval email sent.'
      );
      setApplication((prev) => (prev ? { ...prev, status: 'approved' } : prev));
      setShowApfModal(false);
    } catch (error: any) {
      setActionError(error?.message || 'Failed to approve application.');
      setShowApfModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    setSubmitting(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await onReject(applicationId);
      setActionSuccess("Application rejected successfully.");
      setApplication((prev) => (prev ? { ...prev, status: "rejected" } : prev));
    } catch (error: any) {
      setActionError(error?.message || "Failed to reject application.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      const result = await deleteApplication(applicationId);
      if (result.success) {
        onDeleted?.();
        onClose();
      } else {
        setActionError(result.error || 'Failed to delete application.');
        setShowDeleteConfirm(false);
      }
    } catch {
      setActionError('Failed to delete application.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  const applicantName = `${application?.first_name || application?.firstName || ""} ${application?.last_name || application?.lastName || ""}`.trim();
  const applicantPhone = application?.phone_number || application?.phoneNumber || "N/A";
  const applicantCert = application?.icpau_certificate_number || application?.icpauCertificateNumber || "N/A";
  const applicantStatus = (application?.status || "").toLowerCase();

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
              {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}
              {actionSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {actionSuccess}
                </div>
              )}

              <section>
                <h4 className="text-[10px] font-semibold text-[#5C32A3] uppercase tracking-widest mb-4">Applicant Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl">
                  {[
                    { label: "Name", value: applicantName || "N/A" },
                    { label: "Email", value: application.email },
                    { label: "Phone", value: applicantPhone },
                    { label: "ICPA Cert.", value: applicantCert },
                    { label: "Organization", value: application.organization || "N/A" },
                    { label: "Address", value: application.address || "N/A" },
                    { label: "Status", value: applicantStatus ? applicantStatus.charAt(0).toUpperCase() + applicantStatus.slice(1) : "N/A" }
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
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600" disabled={submitting || deleting}>Cancel</button>
          <div className="flex gap-2">
            {/* Delete */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={submitting || deleting}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <span className="text-xs text-red-700 font-medium">Delete permanently?</span>
                <button onClick={handleDelete} disabled={deleting}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 disabled:opacity-50">
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting}
                  className="px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            )}

            {/* Reject */}
            <button
              onClick={handleReject}
              disabled={submitting || deleting || applicantStatus === 'approved' || applicantStatus === 'rejected'}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Reject'}
            </button>

            {/* Approve — opens APF modal */}
            <button
              onClick={handleApprove}
              disabled={submitting || deleting || applicantStatus === 'approved' || applicantStatus === 'rejected'}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 bg-[#5C32A3] hover:bg-[#4A2783]"
            >
              {submitting ? 'Processing...' : 'Approve'}
            </button>
          </div>
        </div>
      </div>

      {/* APF Number Modal — shown when admin clicks Approve */}
      {showApfModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Hash className="w-5 h-5 text-[#5E2590]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Assign APF Number</h3>
                <p className="text-xs text-gray-500">This will be included in the approval email</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                APF Membership Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={apfInput}
                onChange={(e) => { setApfInput(e.target.value.toUpperCase()); setApfError(''); }}
                placeholder="APF/M/001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">Format: APF/M/*** — leave blank to approve without a number</p>
              {apfError && <p className="text-xs text-red-600 mt-1">{apfError}</p>}
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => { setShowApfModal(false); setApfError(''); }}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleApfSubmit}
                disabled={submitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#5C32A3] rounded-lg hover:bg-[#4A2783] disabled:opacity-50"
              >
                {submitting ? 'Approving…' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailModal;
