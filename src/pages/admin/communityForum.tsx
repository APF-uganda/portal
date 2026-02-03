import { useState } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import StatsCard from '../../components/adminForum-components/statscard';
import FilterBar from '../../components/adminForum-components/filter';
import { PostTable } from '../../components/adminForum-components/postTable';
import { ForumPost } from '../../components/adminForum-components/types';

import { FileText, Users, Flag, Plus } from 'lucide-react';

const MOCK_DATA: ForumPost[] = [
  { id: '1', title: 'How to create a realistic monthly budget?', category: 'Budgeting', comments: 42, authorName: 'Samantha Lee', authorInitials: 'SL', tags: ['budgeting', 'discussion'], status: 'Published', date: 'Mar 12, 2026' },
  { id: '2', title: 'Best savings accounts with high interest rates in 2026', category: 'Savings', comments: 28, authorName: 'Michael Johnson', authorInitials: 'MJ', tags: ['savings', 'discussion'], status: 'Published', date: 'Mar 10, 2026' },
  { id: '3', title: 'Investment strategies for beginners - Need advice', category: 'Investing', comments: 15, authorName: 'Robert Davis', authorInitials: 'RD', tags: ['investing', 'help'], status: 'Draft', date: 'Mar 8, 2026' },
  { id: '4', title: 'How to reduce unnecessary expenses? [REPORTED]', category: 'Budgeting', comments: 7, authorName: 'Karen Thompson', authorInitials: 'KT', tags: ['budgeting', 'discussion'], status: 'Reported', date: 'Mar 5, 2026' },
];

const CommunityForum = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main 
        className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}
      >
        <Header title="Community Forum" />

        <div className="flex-1 bg-[#F4F7FE] p-8">
          <div className="max-w-[1400px] mx-auto">
            
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Forum</h1>
                <nav className="text-sm font-medium text-gray-400">
                  Admin Dashboard <span className="mx-1">&gt;</span> Community Forum
                </nav>
              </div>

             
              <button className="bg-[#5C32A3] hover:bg-[#4a2885] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-purple-200 transition-all active:scale-95">
                <Plus size={20} strokeWidth={3} />
                Create Post
              </button>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                title="Total Posts" 
                value="1,847" 
                trend="+5% since last month" 
                icon={<FileText size={20} />} 
              />
              <StatsCard 
                title="Active Users" 
                value="1,200" 
                trend="+10% since last week" 
                icon={<Users size={20} />} 
              />
              <StatsCard 
                title="Reported Items" 
                value="1" 
                trend="Urgent attention" 
                icon={<Flag size={20} />} 
                isUrgent 
              />
            </div>

            <FilterBar />

            <div className="mt-6">
               <PostTable posts={MOCK_DATA} />
            </div>

          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default CommunityForum;