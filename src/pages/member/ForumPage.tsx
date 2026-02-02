import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  List, 
  MessageSquare, 
  Eye, 
  Heart, 
  Bookmark, 
  Reply,
  ChevronRight,
  Megaphone,
  Lightbulb,
  HelpCircle,
  Briefcase,
  UserPlus
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const ForumPage = () => {
  const [activeCategory, setActiveCategory] = useState('announcements');
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'announcements', name: 'Announcements', icon: Megaphone, count: 124 },
    { id: 'suggestions', name: 'Suggestions', icon: Lightbulb, count: 308 },
    { id: 'general', name: 'General Discussion', icon: MessageSquare, count: 954 },
    { id: 'qa', name: 'Q&A Support', icon: HelpCircle, count: 421 },
    { id: 'tips', name: 'Professional Tips', icon: Briefcase, count: 287 },
    { id: 'networking', name: 'Networking', icon: UserPlus, count: 156 }
  ];

  const activeUsers = [
    { name: 'Alice Wonderland', initials: 'AW', status: 'online', lastSeen: 'Online now' },
    { name: 'Bob The Builder', initials: 'BT', status: 'online', lastSeen: 'Online now' },
    { name: 'Evanescence Star', initials: 'ES', status: 'away', lastSeen: 'Last seen 30 min ago' },
    { name: 'Michael Jordan', initials: 'MJ', status: 'online', lastSeen: 'Online now' }
  ];

  const forumPosts = [
    {
      id: 1,
      title: 'Understanding Your APF Membership Benefits',
      author: 'Alice Wonderland',
      authorInitials: 'AW',
      time: '2 hours ago',
      category: 'Announcements',
      excerpt: 'Dive deep into the full spectrum of benefits available with your APF membership. From exclusive resources and networking opportunities to professional development tools, this guide will help you maximize your membership value.',
      replies: 124,
      likes: 32,
      views: 1289
    },
    {
      id: 2,
      title: 'Idea: Dark Mode Option for the APF Portal',
      author: 'Evanescence Star',
      authorInitials: 'ES',
      time: '1 week ago',
      category: 'Suggestions',
      excerpt: 'Many modern applications offer a dark mode for better eye comfort, especially during nighttime use. Would the APF team consider implementing a dark mode option for the portal?',
      replies: 210,
      likes: 55,
      views: 2100
    },
    {
      id: 3,
      title: 'Seeking Advice: Best Practices for Project Management',
      author: 'Bob The Builder',
      authorInitials: 'BT',
      time: '1 day ago',
      category: 'General Discussion',
      excerpt: 'I\'m new to leading projects within APF and would appreciate advice from experienced members. What are some essential tools or methodologies you recommend for effective project management?',
      replies: 87,
      likes: 18,
      views: 954
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
            <p className="text-gray-600">Connect, share, and discover insights with the APF community.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/forum/create-post">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-5 h-5" />
                Create New Post
              </button>
            </Link>
            <Link to="/forum/my-posts">
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <List className="w-5 h-5" />
                My Posts
              </button>
            </Link>
          </div>
        </div>

        {/* Forum Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Forum Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200">
                Forum Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-purple-50 text-purple-600'
                          : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-sm font-semibold px-2 py-1 rounded-full min-w-[32px] text-center">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200">
                Active Members
              </h3>
              <div className="space-y-3">
                {activeUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span>{user.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Forum Content */}
          <div className="lg:col-span-3">
            {/* Forum Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['all', 'popular', 'recent', 'unanswered'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        activeFilter === filter
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)} Posts
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Latest Activity</option>
                    <option>Most Replies</option>
                    <option>Most Likes</option>
                    <option>Date Posted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Forum Posts */}
            <div className="space-y-6">
              {forumPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.authorInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{post.author}</div>
                        <div className="text-sm text-gray-500">{post.time}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                    <Link to={`/forum/post/${post.id}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-height-tight hover:text-purple-600 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center gap-6 mb-5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span>{post.replies} Replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-purple-600" />
                      <span>{post.likes} Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span>{post.views} Views</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-200">
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Reply className="w-4 h-4" />
                        Reply
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart className="w-4 h-4" />
                        Like
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        Bookmark
                      </button>
                    </div>
                    <Link to={`/forum/post/${post.id}`} className="flex items-center gap-1 text-purple-600 font-semibold hover:underline">
                      Read More
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Forum Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Community Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="text-sm text-gray-600 mb-2">Total Members</div>
                  <div className="text-2xl font-bold text-gray-900">2,458</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="text-sm text-gray-600 mb-2">Active Today</div>
                  <div className="text-2xl font-bold text-gray-900">312</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="text-sm text-gray-600 mb-2">Total Posts</div>
                  <div className="text-2xl font-bold text-gray-900">1,842</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="text-sm text-gray-600 mb-2">Total Replies</div>
                  <div className="text-2xl font-bold text-gray-900">9,427</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ForumPage;