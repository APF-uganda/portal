import React, { useState, useEffect } from 'react';
import { User } from '../../components/manageusers-components/users';
import StatCard from '../../components/manageusers-components/stats';


import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const ManageUsers = () => {
  
  const [collapsed, setCollapsed] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // API Integration Point
        // const response = await fetch('your-api-url/users');
        // const data = await response.json();
        // setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSuspend = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'Suspended' } : u));
  };

  return (
    <div className="flex min-h-screen">
      
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      
      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        
       
        <Header title="User Management" />

       
        <div className="flex-1 bg-[#F4F2FE] p-8 space-y-10">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
          
            <div>
              <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Manage Members</h1>
              <p className="text-slate-500 mt-1">Review member status, handle renewals, and manage account access.</p>
            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Users" value={users.length} color="border-blue-500" />
              <StatCard title="Pending Renewals" value={users.filter(u => u.status === 'Pending').length} color="border-yellow-500" />
              <StatCard title="Expired Users" value={users.filter(u => u.status === 'Expired').length} color="border-red-500" />
            </div>

            {/* Users Table  */}
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
                         <td colSpan={5} className="text-center py-10 text-gray-400">Loading users...</td>
                       </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-400">No users found.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
                              ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                user.status === 'Suspended' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.renewalDate}</td>
                          <td className="px-6 py-4 text-sm text-right">
                            <button 
                              onClick={() => handleSuspend(user.id)}
                              className="text-[#5E2590] hover:text-red-600 font-bold transition-colors whitespace-nowrap"
                              disabled={user.status === 'Suspended'}
                            >
                              {user.status === 'Suspended' ? 'Suspended' : 'Suspend Account'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
    
        <Footer />
      </main>
    </div>
  );
};

export default ManageUsers;