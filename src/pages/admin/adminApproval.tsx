import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import StatsCard from "../../components/dashboard/StatsCard";
import ApplicationsTable from "../../components/applications/ApplicationsTable";

import {
  MdPendingActions,
  MdCheckCircle,
  MdCancel,
  MdAttachMoney,
} from "react-icons/md";

const dummyApplications = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    category: "Full Member",
    icpaCertNo: "ICPA-U-12345",
    feeStatus: "Paid",
    status: "Pending",
    submissionDate: "2023-10-26",
  },
  {
    id: 2,
    name: "Robert Smith",
    email: "robert.smith@example.com",
    category: "Associate Member",
    icpaCertNo: "ICPA-U-67890",
    feeStatus: "Paid",
    status: "Approved",
    submissionDate: "2023-10-25",
  },
  {
    id: 3,
    name: "Emily White",
    email: "emily.white@example.com",
    category: "Student Member",
    icpaCertNo: "ICPA-U-11223",
    feeStatus: "Not Paid",
    status: "Pending",
    submissionDate: "2023-10-24",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david.lee@example.com",
    category: "Full Member",
    icpaCertNo: "ICPA-U-44556",
    feeStatus: "Paid",
    status: "Rejected",
    submissionDate: "2023-10-23",
  },
  {
    id: 5,
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    category: "Associate Member",
    icpaCertNo: "ICPA-U-77889",
    feeStatus: "Paid",
    status: "Pending",
    submissionDate: "2023-10-22",
  },
];

const AdminApprovals = () => {
  const applications = dummyApplications;
  const loading = false;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-0 overflow-y-auto">
        <Header />
        <div className="bg-[#F4F2FE] p-6 rounded-lg mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Pending Applications"
              value={3}
              change="12%"
              direction="up"
              icon={<MdPendingActions />}
            />
            <StatsCard
              title="Approved"
              value={1}
              change="5%"
              direction="up"
              icon={<MdCheckCircle />}
            />
            <StatsCard
              title="Rejected"
              value={1}
              change="8%"
              direction="down"
              icon={<MdCancel />}
            />
            <StatsCard
              title="Payment Received"
              value={4}
              change="15%"
              direction="up"
              icon={<MdAttachMoney />}
            />
          </div>
          <ApplicationsTable applicants={applications} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default AdminApprovals;