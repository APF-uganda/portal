import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import StatsCard from '../../components/adminForum-components/statscard';
import FilterBar from '../../components/adminForum-components/filter';
import { PostTable } from '../../components/adminForum-components/postTable';
import { PostStatus } from '../../components/adminForum-components/types';
import { 
  useForumPosts, 
  useForumStats, 
  useCategories, 
  useDeletePost,
  useToggleLike 
} from '../../hooks/useForumData';

import { 
  FileText, Users, Flag, Plus, LayoutGrid, List, 
  MessageSquare, ThumbsUp, Trash2, ChevronDown, ChevronUp 
} from 'lucide-react';

const CommunityForum = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'feed' | 'table'>('feed');
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build filters for API
  const filters = useMemo(() => ({
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: debouncedSearch || undefined,
  }), [selectedStatus, selectedCategory, debouncedSearch]);

  // Fetch data
  const { data: postsData, loading: postsLoading, error: postsError, refetch: refetchPosts } = useForumPosts(filters);
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useForumStats();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { deletePost } = useDeletePost();
  const { toggleLike } = useToggleLike();

  console.log('📊 Posts data:', postsData);
  console.log('📊 Posts loading:', postsLoading);
  console.log('📊 Posts error:', postsError);

  const posts = postsData?.results || [];

  const handleDeletePost = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await deletePost(id);
      if (success) {
        refetchPosts();
        refetchStats();
      }
    }
  };

  const handleToggleLike = async (postId: number, isLiked: boolean) => {
    const success = await toggleLike(postId, isLiked);
    if (success) {
      refetchPosts();
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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
                  <button 
                    onClick={() => setViewMode('feed')} 
                    className={`p-2 rounded-md ${viewMode === 'feed' ? 'bg-[#5C32A3] text-white' : 'text-gray-400'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')} 
                    className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-[#5C32A3] text-white' : 'text-gray-400'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/admin/communityForum/create-post')}
                  className="bg-[#5C32A3] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-purple-200 transition-all hover:bg-[#4A2885]"
                >
                  <Plus size={20} strokeWidth={3} /> Create Post
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsLoading ? (
                <>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-20"></div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-20"></div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-20"></div>
                  </div>
                </>
              ) : stats ? (
                <>
                  <StatsCard 
                    title="Total Posts" 
                    value={stats.total_posts} 
                    trend={`${stats.published_posts} published`} 
                    icon={<FileText size={20} />} 
                  />
                  <StatsCard 
                    title="Active Users" 
                    value={stats.active_users} 
                    trend="Last 30 days" 
                    icon={<Users size={20} />} 
                  />
                  <StatsCard 
                    title="Pending Reports" 
                    value={stats.pending_reports} 
                    trend={stats.pending_reports > 0 ? "Urgent" : "All clear"} 
                    icon={<Flag size={20} />} 
                    isUrgent={stats.pending_reports > 0} 
                  />
                </>
              ) : null}
            </div>

            {/* Filter Bar */}
            <FilterBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              categoriesLoading={categoriesLoading}
            />

            {/* Error Message */}
            {postsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <Flag size={20} className="mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">Error loading posts</p>
                    <p className="text-sm">{postsError}</p>
                    {postsError.includes('session') || postsError.includes('login') ? (
                      <button 
                        onClick={() => window.location.href = '/login'}
                        className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Go to Login
                      </button>
                    ) : (
                      <button 
                        onClick={refetchPosts}
                        className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Posts Content */}
            <div className="mt-6">
              {viewMode === 'table' ? (
                <PostTable 
                  posts={posts} 
                  onDeletePost={handleDeletePost}
                  loading={postsLoading}
                />
              ) : (
                <div className="space-y-6">
                  {postsLoading ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C32A3] mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading posts...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="max-w-md mx-auto">
                        <FileText size={64} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No posts yet</h3>
                        <p className="text-gray-500 mb-6">
                          {(selectedStatus !== 'all' || selectedCategory !== 'all' || debouncedSearch) 
                            ? 'No posts match your current filters. Try adjusting your search criteria.'
                            : 'Be the first to create a post in the community forum!'}
                        </p>
                        {selectedStatus === 'all' && selectedCategory === 'all' && !debouncedSearch && (
                          <button
                            onClick={() => navigate('/admin/communityForum/create-post')}
                            className="bg-[#5C32A3] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4A2885] transition-colors inline-flex items-center gap-2"
                          >
                            <Plus size={20} /> Create First Post
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold">
                              {post.author.initials}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 leading-tight">{post.author.full_name}</h4>
                              <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 text-gray-400">
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
                        
                        <div className={`text-sm text-gray-600 leading-relaxed mb-4 ${expandedPost === post.id ? '' : 'line-clamp-2'}`}>
                          {post.content}
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
                            <span className="flex items-center gap-1.5">
                              <MessageSquare size={16} /> {post.comment_count} Replies
                            </span>
                            <button 
                              onClick={() => handleToggleLike(post.id, post.is_liked)}
                              className={`flex items-center gap-1.5 transition-colors ${
                                post.is_liked ? 'text-indigo-600' : 'hover:text-indigo-600'
                              }`}
                            >
                              <ThumbsUp size={16} fill={post.is_liked ? 'currentColor' : 'none'} /> 
                              {post.like_count} Likes
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag.id} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                #{tag.name}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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