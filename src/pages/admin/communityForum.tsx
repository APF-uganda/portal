import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import StatsCard from '../../components/adminForum-components/statscard';
import FilterBar from '../../components/adminForum-components/filter';
import { PostTable } from '../../components/adminForum-components/postTable';
import PostDetailModal from '../../components/adminForum-components/PostDetailModal';
import { PostStatus, ForumPost } from '../../components/adminForum-components/types';
import { 
  useForumPosts, 
  useForumStats, 
  useCategories, 
  useDeletePost,
  useToggleLike,
  useComments,
  useCreateComment
} from '../../hooks/useForumData';

import { 
  FileText, Users, Flag, Plus, LayoutGrid, List, 
  MessageSquare, ThumbsUp, Trash2, Eye, Edit
} from 'lucide-react';

const CommunityForum = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'feed' | 'table'>('feed');
  const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Character limit for preview
  const PREVIEW_CHAR_LIMIT = 200;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build filters for API based on active tab
  const filters = useMemo(() => ({
    status: (activeTab === 'published' ? 'published' : 'draft') as PostStatus,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: debouncedSearch || undefined,
  }), [activeTab, selectedCategory, debouncedSearch]);

  // Fetch data
  const { data: postsData, loading: postsLoading, error: postsError, refetch: refetchPosts } = useForumPosts(filters);
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useForumStats();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { deletePost } = useDeletePost();
  const { toggleLike } = useToggleLike();
  
  // Comments management
  const { data: comments, loading: commentsLoading, refetch: refetchComments } = useComments(selectedPost?.id || null);
  const { createComment } = useCreateComment();

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
      // Update the selected post if modal is open
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          is_liked: !isLiked,
          like_count: isLiked ? selectedPost.like_count - 1 : selectedPost.like_count + 1
        });
      }
    }
  };

  const openPostModal = (post: ForumPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closePostModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300);
  };

  const handleAddComment = async (postId: number, content: string, parentId?: number): Promise<boolean> => {
    const commentData: any = { post: postId, content };
    if (parentId) {
      commentData.parent = parentId;
    }
    const comment = await createComment(commentData);
    if (comment) {
      refetchComments();
      refetchPosts(); // Refresh to update comment count
      return true;
    }
    return false;
  };

  const truncateContent = (content: string, limit: number) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + '...';
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
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col w-full min-w-0`}>
        <Header 
          title="Community Forum" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 bg-[#F4F7FE] py-3 md:py-6 overflow-y-auto">
          <div className="w-full space-y-4 md:space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-3 md:px-6">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Community Forum</h1>
                <nav className="text-xs md:text-sm font-medium text-gray-400">
                  Admin Dashboard <span className="mx-1">&gt;</span> Community Forum
                </nav>
              </div>

              <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button 
                    onClick={() => setViewMode('feed')} 
                    className={`p-2 rounded-md ${viewMode === 'feed' ? 'bg-[#5C32A3] text-white' : 'text-gray-400'}`}
                  >
                    <LayoutGrid size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')} 
                    className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-[#5C32A3] text-white' : 'text-gray-400'}`}
                  >
                    <List size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/admin/communityForum/create-post')}
                  className="bg-[#5C32A3] text-white px-3 md:px-6 py-2 md:py-2.5 rounded-xl flex items-center gap-1 md:gap-2 font-bold shadow-lg shadow-purple-200 transition-all hover:bg-[#4A2885] text-sm md:text-base flex-1 md:flex-initial justify-center"
                >
                  <Plus size={16} className="md:w-5 md:h-5" strokeWidth={3} /> 
                  <span className="hidden sm:inline">Create Post</span>
                  <span className="sm:hidden">Create</span>
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 px-3 md:px-6">
              {statsLoading ? (
                <>
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-16 md:h-20"></div>
                  </div>
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-16 md:h-20"></div>
                  </div>
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-16 md:h-20"></div>
                  </div>
                </>
              ) : stats ? (
                <>
                  <StatsCard 
                    title="Total Posts" 
                    value={stats.total_posts} 
                    trend={`${stats.published_posts} published, ${stats.draft_posts} drafts`} 
                    icon={<FileText size={18} className="md:w-5 md:h-5" />} 
                  />
                  <StatsCard 
                    title="Active Users" 
                    value={stats.active_users} 
                    trend="Last 30 days" 
                    icon={<Users size={18} className="md:w-5 md:h-5" />} 
                  />
                  <StatsCard 
                    title="Pending Reports" 
                    value={stats.pending_reports} 
                    trend={stats.pending_reports > 0 ? "Urgent" : "All clear"} 
                    icon={<Flag size={18} className="md:w-5 md:h-5" />} 
                    isUrgent={stats.pending_reports > 0} 
                  />
                </>
              ) : null}
            </div>

            {/* Tabs for Published/Draft */}
            <div className="px-3 md:px-6">
              <div className="flex gap-1 md:gap-2 border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-4 md:px-6 py-3 font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTab === 'published'
                      ? 'text-[#5C32A3] border-b-2 border-[#5C32A3]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Published Posts
                  {stats && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                      {stats.published_posts}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('draft')}
                  className={`px-4 md:px-6 py-3 font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTab === 'draft'
                      ? 'text-[#5C32A3] border-b-2 border-[#5C32A3]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Draft Posts
                  {stats && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {stats.draft_posts}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-3 md:px-6">
            <FilterBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={activeTab as PostStatus}
              onStatusChange={() => {
                // Status is controlled by tabs now
              }}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              categoriesLoading={categoriesLoading}
            />
            </div>

            {/* Error Message */}
            {postsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-6 py-4 rounded-xl mx-3 md:mx-6">
                <div className="flex items-start gap-3">
                  <Flag size={20} className="mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold mb-1">Error loading posts</p>
                    <p className="text-sm break-words">{postsError}</p>
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
            <div className="px-3 md:px-6">
              {viewMode === 'table' ? (
                <PostTable 
                  posts={posts} 
                  onDeletePost={handleDeletePost}
                  loading={postsLoading}
                />
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {postsLoading ? (
                    <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-[#5C32A3] mx-auto mb-4"></div>
                      <p className="text-gray-500 text-sm md:text-base">Loading posts...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="max-w-md mx-auto">
                        <FileText size={48} className="md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-2">
                          {activeTab === 'published' ? 'No published posts yet' : 'No draft posts yet'}
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm md:text-base">
                          {(selectedCategory !== 'all' || debouncedSearch) 
                            ? 'No posts match your current filters. Try adjusting your search criteria.'
                            : activeTab === 'published' 
                              ? 'Be the first to publish a post in the community forum!'
                              : 'You don\'t have any draft posts. Create a new post to get started!'}
                        </p>
                        {selectedCategory === 'all' && !debouncedSearch && (
                          <button
                            onClick={() => navigate('/admin/communityForum/create-post')}
                            className="bg-[#5C32A3] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold hover:bg-[#4A2885] transition-colors inline-flex items-center gap-2 text-sm md:text-base"
                          >
                            <Plus size={18} className="md:w-5 md:h-5" /> Create {activeTab === 'draft' ? 'Draft' : 'Post'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0">
                              {post.author.initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-900 leading-tight text-sm md:text-base truncate">{post.author.full_name}</h4>
                              <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 md:gap-2 flex-shrink-0 ml-2">
                            {activeTab === 'draft' && (
                              <button 
                                onClick={() => navigate(`/admin/communityForum/edit-post/${post.id}`)}
                                className="p-1.5 md:p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600"
                                title="Edit draft"
                              >
                                <Edit size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 md:p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                              title="Delete post"
                            >
                              <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 break-words leading-tight">{post.title}</h3>
                        
                        <div className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap break-words">
                          {truncateContent(post.content, PREVIEW_CHAR_LIMIT)}
                        </div>

                        {post.content.length > PREVIEW_CHAR_LIMIT && (
                          <button 
                            onClick={() => openPostModal(post)}
                            className="text-[#5C32A3] text-sm font-bold flex items-center gap-2 mb-4 hover:underline"
                          >
                            <Eye size={14} className="md:w-4 md:h-4" />
                            Read More
                          </button>
                        )}

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-50 gap-3">
                          <div className="flex gap-4 md:gap-5 text-xs font-medium">
                            <button 
                              onClick={() => openPostModal(post)}
                              className="flex items-center gap-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                              title="View and add comments"
                            >
                              <MessageSquare size={14} className="md:w-4 md:h-4" /> {post.comment_count} Comments
                            </button>
                            <button 
                              onClick={() => handleToggleLike(post.id, post.is_liked)}
                              className={`flex items-center gap-1.5 transition-colors ${
                                post.is_liked ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'
                              }`}
                              title={post.is_liked ? 'Unlike' : 'Like'}
                            >
                              <ThumbsUp size={14} className="md:w-4 md:h-4" fill={post.is_liked ? 'currentColor' : 'none'} /> 
                              {post.like_count} Likes
                            </button>
                          </div>
                          <div className="flex gap-1 md:gap-2 flex-wrap">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag.id} className="bg-indigo-50 text-indigo-600 px-2 md:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                #{tag.name}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="bg-gray-100 text-gray-500 px-2 md:px-3 py-1 rounded-full text-[10px] font-bold">
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

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={closePostModal}
          onToggleLike={handleToggleLike}
          comments={comments || []}
          onAddComment={handleAddComment}
          loadingComments={commentsLoading}
        />
      )}
    </div>
  );
};

export default CommunityForum;