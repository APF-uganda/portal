import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  MessageSquare, 
  Eye, 
  Heart, 
  Edit3,
  Trash2,
  Search,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const MyPostsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user posts data
  const myPosts = [
    {
      id: 1,
      title: 'Best Practices for Financial Reporting in Uganda',
      excerpt: 'After working in the accounting field for over 5 years, I wanted to share some insights on financial reporting standards that have helped me streamline processes...',
      category: 'Professional Tips',
      createdAt: '2024-01-15',
      status: 'published',
      replies: 23,
      likes: 45,
      views: 892,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      title: 'Question: Tax Implications for Small Businesses',
      excerpt: 'I have a client who is starting a small business and wants to understand the tax implications. Can anyone share their experience with URA requirements?',
      category: 'Q&A Support',
      createdAt: '2024-01-10',
      status: 'published',
      replies: 12,
      likes: 28,
      views: 456,
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      title: 'Draft: Upcoming Changes in Accounting Standards',
      excerpt: 'Working on a comprehensive guide about the new accounting standards that will be implemented next year. This will cover the major changes and how to prepare...',
      category: 'General Discussion',
      createdAt: '2024-01-08',
      status: 'draft',
      replies: 0,
      likes: 0,
      views: 0,
      lastActivity: 'Never'
    },
    {
      id: 4,
      title: 'Networking Event Recap: APF Annual Conference',
      excerpt: 'Just attended the APF annual conference and wanted to share some key takeaways. The sessions on digital transformation in accounting were particularly insightful...',
      category: 'Networking',
      createdAt: '2024-01-05',
      status: 'published',
      replies: 34,
      likes: 67,
      views: 1234,
      lastActivity: '3 days ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Professional Tips':
        return 'bg-blue-100 text-blue-700';
      case 'Q&A Support':
        return 'bg-orange-100 text-orange-700';
      case 'General Discussion':
        return 'bg-purple-100 text-purple-700';
      case 'Networking':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPosts = myPosts.filter(post => {
    const matchesFilter = activeFilter === 'all' || post.status === activeFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
            <p className="text-gray-600">Manage and track all your forum contributions</p>
          </div>
          <Link to="/forum/create-post">
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="w-5 h-5" />
              Create New Post
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{myPosts.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{myPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{myPosts.reduce((sum, post) => sum + post.likes, 0)}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Replies</p>
                <p className="text-2xl font-bold text-gray-900">{myPosts.reduce((sum, post) => sum + post.replies, 0)}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              {['all', 'published', 'draft'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeFilter === filter
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} Posts
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link to={`/forum/post/${post.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span>Last activity: {post.lastActivity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/forum/post/${post.id}/edit`}>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Post Stats */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes} likes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.replies} replies</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start sharing your knowledge with the community'}
            </p>
            <Link to="/forum/create-post">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto">
                <Plus className="w-5 h-5" />
                Create Your First Post
              </button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPostsPage;