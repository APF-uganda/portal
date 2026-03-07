import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/manageusers-components/stats';
import MemberDocumentsModal from '../../components/manageusers-components/MemberDocumentsModal';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


import { useUserManagement } from '../../hooks/userMgt';

const ManageUsers = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Use the hook to get data, loading state, and action handlers
  const { users, loading, error, handleToggleStatus } = useUserManagement();

  const totalPages = Math.max(1, Math.ceil(users.length / rowsPerPage));
  const clampedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (clampedPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, users.length);

  const paginatedUsers = useMemo(() => users.slice(startIndex, endIndex), [users, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  useEffect(() => {
    if (currentPage !== clampedPage) {
      setCurrentPage(clampedPage);
    }
  }, [currentPage, clampedPage]);

  return (
    <div className="flex min-h-screen">
      {/* Side Navigation */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} h-screen overflow-hidden flex flex-col w-full`}>
        
        {/* Header Component */}
        <Header title="User Management" />

        {/* Main Content Area */}
        <div className="flex-1 bg-[#F4F2FE] py-6 space-y-10 overflow-y-auto">
          <div className="w-full space-y-10 px-6">
            
            {/* Title Section */}
            <div>
              <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Manage Members</h1>
              <p className="text-slate-500 mt-1">Review member status, handle renewals, and manage account access.</p>
            </div>

            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Users" value={users.length} color="border-blue-500" />
              <StatCard title="Pending Renewals" value={users.filter(u => u.status === 'Pending').length} color="border-yellow-500" />
              <StatCard title="Expired Users" value={users.filter(u => u.status === 'Expired').length} color="border-red-500" />
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 border-b border-gray-100">Member Name</th>
                      <th className="px-6 py-4 border-b border-gray-100">Email</th>
                      <th className="px-6 py-4 border-b border-gray-100">Status</th>
                      <th className="px-6 py-4 border-b border-gray-100">Renewal Date</th>
                      <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr>
                         <td colSpan={5} className="text-center py-12">
                           <div className="flex flex-col items-center space-y-2">
                             <div className="w-6 h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
                             <span className="text-gray-400 text-sm font-medium">Loading user data...</span>
                           </div>
                         </td>
                       </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400 font-medium">
                          No users found in the system.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
                              ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                user.status === 'Suspended' ? 'bg-orange-100 text-orange-700' : 
                                user.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.renewalDate || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Documents Button */}
                              <button 
                                onClick={() => setSelectedMember({ id: user.id, name: user.name })}
                                className="font-bold transition-colors whitespace-nowrap text-sm px-4 py-2 rounded-lg hover:bg-purple-50 text-[#5E2590]"
                              >
                                View Documents
                              </button>
                              
                              {/* Logic to show Suspend or Reactivate based on backend data */}
                              <button 
                                onClick={() => handleToggleStatus(user.id, user.status)}
                                className={`font-bold transition-colors whitespace-nowrap text-sm px-4 py-2 rounded-lg hover:bg-gray-100 ${
                                  user.status === 'Suspended' 
                                  ? 'text-green-600' 
                                  : 'text-[#5E2590] hover:text-red-600'
                                }`}
                              >
                                {user.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && users.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {startIndex + 1}-{endIndex} of {users.length} users
                  </p>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500" htmlFor="users-rows-per-page">
                      Rows:
                    </label>
                    <select
                      id="users-rows-per-page"
                      value={rowsPerPage}
                      onChange={(event) => setRowsPerPage(Number(event.target.value))}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:border-[#5E2590] focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={clampedPage === 1}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <span className="text-sm font-medium text-gray-600">
                      Page {clampedPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={clampedPage === totalPages}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Component */}
        <Footer />
      </main>

      {/* Member Documents Modal */}
      {selectedMember && (
        <MemberDocumentsModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          userId={selectedMember.id}
          userName={selectedMember.name}
        />
      )}
    </div>
  );
};

export default ManageUsers;
