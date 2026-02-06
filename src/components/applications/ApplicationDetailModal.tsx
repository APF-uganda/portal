import { FC, useEffect, useState } from "react";
import { FiX, FiLoader, FiDownload, FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiFileText } from "react-icons/fi";
import { ApplicationDetail, fetchApplicationDetail } from "../../services/applicationApi";

interface ApplicationDetailModalProps {
  applicationId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationDetailModal: FC<ApplicationDetailModalProps> = ({
  applicationId,
  isOpen,
  onClose,
}) => {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && applicationId) {
      loadApplicationDetail();
    }
  }, [isOpen, applicationId]);

  const loadApplicationDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchApplicationDetail(applicationId);
      if (data) {
        setApplication(data);
      } else {
        setError("Application not found");
      }
    } catch (err) {
      setError("Failed to load application details");
      console.error("Error fetching application detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return 'bg-green-100 text-green-800';
    if (statusLower === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'success' || statusLower === 'completed') return 'text-green-600';
    if (statusLower === 'failed') return 'text-red-600';
    if (statusLower === 'pending') return 'text-yellow-600';
    return 'text-gray-600';
  };

  const formatPaymentMethod = (method: string) => {
    if (method === 'mtn') return 'MTN Mobile Money';
    if (method === 'airtel') return 'Airtel Money';
    if (method === 'credit_card') return 'Credit Card';
    return method;
  };

  const handleDownloadDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="animate-spin text-[#5F2F8B] text-3xl mr-3" />
              <p className="text-gray-500">Loading application details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && application && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                  {application.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  Submitted: {formatDate(application.submitted_at)}
                </span>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUser className="text-[#5F2F8B]" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{application.first_name} {application.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Username</label>
                    <p className="text-gray-900">{application.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <FiMail className="text-sm" />
                      Email
                    </label>
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <FiPhone className="text-sm" />
                      Phone Number
                    </label>
                    <p className="text-gray-900">{application.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age Range</label>
                    <p className="text-gray-900">{application.age_range}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">National ID</label>
                    <p className="text-gray-900">{application.national_id_number || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <FiMapPin className="text-sm" />
                      Address
                    </label>
                    <p className="text-gray-900">{application.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ICPAU Certificate Number</label>
                    <p className="text-gray-900">{application.icpau_certificate_number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-[#5F2F8B]" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Method</label>
                    <p className="text-gray-900">{formatPaymentMethod(application.payment_method)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Status</label>
                    <p className={`font-semibold ${getPaymentStatusColor(application.payment_status)}`}>
                      {application.payment_status.toUpperCase()}
                    </p>
                  </div>
                  {application.payment_phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Payment Phone</label>
                      <p className="text-gray-900">{application.payment_phone}</p>
                    </div>
                  )}
                  {application.payment_card_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Card Number</label>
                      <p className="text-gray-900">**** **** **** {application.payment_card_number.slice(-4)}</p>
                    </div>
                  )}
                  {application.payment_cardholder_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cardholder Name</label>
                      <p className="text-gray-900">{application.payment_cardholder_name}</p>
                    </div>
                  )}
                  {application.payment_transaction_reference && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Transaction Reference</label>
                      <p className="text-gray-900 font-mono text-sm">{application.payment_transaction_reference}</p>
                    </div>
                  )}
                  {application.payment_error_message && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-red-600">Payment Error</label>
                      <p className="text-red-700 text-sm">{application.payment_error_message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              {application.documents && application.documents.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiFileText className="text-[#5F2F8B]" />
                    Uploaded Documents
                  </h3>
                  <div className="space-y-2">
                    {application.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                      >
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{doc.file_name}</p>
                          <p className="text-sm text-gray-500">
                            {doc.document_type && `${doc.document_type} • `}
                            {(doc.file_size / 1024).toFixed(2)} KB • 
                            Uploaded: {formatDate(doc.uploaded_at)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownloadDocument(doc.file, doc.file_name)}
                          className="ml-4 text-[#5F2F8B] hover:text-purple-800 transition-colors"
                          title="Download Document"
                        >
                          <FiDownload className="text-xl" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Application ID</label>
                    <p className="text-gray-900 font-mono">#{application.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-gray-900">{formatDate(application.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
