import Sidebar from "../../components/common/adminSideNav";

const AdminDashboard = () => {
  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        </main>
    </div>
  );
};

export default AdminDashboard;
