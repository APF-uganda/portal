import { useEffect, useState } from 'react';
import { X, User,  Phone,  FileText, Eye, Check, Loader2, RotateCcw, Building2, CreditCard } from 'lucide-react';

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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
                {/* Status Indicator */}
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Submission Date</p>
                    <p className="text-sm text-gray-900">{formatDate(application.submitted_at)}</p>
                  </div>
                </div>

                {/* Personal Information */}
<div>
  <h4 className="text-lg font-semibold text-[#5C32A3] mb-3 flex items-center">
    <User className="mr-2" size={20} />
    Personal & Identification
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
      <p className="text-gray-900 font-medium">
        {application.firstName || (application as any).first_name} {application.lastName || (application as any).last_name}
      </p>
    </div>
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase">Age Range</label>
      <p className="text-gray-900">
        {/* Checks for age_range  */}
        {application.age_range || (application as any).ageRange || 'N/A'}
      </p>
    </div>
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase">National ID (NIN)</label>
      <p className="text-gray-900 flex items-center gap-1 font-mono">
        <CreditCard size={14}/> {application.nationalIdNumber || (application as any).national_id_number || 'Not Provided'}
      </p>
    </div>
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
      <p className="text-gray-900 flex items-center gap-1">
        <Phone size={14}/> {application.phoneNumber || (application as any).phone_number || 'N/A'}
      </p>
    </div>
    <div className="md:col-span-2">
      <label className="text-xs font-bold text-gray-400 uppercase">Residential Address</label>
      <p className="text-gray-900">
        {application.address || (application as any).residential_address || 'N/A'}
      </p>
    </div>
  </div>
</div>

{/* Professional Information */}
<div>
  <h4 className="text-lg font-semibold text-[#5C32A3] mb-3 flex items-center">
    <Building2 className="mr-2" size={20} />
    Professional Details
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase">ICPAU Certificate Number</label>
      <p className="text-gray-900 font-bold text-[#5C32A3]">
        {application.icpauCertificateNumber || (application as any).icpau_certificate_number || 'N/A'}
      </p>
    </div>
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase">Current Organization</label>
      <p className="text-gray-900">
        {application.organization || (application as any).employer_name || 'N/A'}
      </p>
    </div>
  </div>
</div>
                {/* Professional Information */}
                <div>
                  <h4 className="text-lg font-semibold text-[#5C32A3] mb-3 flex items-center">
                    <Building2 className="mr-2" size={20} />
                    Professional Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">ICPAU Certificate Number</label>
                      <p className="text-gray-900 font-bold text-[#5C32A3]">{application.icpauCertificateNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Current Organization</label>
                      <p className="text-gray-900">{application.organization}</p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                {application.documents && application.documents.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-[#5C32A3] mb-3 flex items-center">
                      <FileText className="mr-2" size={20} />
                      Attached Documents
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {application.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-[#5C32A3] transition-colors">
                          <div className="flex items-center">
                            <div className="bg-[#F4F2FE] p-2 rounded-lg mr-3 text-[#5C32A3]">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{doc.file_name}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{doc.document_type}</p>
                            </div>
                          </div>
                          
                          <a 
                            href={doc.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-xs font-bold text-[#5C32A3] bg-[#F4F2FE] px-3 py-1.5 rounded-lg hover:bg-[#5C32A3] hover:text-white transition-all"
                          >
                            <Eye size={14} /> View File
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t rounded-b-lg">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Close
            </button>

            {application && !loading && (
              <div className="flex gap-3">
                {application.status.toLowerCase() === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(onReject)}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(onApprove)}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2 bg-[#5C32A3] text-white font-bold rounded-xl hover:bg-[#4A2882] disabled:opacity-50 shadow-md transition-all active:scale-95"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                      Approve Member
                    </button>
                  </>
                )}
                {application.status.toLowerCase() === 'rejected' && (
                  <button
                    onClick={() => handleAction(onRetry)}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2 bg-[#F4F2FE] text-[#5C32A3] border-2 border-[#5C32A3] font-bold rounded-xl hover:bg-[#5C32A3] hover:text-white transition-all"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <RotateCcw size={18} />}
                    Reconsider Application
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