import { FC } from "react";
import {
    FiEye,
    FiCheck,
    FiX,
    FiDownload,
    FiPlus,
    FiRotateCcw,
} from "react-icons/fi";

export interface Application {
    id: number;
    name: string;
    email: string;
    category: string;
    icpaCertNo: string;
    feeStatus: string;
    status: string;
    submissionDate: string;
}

interface ApplicationsTableProps {
    applicants: Application[];
    loading: boolean;
}

const ApplicationsTable: FC<ApplicationsTableProps> = ({ applicants, loading }) => {
    if (loading) {
        return <p className="text-gray-500">Loading applications...</p>;
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
                                            <button className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs">
                                                <FiEye />
                                            </button>
                                            <button className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs">
                                                <FiCheck />
                                            </button>
                                            <button className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs">
                                                <FiX />
                                            </button>
                                        </>
                                    )}
                                    {app.status === "Approved" && (
                                        <>
                                            <button className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs">
                                                <FiEye />
                                            </button>
                                            <button className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs">
                                                <FiDownload />
                                            </button>
                                        </>
                                    )}
                                    {app.status === "Rejected" && (
                                        <>
                                            <button className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs">
                                                <FiEye />
                                            </button>
                                            <button className="bg-transparent border-2 border-gray-200 hover:bg-gray-200 text-gray-900 px-2 py-1 rounded text-xs">
                                                <FiRotateCcw />
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