import { useState, useEffect } from 'react';
import { X, FileText, Loader2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { userManagementApi } from '../../services/manageuser';
import { getAccessToken } from '../../utils/authStorage';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadedDate: string;
  adminFeedback?: string;
  fileUrl?: string;
}

interface MemberDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const DocumentPreview: React.FC<{ doc: Document }> = ({ doc }) => {
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
    
    if (!doc.fileUrl) {
      setError("Path missing");
      setLoading(false);
      return;
    }

    try {
      const token = getAccessToken();
      const response = await fetch(doc.fileUrl, {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileText className="text-[#5C32A3] flex-shrink-0" size={18} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-700 truncate">{doc.type}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(doc.status)}`}>
                {doc.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate">{doc.name}</p>
          </div>
        </div>
        {previewUrl && (
          <a href={previewUrl} download={doc.name} className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
            <Download size={16} className="text-gray-600" />
          </a>
        )}
      </div>
      
      <div className="p-4 bg-white min-h-[400px] flex items-center justify-center">
        {loading ? (
          <Loader2 className="animate-spin text-gray-300" />
        ) : error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : fileType?.startsWith('image/') ? (
          <img src={previewUrl!} alt="preview" className="max-w-full max-h-[500px] rounded object-contain" />
        ) : fileType === 'application/pdf' ? (
          <iframe src={previewUrl!} title="pdf-preview" className="w-full h-[500px] border-none rounded" />
        ) : (
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-4">Preview unavailable. Please download to view.</p>
            <a 
              href={previewUrl!} 
              download={doc.name}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C32A3] text-white rounded-lg hover:bg-[#4A2783] transition-colors"
            >
              <Download size={16} />
              Download File
            </a>
          </div>
        )}
      </div>

      {doc.adminFeedback && (
        <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
          <p className="text-[9px] uppercase text-blue-600 font-semibold mb-1">Previous Feedback</p>
          <p className="text-sm text-blue-900">{doc.adminFeedback}</p>
        </div>
      )}
    </div>
  );
};

const MemberDocumentsModal = ({ isOpen, onClose, userId, userName }: MemberDocumentsModalProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchDocuments();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (documents.length > 0) {
      setSelectedDocIndex(0);
      setFeedback(documents[0]?.adminFeedback || '');
    }
  }, [documents]);

  useEffect(() => {
    const currentDoc = documents[selectedDocIndex];
    if (currentDoc) {
      setFeedback(currentDoc.adminFeedback || '');
    }
  }, [selectedDocIndex, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionSuccess(null);
      setActionError(null);
      const data = await userManagementApi.fetchMemberDocuments(userId);
      setDocuments(data.documents || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (docId: string, status: string) => {
    try {
      setUpdating(true);
      setActionError(null);
      setActionSuccess(null);
      await userManagementApi.updateDocumentStatus(docId, status, feedback);
      setActionSuccess(`Document ${status} successfully.`);
      await fetchDocuments();
      setFeedback('');
    } catch (err: any) {
      setActionError(err.response?.data?.error?.message || 'Failed to update document status');
    } finally {
      setUpdating(false);
    }
  };

  const handleNextDocument = () => {
    if (selectedDocIndex < documents.length - 1) {
      setSelectedDocIndex(selectedDocIndex + 1);
    }
  };

  const handlePreviousDocument = () => {
    if (selectedDocIndex > 0) {
      setSelectedDocIndex(selectedDocIndex - 1);
    }
  };

  if (!isOpen) return null;

  const currentDoc = documents[selectedDocIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Member Documents</h2>
            <p className="text-sm text-gray-500">{userName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-[#5C32A3]" size={32} />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No documents uploaded yet</p>
            </div>
          ) : (
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

              {/* Document Navigation */}
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-semibold text-[#5C32A3] uppercase tracking-widest">
                  Document {selectedDocIndex + 1} of {documents.length}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousDocument}
                    disabled={selectedDocIndex === 0}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextDocument}
                    disabled={selectedDocIndex === documents.length - 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Document Preview */}
              {currentDoc && <DocumentPreview doc={currentDoc} />}

              {/* Admin Feedback Section */}
              <section>
                <h4 className="text-[10px] font-semibold text-[#5C32A3] uppercase tracking-widest mb-3">Admin Feedback</h4>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add feedback or reason for approval/rejection..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#5C32A3] focus:border-transparent"
                  rows={3}
                />
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-between">
          <button 
            onClick={onClose} 
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors" 
            disabled={updating}
          >
            Close
          </button>
          {currentDoc && currentDoc.status.toLowerCase() === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateStatus(currentDoc.id, 'rejected')}
                disabled={updating}
                className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updating ? "Processing..." : "Reject"}
              </button>
              <button
                onClick={() => handleUpdateStatus(currentDoc.id, 'approved')}
                disabled={updating}
                className="px-6 py-2 bg-[#5C32A3] text-white rounded-lg text-sm font-medium hover:bg-[#4A2783] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updating ? "Processing..." : "Approve"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDocumentsModal;
