import { useState } from "react";

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";


import { 
  Plus, Filter, Megaphone, FileEdit, Clock, 
  Eye, Edit3, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { StatCard, Badge } from '../../components/comm-components/stats';
import { Announcement } from '../../components/comm-components/types';

const data: Announcement[] = [
  { id: 1, title: "Upcoming System Maintenance", audience: "All Users", channel: "Both", status: "Scheduled", createdBy: "Jane Doe", date: "2023-10-26 09:00 AM" },
  { id: 2, title: "New Feature Release: Project Analytics", audience: "Project Managers", channel: "In-App", status: "Sent", createdBy: "John Smith", date: "2023-10-20 02:30 PM" },
  { id: 3, title: "Security Advisory: Password Reset Recommended", audience: "All Users", channel: "Email", status: "Sent", createdBy: "Admin", date: "2023-10-15 10:00 AM" },
  { id: 4, title: "Draft: Q4 Performance Review Guidelines", audience: "Department Heads", channel: "Email", status: "Draft", createdBy: "Sarah Lee", date: "2023-10-24 11:45 AM" },
];

export default function CommunicationsDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
     
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      
      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        
        
        <Header title="Communications Dashboard" />

        
        <div className="flex-1 bg-[#F4F7FE] p-8">
          <div className="max-w-[1200px] mx-auto">
            
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Communications</h1>
                <nav className="text-sm font-medium text-gray-400">
                  Admin Dashboard <span className="mx-1">&gt;</span> Communications
                </nav>
              </div>
              <button className="bg-[#5C32A3] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-purple-200 hover:bg-[#4A2882] transition-all">
                <Plus size={20} strokeWidth={3} /> New Announcement
              </button>
            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Announcements" value={10} subtext="All announcements created" icon={Megaphone} color="bg-purple-100 text-purple-600" />
              <StatCard title="Draft Announcements" value={2} subtext="Announcements in draft status" icon={FileEdit} color="bg-orange-50 text-orange-500" />
              <StatCard title="Scheduled Announcements" value={4} subtext="Scheduled for future delivery" icon={Clock} color="bg-green-50 text-green-500" />
            </div>

            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-800">All Announcements</h2>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <Filter size={16} /> Filter
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Audience</th>
                      <th className="px-6 py-4">Channel</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created By</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                        <td className="px-6 py-5 font-semibold text-gray-800">{item.title}</td>
                        <td className="px-6 py-5"><Badge label={item.audience} type="Audience" /></td>
                        <td className="px-6 py-5"><Badge label={item.channel} type={item.channel} /></td>
                        <td className="px-6 py-5"><Badge label={item.status} type={item.status} /></td>
                        <td className="px-6 py-5 text-gray-600 font-medium">{item.createdBy}</td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button title="View" className="p-1.5 text-gray-400 hover:text-[#5C32A3]"><Eye size={18} /></button>
                            <button title="Edit" className="p-1.5 text-gray-400 hover:text-[#5C32A3]"><Edit3 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
              <div className="p-6 border-t border-gray-50 flex justify-center items-center gap-2">
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition"><ChevronLeft size={18}/></button>
                {[1, 2, 3, 4, 5].map(n => (
                  <button 
                    key={n} 
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${n === 1 ? 'bg-[#5C32A3] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {n}
                  </button>
                ))}
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition"><ChevronRight size={18}/></button>
              </div>
            </div>
          </div>
        </div>

        
        <Footer />
      </main>
    </div>
  );
}