import { useEffect, useState } from 'react';
import { X, User, Mail, Phone, Calendar, FileText, Download, Check, Loader2, RotateCcw } from 'lucide-react';

interface Application {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  qualification: string;
  institution: string;
  graduation_year: string;
  professional_body: string;
  membership_number: string;
  years_of_experience: string;
  current_employer: string;
  job_title: string;
  status: string;
  submitted_at: string;
  documents?: Array<{
    id: number;
    file_name: string;
    file_url: string;
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

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplicationDetails();
    }
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

  const handleAction = async (action?: (id: number) => Promise<void>) => {
    if (!action || !application) return;
    setSubmitting(true);
    try {
      await action(application.id);
      await fetchApplicationDetails(); // Refresh UI with new status
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
            <h3 className="text-xl font-semibold text-white">Application Details</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C32A3]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
            ) : application ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                  <span className="text-sm text-gray-500">Submitted: {formatDate(application.submitted_at)}</span>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="mr-2 text-[#5C32A3]" size={20} />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                      <p className="text-gray-900">{application.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                      <p className="text-gray-900 flex items-center gap-1"><Mail size={14}/> {application.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                      <p className="text-gray-900 flex items-center gap-1"><Phone size={14}/> {application.phone_number}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</label>
                      <p className="text-gray-900 flex items-center gap-1"><Calendar size={14}/> {formatDate(application.date_of_birth)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                      <p className="text-gray-900">{application.address}, {application.city}, {application.country} {application.postal_code}</p>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="mr-2 text-[#5C32A3]" size={20} />
                    Educational Background
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Qualification</label>
                      <p className="text-gray-900">{application.qualification}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Institution</label>
                      <p className="text-gray-900">{application.institution}</p>
                    </div>
                  </div>
                </div>

                {/* Professional */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Current Employer</label>
                      <p className="text-gray-900">{application.current_employer}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Job Title</label>
                      <p className="text-gray-900">{application.job_title}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {application.documents && application.documents.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Documents</h4>
                    <div className="space-y-2">
                      {application.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center">
                            <FileText size={20} className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.file_name}</p>
                              <p className="text-xs text-gray-500 uppercase">{doc.document_type}</p>
                            </div>
                          </div>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-[#5C32A3] hover:underline flex items-center gap-1 text-sm font-medium">
                            <Download size={16} /> Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Action Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Close
            </button>

            {application && !loading && (
              <div className="flex gap-3">
                {application.status.toLowerCase() === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(onReject)}
                      disabled={submitting}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(onApprove)}
                      disabled={submitting}
                      className="flex items-center gap-2 px-4 py-2 bg-[#5C32A3] text-white rounded-lg hover:bg-[#4A2882] disabled:opacity-50 shadow-sm"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                      Approve
                    </button>
                  </>
                )}
                {application.status.toLowerCase() === 'rejected' && (
                  <button
                    onClick={() => handleAction(onRetry)}
                    disabled={submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <RotateCcw size={18} />}
                    Reset to Pending
                  </button>
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