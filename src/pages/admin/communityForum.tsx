import { useState } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import StatsCard from '../../components/adminForum-components/statscard';
import FilterBar from '../../components/adminForum-components/filter';
import { PostTable } from '../../components/adminForum-components/postTable';
import { ForumPost } from '../../components/adminForum-components/types';

import { 
  FileText, Users, Flag, Plus, LayoutGrid, List, 
  MessageSquare, ThumbsUp, Trash2, ChevronDown, ChevronUp 
} from 'lucide-react';

const MOCK_DATA: ForumPost[] = [
  { id: '1', title: 'How to create a realistic monthly budget?', category: 'Budgeting', comments: 42, authorName: 'Samantha Lee', authorInitials: 'SL', tags: ['budgeting', 'discussion'], status: 'Published', date: 'Mar 12, 2026' },
  { id: '2', title: 'Best savings accounts with high interest rates in 2026', category: 'Savings', comments: 28, authorName: 'Michael Johnson', authorInitials: 'MJ', tags: ['savings', 'discussion'], status: 'Published', date: 'Mar 10, 2026' },
  { id: '3', title: 'Investment strategies for beginners - Need advice', category: 'Investing', comments: 15, authorName: 'Robert Davis', authorInitials: 'RD', tags: ['investing', 'help'], status: 'Draft', date: 'Mar 8, 2026' },
  { id: '4', title: 'How to reduce unnecessary expenses? [REPORTED]', category: 'Budgeting', comments: 7, authorName: 'Karen Thompson', authorInitials: 'KT', tags: ['budgeting', 'discussion'], status: 'Reported', date: 'Mar 5, 2026' },
];

const CommunityForum = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'feed' | 'table'>('feed');
  const [expandedPost, setExpandedPost] = useState<string | null>(null); 

  const toggleExpand = (id: string) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        <Header title="Community Forum" />

        <div className="flex-1 bg-[#F4F7FE] p-8">
          <div className="max-w-[1200px] mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Forum</h1>
                <nav className="text-sm font-medium text-gray-400">
                  Admin Dashboard <span className="mx-1">&gt;</span> Community Forum
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-white border border-gray-200 rounded-lg p-1 mr-2 shadow-sm">
                    <button onClick={() => setViewMode('feed')} className={`p-2 rounded-md ${viewMode === 'feed' ? 'bg-[#5C32A3] text-white' : 'text-gray-400'}`}><LayoutGrid size={18} /></button>
                    <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-[#5C32A3] text-white' : 'text-gray-400'}`}><List size={18} /></button>
                </div>
                <button className="bg-[#5C32A3] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-purple-200 transition-all">
                  <Plus size={20} strokeWidth={3} /> Create Post
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard title="Total Posts" value="1,847" trend="+5%" icon={<FileText size={20} />} />
              <StatsCard title="Active Users" value="1,200" trend="+10%" icon={<Users size={20} />} />
              <StatsCard title="Reported Items" value="1" trend="Urgent" icon={<Flag size={20} />} isUrgent />
            </div>

            <FilterBar />

            <div className="mt-6">
               {viewMode === 'table' ? (
                 <PostTable posts={MOCK_DATA} />
               ) : (
                 <div className="space-y-6">
                    {MOCK_DATA.map((post) => (
                      <div key={post.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold">{post.authorInitials}</div>
                            <div>
                              <h4 className="font-bold text-gray-900 leading-tight">{post.authorName}</h4>
                              <p className="text-xs text-gray-400">{post.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 text-gray-400">
                            
                            <button className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                        
                        
                        <div className={`text-sm text-gray-600 leading-relaxed mb-4 ${expandedPost === post.id ? '' : 'line-clamp-2'}`}>
                         
                          Dive deep into the discussion regarding {post.title.toLowerCase()}. This is where the admin reads the full context. If the post is expanded, all text is revealed. If not, it stays neat.
                        </div>

                        
                        <button 
                          onClick={() => toggleExpand(post.id)}
                          className="text-[#5C32A3] text-xs font-bold flex items-center gap-1 mb-4 hover:underline"
                        >
                          {expandedPost === post.id ? (
                            <>Show Less <ChevronUp size={14} /></>
                          ) : (
                            <>Read More <ChevronDown size={14} /></>
                          )}
                        </button>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                          <div className="flex gap-5 text-gray-400 text-xs font-medium">
                            <span className="flex items-center gap-1.5"><MessageSquare size={16} /> {post.comments} Replies</span>
                            <span className="flex items-center gap-1.5"><ThumbsUp size={16} /> 32 Likes</span>
                          </div>
                          <div className="flex gap-2">
                            {post.tags.map(tag => (
                              <span key={tag} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default CommunityForum;