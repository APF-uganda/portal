import { useEffect, useMemo, useState } from 'react';
import { Filter, FileText, Clock, Download, RefreshCw, Hash, UserCheck, UserMinus, Trash2 } from 'lucide-react';
import StatCard from '../../components/manageusers-components/stats';
import MemberDocumentsModal from '../../components/manageusers-components/MemberDocumentsModal';

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { useUserManagement } from '../../hooks/userMgt';
import { API_V1_BASE_URL } from '../../config/api';
import { getAuth } from '../../utils/authStorage';
import { userManagementApi } from '../../services/manageuser';

type FilterType = 'all' | 'with-documents' | 'without-documents' | 'recent-uploads' | 'renewed' | 'due-soon' | 'overdue';
type SortType = 'documents-first' | 'name' | 'status' | 'recent-activity';

const ManageUsers = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<{ id: string; name: string } | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendType, setSuspendType] = useState<'non_payment' | 'policy_violation'>('non_payment');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('documents-first');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // APF number assignment state
  const [apfTarget, setApfTarget] = useState<{ id: string; name: string; current: string | null } | null>(null);
  const [apfInput, setApfInput] = useState('');
  const [apfError, setApfError] = useState('');
  const [apfSaving, setApfSaving] = useState(false);

  // Delete member state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Use the hook to get data, loading state, and action handlers
  const { users, loading, error, handleToggleStatus, fetchUsers } = useUserManagement();

  // Export to CSV function
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const auth = getAuth();
      if (!auth?.access_token) {
        alert('Please login to export data');
        return;
      }

      // Build query params based on current filters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType === 'with-documents' || filterType === 'without-documents') {
        // Note: Backend doesn't have document filter, so we export all and let admin filter in Excel
      }

      const url = `${API_V1_BASE_URL}/admin-management/members/export/?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `apf_members_export_${new Date().toISOString().slice(0, 10)}.csv`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAssignApfNumber = async () => {
    const value = apfInput.trim().toUpperCase();
    if (!value) { setApfError('Please enter an APF number.'); return; }
    if (!/^APF\/M\/\d+$/.test(value)) { setApfError('Format must be APF/M/*** (e.g. APF/M/001)'); return; }
    setApfError('');
    setApfSaving(true);
    try {
      await userManagementApi.assignApfNumber(apfTarget!.id, value);
      await fetchUsers();
      setApfTarget(null);
      setApfInput('');
    } catch (err: any) {
      const msg = err.response?.data?.error?.apf_membership_number?.[0]
        || err.response?.data?.error
        || 'Failed to assign APF number. Please try again.';
      setApfError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setApfSaving(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userManagementApi.deleteMember(deleteTarget.id);
      await fetchUsers();
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete member. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

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
      case 'renewed':
        filtered = filtered.filter(user => user.renewalStatus === 'renewed');
        break;
      case 'due-soon':
        filtered = filtered.filter(user => user.renewalStatus === 'due_soon');
        break;
      case 'overdue':
        filtered = filtered.filter(user => user.renewalStatus === 'overdue');
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
              <StatCard title="Renewed" value={users.filter(u => u.renewalStatus === 'renewed').length} color="border-green-500" />
              <StatCard title="Overdue" value={users.filter(u => u.renewalStatus === 'overdue').length} color="border-red-500" />
              <StatCard title="Due Soon" value={users.filter(u => u.renewalStatus === 'due_soon').length} color="border-amber-500" />
            </div>

            {/* Filter and Search Controls */}
            <div className="bg-white rounded-xl md:rounded-[20px] shadow-sm border border-gray-100 p-3 md:p-6">
              <div className="flex flex-col gap-4 items-start justify-between">
                {/* Export Button Row */}
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">Filter & Search</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchUsers}
                      disabled={loading}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                      title="Refresh member list"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      disabled={isExporting || loading}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#5E2590] text-white rounded-lg hover:bg-[#4a1d73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export to CSV'}</span>
                      <span className="sm:hidden">{isExporting ? '...' : 'Export'}</span>
                    </button>
                  </div>
                </div>

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
                        <option disabled>── Renewal Status ──</option>
                        <option value="renewed">Renewed</option>
                        <option value="due-soon">Due Soon</option>
                        <option value="overdue">Overdue</option>
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
            <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[180px]">Email</th>
            <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[120px] whitespace-nowrap">APF No.</th>
            <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[90px]">Status</th>
            <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[100px] whitespace-nowrap">Renewal</th>
            <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[80px] whitespace-nowrap">Docs</th>
            <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 min-w-[100px]">Last Upload</th>
            <th className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 text-center min-w-[160px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
             <tr>
               <td colSpan={8} className="text-center py-12">
                 <div className="flex flex-col items-center space-y-2">
                   <div className="w-6 h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-gray-400 text-sm font-medium">Loading user data...</span>
                 </div>
               </td>
             </tr>
          ) : filteredAndSortedUsers.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-gray-400 font-medium">
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
                      <FileText className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600">
                  <div className="truncate" title={user.email}>{user.email}</div>
                  <div className="mt-0.5">
                    {user.emailVerified ? (
                      <span className="text-[10px] font-semibold text-green-600">✓ Verified</span>
                    ) : user.mustChangePassword ? (
                      <span className="text-[10px] font-semibold text-yellow-600">⏳ Pending login</span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-400">Not verified</span>
                    )}
                  </div>
                </td>
                {/* APF Membership Number */}
                <td className="px-3 md:px-6 py-3 md:py-4 text-sm whitespace-nowrap">
                  {user.apfMembershipNumber ? (
                    <span className="font-mono font-semibold text-[#5E2590]">{user.apfMembershipNumber}</span>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Not assigned</span>
                  )}
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
                <td className="px-3 md:px-6 py-3 md:py-4 text-sm whitespace-nowrap">
                  {user.renewalStatus === 'renewed' && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 whitespace-nowrap">✓ Renewed</span>
                  )}
                  {user.renewalStatus === 'overdue' && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 whitespace-nowrap">Overdue</span>
                  )}
                  {user.renewalStatus === 'due_soon' && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 whitespace-nowrap">Due Soon</span>
                  )}
                  {(!user.renewalStatus || user.renewalStatus === 'unknown') && (
                    <span className="text-gray-400 text-[10px]">—</span>
                  )}
                  {user.renewalDate !== 'N/A' && (
                    <div className="text-[9px] text-gray-400 mt-0.5">{user.renewalDate}</div>
                  )}
                </td>
                
                {/* FIXED: whitespace-nowrap ensures "X docs" stays on one line */}
                <td className="px-3 md:px-6 py-3 md:py-4 text-sm whitespace-nowrap">
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
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span>{new Date(user.lastDocumentUpload).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Never</span>
                  )}
                </td>
                
                <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-right">
                  <div className="flex items-center justify-center gap-1">
                    {/* APF number */}
                    <button
                      onClick={() => {
                        setApfInput(user.apfMembershipNumber || '');
                        setApfError('');
                        setApfTarget({ id: user.id, name: user.name, current: user.apfMembershipNumber || null });
                      }}
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-[#5E2590] transition-colors"
                      title="Assign APF Number"
                    >
                      <Hash className="w-4 h-4" />
                    </button>

                    {/* Documents */}
                    <button
                      onClick={() => setSelectedMember({ id: user.id, name: user.name })}
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-[#5E2590] transition-colors"
                      title="View Documents"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    {/* Suspend / Reactivate */}
                    {user.status === 'Suspended' ? (
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                        title="Reactivate Member"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSuspendReason('');
                          setSuspendType('non_payment');
                          setSuspendTarget({ id: user.id, name: user.name });
                        }}
                        className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500 transition-colors"
                        title="Suspend Member"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4" />
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

      {/* Delete Member Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Member</h3>
                <p className="text-sm text-gray-500">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You are about to permanently delete <strong>{deleteTarget.name}</strong> and all their
              associated data — payments, documents, applications, and notifications.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
              ⚠️ This action is irreversible. The member will lose all access and their data will be gone.
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMember}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APF Number Assignment Modal */}
      {apfTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Hash className="w-5 h-5 text-[#5E2590]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Assign APF Membership Number</h3>
                <p className="text-sm text-gray-500">{apfTarget.name}</p>
              </div>
            </div>

            {apfTarget.current && (
              <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 text-sm">
                Current number: <span className="font-mono font-semibold text-[#5E2590]">{apfTarget.current}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                APF Membership Number
              </label>
              <input
                type="text"
                value={apfInput}
                onChange={(e) => { setApfInput(e.target.value.toUpperCase()); setApfError(''); }}
                placeholder="APF/M/001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
              />
              <p className="text-xs text-gray-400 mt-1">Format: APF/M/*** (e.g. APF/M/001, APF/M/042)</p>
              {apfError && <p className="text-xs text-red-600 mt-1">{apfError}</p>}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setApfTarget(null); setApfInput(''); setApfError(''); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={apfSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignApfNumber}
                disabled={apfSaving || !apfInput.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#5E2590] rounded-lg hover:bg-[#4a1d73] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {apfSaving ? 'Saving...' : 'Assign Number'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Documents Modal */}
      {selectedMember && (
        <MemberDocumentsModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          userId={selectedMember.id}
          userName={selectedMember.name}
        />
      )}

      {/* Suspension Reason Modal */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Suspend Member</h3>
            <p className="text-sm text-gray-600">
              You are about to suspend <strong>{suspendTarget.name}</strong>. Please select the suspension type and provide a reason — this will be included in the email sent to the member.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suspension Type</label>
              <select
                value={suspendType}
                onChange={(e) => setSuspendType(e.target.value as 'non_payment' | 'policy_violation')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="non_payment">Non-Payment of Subscription</option>
                <option value="policy_violation">Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder={suspendType === 'non_payment'
                  ? "e.g. Annual subscription fee for 2025/2026 not paid..."
                  : "e.g. Repeated violation of community guidelines..."}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSuspendTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!suspendReason.trim()}
                onClick={async () => {
                  await handleToggleStatus(suspendTarget.id, 'Active', suspendReason.trim(), suspendType);
                  setSuspendTarget(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
