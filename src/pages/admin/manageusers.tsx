import { useEffect, useMemo, useState } from 'react';
import { Filter, FileText, Users, Clock, AlertCircle } from 'lucide-react';
import StatCard from '../../components/manageusers-components/stats';
import MemberDocumentsModal from '../../components/manageusers-components/MemberDocumentsModal';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { useUserManagement } from '../../hooks/userMgt';

type FilterType = 'all' | 'with-documents' | 'without-documents' | 'recent-uploads';
type SortType = 'documents-first' | 'name' | 'status' | 'recent-activity';

const ManageUsers = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('documents-first');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the hook to get data, loading state, and action handlers
  const { users, loading, error, handleToggleStatus } = useUserManagement();

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply document filter
    switch (filterType) {
      case 'with-documents':
        filtered = filtered.filter(user => user.hasDocuments);
        break;
      case 'without-documents':
        filtered = filtered.filter(user => !user.hasDocuments);
        break;
      case 'recent-uploads':
        filtered = filtered.filter(user => {
          if (!user.lastDocumentUpload) return false;
          const uploadDate = new Date(user.lastDocumentUpload);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return uploadDate > weekAgo;
        });
        break;
    }

    // Apply sorting
    switch (sortType) {
      case 'documents-first':
        return filtered.sort((a, b) => {
          // Users with documents first
          if (a.hasDocuments && !b.hasDocuments) return -1;
          if (!a.hasDocuments && b.hasDocuments) return 1;
          // Then by document count (descending)
          if (a.hasDocuments && b.hasDocuments) {
            return (b.documentCount || 0) - (a.documentCount || 0);
          }
          // Finally by name
          return a.name.localeCompare(b.name);
        });
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'status':
        return filtered.sort((a, b) => a.status.localeCompare(b.status));
      case 'recent-activity':
        return filtered.sort((a, b) => {
          const aDate = a.lastDocumentUpload ? new Date(a.lastDocumentUpload) : new Date(0);
          const bDate = b.lastDocumentUpload ? new Date(b.lastDocumentUpload) : new Date(0);
          return bDate.getTime() - aDate.getTime();
        });
      default:
        return filtered;
    }
  }, [users, filterType, sortType, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / rowsPerPage));
  const clampedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (clampedPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredAndSortedUsers.length);

  const paginatedUsers = useMemo(() => filteredAndSortedUsers.slice(startIndex, endIndex), [filteredAndSortedUsers, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, filterType, sortType, searchTerm]);

  useEffect(() => {
    if (currentPage !== clampedPage) {
      setCurrentPage(clampedPage);
    }
  }, [currentPage, clampedPage]);

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Side Navigation */}
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col w-full min-w-0`}>
        
        {/* Header Component */}
        <Header 
          title="User Management" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Main Content Area */}
        <div className="flex-1 bg-[#F4F2FE] py-3 md:py-6 space-y-6 md:space-y-10 overflow-y-auto">
          <div className="w-full space-y-6 md:space-y-10 px-3 md:px-6">
            
            {/* Title Section */}
            <div>
              <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-slate-800 tracking-tight">Manage Members</h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">Review member status, handle renewals, and manage account access.</p>
            </div>

            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 md:px-4 py-2 md:py-3 rounded-xl text-sm mx-3 md:mx-0">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <StatCard title="Total Users" value={users.length} color="border-blue-500" />
              <StatCard title="With Documents" value={users.filter(u => u.hasDocuments).length} color="border-green-500" />
              <StatCard title="Pending Renewals" value={users.filter(u => u.status === 'Pending').length} color="border-yellow-500" />
              <StatCard title="Recent Uploads" value={users.filter(u => {
                if (!u.lastDocumentUpload) return false;
                const uploadDate = new Date(u.lastDocumentUpload);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return uploadDate > weekAgo;
              }).length} color="border-purple-500" />
            </div>

            {/* Filter and Search Controls */}
            <div className="bg-white rounded-xl md:rounded-[20px] shadow-sm border border-gray-100 p-3 md:p-6">
              <div className="flex flex-col gap-4 items-start justify-between">
                <div className="flex flex-col gap-3 md:gap-4 w-full">
                  {/* Search */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-3 md:pl-4 pr-3 md:pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2590] focus:border-transparent text-sm md:text-base"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                    {/* Filter Dropdown */}
                    <div className="relative flex-1">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as FilterType)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 pr-8 focus:ring-2 focus:ring-[#5E2590] focus:border-transparent w-full text-sm md:text-base"
                      >
                        <option value="all">All Users</option>
                        <option value="with-documents">With Documents</option>
                        <option value="without-documents">Without Documents</option>
                        <option value="recent-uploads">Recent Uploads (7 days)</option>
                      </select>
                      <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative flex-1">
                      <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value as SortType)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 pr-8 focus:ring-2 focus:ring-[#5E2590] focus:border-transparent w-full text-sm md:text-base"
                      >
                        <option value="documents-first">Documents First</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="status">Status</option>
                        <option value="recent-activity">Recent Activity</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-xs md:text-sm text-gray-500 w-full text-center sm:text-left">
                  Showing {filteredAndSortedUsers.length} of {users.length} users
                </div>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-xl md:rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
                <div className="min-w-[800px]">
                  <table className="w-full leading-normal">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[150px]">Member Name</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[200px]">Email</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[100px]">Status</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[100px]">Documents</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[120px]">Last Upload</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 text-right min-w-[200px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                         <tr>
                           <td colSpan={6} className="text-center py-12">
                             <div className="flex flex-col items-center space-y-2">
                               <div className="w-6 h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
                               <span className="text-gray-400 text-sm font-medium">Loading user data...</span>
                             </div>
                           </td>
                         </tr>
                      ) : filteredAndSortedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-400 font-medium">
                            {searchTerm || filterType !== 'all' ? 'No users match your filters.' : 'No users found in the system.'}
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 truncate">{user.name}</span>
                                {user.hasDocuments && (
                                  <FileText className="w-4 h-4 text-green-500 flex-shrink-0" title="Has uploaded documents" />
                                )}
                              </div>
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600">
                              <div className="truncate" title={user.email}>{user.email}</div>
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                              <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap
                                ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                  user.status === 'Suspended' ? 'bg-orange-100 text-orange-700' : 
                                  user.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                              {user.hasDocuments ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-green-600 font-medium">{user.documentCount || 0}</span>
                                  <span className="text-gray-500 hidden sm:inline">docs</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">
                                  <span className="hidden sm:inline">No documents</span>
                                  <span className="sm:hidden">None</span>
                                </span>
                              )}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600">
                              {user.lastDocumentUpload ? (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{new Date(user.lastDocumentUpload).toLocaleDateString()}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">Never</span>
                              )}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-right">
                              <div className="flex items-center justify-end gap-1 md:gap-2">
                                {/* View Documents Button */}
                                <button 
                                  onClick={() => setSelectedMember({ id: user.id, name: user.name })}
                                  className="font-bold transition-colors whitespace-nowrap text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-purple-50 text-[#5E2590]"
                                >
                                  <span className="hidden sm:inline">View Documents</span>
                                  <span className="sm:hidden">View</span>
                                </button>
                                
                                {/* Logic to show Suspend or Reactivate based on backend data */}
                                <button 
                                  onClick={() => handleToggleStatus(user.id, user.status)}
                                  className={`font-bold transition-colors whitespace-nowrap text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-gray-100 ${
                                    user.status === 'Suspended' 
                                    ? 'text-green-600' 
                                    : 'text-[#5E2590] hover:text-red-600'
                                  }`}
                                >
                                  <span className="hidden lg:inline">
                                    {user.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
                                  </span>
                                  <span className="lg:hidden">
                                    {user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {!loading && filteredAndSortedUsers.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-gray-100 px-3 md:px-6 py-3 md:py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
                    Showing {startIndex + 1}-{endIndex} of {filteredAndSortedUsers.length} users
                    {filteredAndSortedUsers.length !== users.length && (
                      <span className="text-gray-400 hidden sm:inline"> (filtered from {users.length} total)</span>
                    )}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs md:text-sm text-gray-500" htmlFor="users-rows-per-page">
                        Rows:
                      </label>
                      <select
                        id="users-rows-per-page"
                        value={rowsPerPage}
                        onChange={(event) => setRowsPerPage(Number(event.target.value))}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs md:text-sm text-gray-700 focus:border-[#5E2590] focus:outline-none"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={clampedPage === 1}
                        className="rounded-md border border-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </button>

                      <span className="text-xs md:text-sm font-medium text-gray-600 px-2">
                        {clampedPage}/{totalPages}
                      </span>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={clampedPage === totalPages}
                        className="rounded-md border border-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                      </button>
                    </div>
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
