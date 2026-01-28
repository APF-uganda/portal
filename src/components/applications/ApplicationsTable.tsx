import { FC, useState } from "react";
import {
    FiEye,
    FiCheck,
    FiX,
    FiDownload,
    FiPlus,
    FiRotateCcw,
    FiLoader,
} from "react-icons/fi";
import { Application } from "../../types/Application";

interface ApplicationsTableProps {
    applicants: Application[];
    loading: boolean;
    onApprove?: (applicationId: number) => Promise<void>;
    onReject?: (applicationId: number) => Promise<void>;
    onRetry?: (applicationId: number) => Promise<void>;
    onView?: (applicationId: number) => void;
    actionLoading?: number | null; // ID of application currently being processed
}

const ApplicationsTable: FC<ApplicationsTableProps> = ({
    applicants,
    loading,
    onApprove,
    onReject,
    onRetry,
    onView,
    actionLoading = null,
}) => {
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleAction = async (
        applicationId: number,
        action: () => Promise<void>
    ) => {
        if (processingId || actionLoading === applicationId) return;
        
        setProcessingId(applicationId);
        try {
            await action();
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleApprove = (applicationId: number) => {
        if (onApprove) {
            handleAction(applicationId, () => onApprove(applicationId));
        }
    };

    const handleReject = (applicationId: number) => {
        if (onReject) {
            handleAction(applicationId, () => onReject(applicationId));
        }
    };

    const handleRetry = (applicationId: number) => {
        if (onRetry) {
            handleAction(applicationId, () => onRetry(applicationId));
        }
    };

    const handleView = (applicationId: number) => {
        if (onView) {
            onView(applicationId);
        }
    };

    const isProcessing = (applicationId: number) => {
        return processingId === applicationId || actionLoading === applicationId;
    };

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-center py-8">
                    <FiLoader className="animate-spin text-[#5F2F8B] text-2xl mr-2" />
                    <p className="text-gray-500">Loading applications...</p>
                </div>
            </div>
        );
    }

    if (applicants.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500 text-center py-8">No applications found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 ">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">All Applications</h3>
                <div className="flex gap-3">
                    <button className="flex items-center bg-transparent border-2 border-[#5F2F8B] gap-1 text-sm text-[#5F2F8B] hover:text-white hover:bg-[#5F2F8B] rounded-xl px-3 py-1 pl-2 pr-4">
                        <FiDownload className="text-base" />
                        Export
                    </button>
                    <button className="flex items-center gap-1 text-sm text-white bg-[#5F2F8B] hover:bg-purple-800 px-3 py-1 pl-2 pr-4 rounded-xl">
                        <FiPlus className="text-base" />
                        New Application
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left text-gray-600 border border-[#F4F2FE] rounded-xl">
                <thead className="bg-[#F4F2FE] text-gray-700 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2 border-b">Applicant Name</th>
                        <th className="px-4 py-2 border-b">Email Address</th>
                        <th className="px-4 py-2 border-b">Category</th>
                        <th className="px-4 py-2 border-b">ICPA Cert. No.</th>
                        <th className="px-4 py-2 border-b">Fee Status</th>
                        <th className="px-4 py-2 border-b">Application Status</th>
                        <th className="px-4 py-2 border-b">Submission Date</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.map((app) => (
                        <tr key={app.id} className="border-b last:border-none hover:bg-gray-50">
                            <td className="px-4 py-2 font-bold">{app.name}</td>
                            <td className="px-4 py-2 font-medium">{app.email}</td>
                            <td className="px-4 py-2 font-medium">{app.category}</td>
                            <td className="px-4 py-2 font-medium">{app.icpaCertNo}</td>
                            <td className="px-4 py-2 text-sm font-medium">
                                {app.feeStatus === "Paid" ? (
                                    <span className="text-[#0FB880] font-bold">Paid</span>
                                ) : (
                                    <span className="text-[#EE4444] font-bold">Not Paid</span>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        app.status === "Pending"
                                            ? "bg-[#E5E0FE] text-[#5F2F8B]"
                                            : app.status === "Approved"
                                            ? "bg-[#D3F0E6] text-[#0FB880]"
                                            : "bg-[#E5E0FE] text-[#EE4444]"
                                    }`}
                                >
                                    {app.status}
                                </span>
                            </td>
                            <td className="px-4 py-2 font-medium">{app.submissionDate}</td>
                            <td className="px-4 py-2">
                                <div className="flex gap-2">
                                    {app.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => handleView(app.id)}
                                                className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs transition-colors"
                                                title="View Details"
                                                disabled={isProcessing(app.id)}
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(app.id)}
                                                disabled={isProcessing(app.id)}
                                                className={`bg-transparent border-2 border-green-200 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs transition-colors ${
                                                    isProcessing(app.id) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                title="Approve Application"
                                            >
                                                {isProcessing(app.id) ? (
                                                    <FiLoader className="animate-spin" />
                                                ) : (
                                                    <FiCheck />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleReject(app.id)}
                                                disabled={isProcessing(app.id)}
                                                className={`bg-transparent border-2 border-red-200 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs transition-colors ${
                                                    isProcessing(app.id) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                title="Reject Application"
                                            >
                                                {isProcessing(app.id) ? (
                                                    <FiLoader className="animate-spin" />
                                                ) : (
                                                    <FiX />
                                                )}
                                            </button>
                                        </>
                                    )}
                                    {app.status === "Approved" && (
                                        <>
                                            <button
                                                onClick={() => handleView(app.id)}
                                                className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs transition-colors"
                                                title="Download Documents"
                                            >
                                                <FiDownload />
                                            </button>
                                        </>
                                    )}
                                    {app.status === "Rejected" && (
                                        <>
                                            <button
                                                onClick={() => handleView(app.id)}
                                                className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => handleRetry(app.id)}
                                                disabled={isProcessing(app.id)}
                                                className={`bg-transparent border-2 border-blue-200 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs transition-colors ${
                                                    isProcessing(app.id) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                title="Reset to Pending"
                                            >
                                                {isProcessing(app.id) ? (
                                                    <FiLoader className="animate-spin" />
                                                ) : (
                                                    <FiRotateCcw />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationsTable;