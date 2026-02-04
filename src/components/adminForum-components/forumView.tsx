

import  StatsCard  from '../../components/adminForum-components/statscard';
import  FilterBar  from '../../components/adminForum-components/filter';
import  { PostTable } from '../../components/adminForum-components/postTable';
import { ForumPost } from './types';


const MOCK_DATA: ForumPost[] = [
  { id: '1', title: 'How to create a realistic monthly budget?', category: 'Budgeting', comments: 42, authorName: 'Samantha Lee', authorInitials: 'SL', tags: ['budgeting', 'discussion'], status: 'Published', date: 'Mar 12, 2026' },
  { id: '2', title: 'Best savings accounts with high interest rates in 2026', category: 'Savings', comments: 28, authorName: 'Michael Johnson', authorInitials: 'MJ', tags: ['savings', 'discussion'], status: 'Published', date: 'Mar 10, 2026' },
  { id: '3', title: 'Investment strategies for beginners - Need advice', category: 'Investing', comments: 15, authorName: 'Robert Davis', authorInitials: 'RD', tags: ['investing', 'help'], status: 'Draft', date: 'Mar 8, 2026' },
  { id: '4', title: 'How to reduce unnecessary expenses? [REPORTED]', category: 'Budgeting', comments: 7, authorName: 'Karen Thompson', authorInitials: 'KT', tags: ['budgeting', 'discussion'], status: 'Reported', date: 'Mar 5, 2026' },
];

export const CommunityForum = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Community Forum</h1>
        <p className="text-sm text-gray-500">Admin Dashboard &gt; Community Forum</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       
        <StatsCard title="Total Posts" value="1,847" trend="+5% since last month" icon={"📄"} />
        <StatsCard title="Active Users" value="1,200" trend="+10% since last week" icon={"👥"} />
        <StatsCard title="Reported Items" value="1" trend="Urgent attention" icon={"🚩"} isUrgent />
      </div>

      <FilterBar />
      <PostTable posts={MOCK_DATA} />
    </div>
  );
};