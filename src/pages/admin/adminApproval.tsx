import { useState } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import StatsCard from "../../components/dashboard/StatsCard";
import ApplicationsTable from "../../components/applications/ApplicationsTable";
import Footer from "../../components/layout/Footer";
import { useApplications } from "../../hooks/useApplications";
import { useAdminActions } from "../../hooks/useAdminActions";

import {
  MdPendingActions,
  MdCheckCircle,
  MdCancel,
  MdAttachMoney,
} from "react-icons/md";

const AdminApprovals = () => {
  const { applications, loading, error: fetchError, refetch } = useApplications();
  const { approve, reject, retry, error: actionError, clearError } = useAdminActions();
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pendingCount = applications.filter(
    (app) => app.status === "Pending"
  ).length;
  const approvedCount = applications.filter(
    (app) => app.status === "Approved"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;
  const paidCount = applications.filter((app) => app.feeStatus === "Paid").length;

  const handleApprove = async (applicationId: number) => {
    clearError();
    setSuccessMessage(null);
    setActionLoadingId(applicationId);
    
    try {
      const result = await approve(applicationId);
      if (result.success) {
        setSuccessMessage('Application approved successfully');
        await refetch();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to approve application:', error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (applicationId: number) => {
    clearError();
    setSuccessMessage(null);
    setActionLoadingId(applicationId);
    
    try {
      const result = await reject(applicationId);
      if (result.success) {
        setSuccessMessage('Application rejected successfully');
        await refetch();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to reject application:', error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRetry = async (applicationId: number) => {
    clearError();
    setSuccessMessage(null);
    setActionLoadingId(applicationId);
    
    try {
      const result = await retry(applicationId);
      if (result.success) {
        setSuccessMessage('Application reset to pending successfully');
        await refetch();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to reset application:', error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleView = (applicationId: number) => {
    // TODO: Implement view application details modal/page
    console.log('View application:', applicationId);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-0 overflow-y-auto">
        <Header title="Application Approval" />
        
        {/* Success/Error Messages */}
        {(successMessage || actionError || fetchError) && (
          <div className="mx-6 mt-4">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <span className="text-green-700">×</span>
                </button>
              </div>
            )}
            {actionError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{actionError}</span>
                <button
                  onClick={clearError}
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <span className="text-red-700">×</span>
                </button>
              </div>
            )}
            {fetchError && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{fetchError}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="bg-[#F4F2FE] p-6 rounded-lg mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Pending Applications"
              value={pendingCount}
              change=""
              direction="up"
              icon={<MdPendingActions />}
            />
            <StatsCard
              title="Approved"
              value={approvedCount}
              change=""
              direction="up"
              icon={<MdCheckCircle />}
            />
            <StatsCard
              title="Rejected"
              value={rejectedCount}
              change=""
              direction="down"
              icon={<MdCancel />}
            />
            <StatsCard
              title="Payment Received"
              value={paidCount}
              change=""
              direction="up"
              icon={<MdAttachMoney />}
            />
          </div>
          <ApplicationsTable
            applicants={applications}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
            onRetry={handleRetry}
            onView={handleView}
            actionLoading={actionLoadingId}
          />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AdminApprovals;