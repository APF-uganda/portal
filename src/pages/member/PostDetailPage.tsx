import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Heart, 
  MessageSquare, 
  Eye, 
  Share2,
  Send,
  Clock,
  Reply as ReplyIcon
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { createForumComment, getForumPostDetail, likeForumPost, unlikeForumPost, getForumComments } from '../../services/forum.service';

// Import images
import chairImage from '../../assets/images/landingPage-image/chair.jpg';
import connectImage from '../../assets/images/landingPage-image/connect.jpg';
import eventImage from '../../assets/images/landingPage-image/event1.jpg';
import newsImage from '../../assets/images/landingPage-image/news1.webp';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const postId = Number(id);
    if (!Number.isFinite(postId)) {
      setLoadError('Invalid post id');
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      setLoadError(null);
      const data = await getForumPostDetail(postId);
      if (!data) {
        setLoadError('Failed to load post');
      } else {
        setPost(data);
        // Load comments
        const commentsData = await getForumComments(postId);
        setComments(commentsData || []);
      }
      setLoading(false);
    };

    loadPost();
  }, [id]);

  // Related content
  const relatedPosts = [
    {
      id: 2,
      title: 'APF Portal Dark Mode Suggestion',
      category: 'Suggestions',
      image: connectImage
    },
    {
      id: 3,
      title: 'Project Management Best Practices',
      category: 'General Discussion',
      image: eventImage
    },
    {
      id: 1,
      title: 'Understanding APF Membership Benefits',
      category: 'Announcements',
      image: newsImage
    },
    {
      id: 4,
      title: 'Upcoming CPD Training Sessions',
      category: 'Professional Development',
      image: chairImage
    }
  ].filter(relatedPost => relatedPost.id !== post?.id); 
  const handleLike = async () => {
    if (!post?.id) return;
    if (isLiked) {
      const previousCount = likeCount;
      setIsLiked(false);
      setLikeCount(Math.max(0, previousCount - 1));
      const updated = await unlikeForumPost(post.id);
      if (updated !== null) {
        setLikeCount(updated);
        const refreshed = await getForumPostDetail(post.id);
        if (refreshed) {
          setPost(refreshed);
          setIsLiked(Boolean(refreshed.is_liked));
          setLikeCount(refreshed.like_count || updated || 0);
        }
      } else {
        // revert on failure
        const refreshed = await getForumPostDetail(post.id);
        if (refreshed) {
          setPost(refreshed);
          setIsLiked(Boolean(refreshed.is_liked));
          setLikeCount(refreshed.like_count || 0);
        } else {
          setIsLiked(true);
          setLikeCount(previousCount);
        }
      }
    } else {
      const previousCount = likeCount;
      setIsLiked(true);
      setLikeCount(previousCount + 1);
      const updated = await likeForumPost(post.id);
      if (updated !== null) {
        setLikeCount(updated);
        const refreshed = await getForumPostDetail(post.id);
        if (refreshed) {
          setPost(refreshed);
          setIsLiked(Boolean(refreshed.is_liked));
          setLikeCount(refreshed.like_count || updated || 0);
        }
      } else {
        // revert on failure
        const refreshed = await getForumPostDetail(post.id);
        if (refreshed) {
          setPost(refreshed);
          setIsLiked(Boolean(refreshed.is_liked));
          setLikeCount(refreshed.like_count || 0);
        } else {
          setIsLiked(false);
          setLikeCount(previousCount);
        }
      }
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const contentLines = useMemo(() => {
    if (!post?.content) return [];
    return String(post.content).split('\n');
  }, [post]);

  useEffect(() => {
    if (post) {
      setLikeCount(post.like_count || 0);
      setIsLiked(Boolean(post.is_liked));
    }
  }, [post]);

  const handleCommentSubmit = async (e: React.FormEvent, parentId?: number) => {
    e.preventDefault();
    const content = parentId ? replyText.trim() : newComment.trim();
    if (!content || !post?.id || isSubmitting) return;
    
    setIsSubmitting(true);
    const created = await createForumComment(post.id, content, parentId);
    if (created) {
      if (parentId) {
        setReplyText('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
      // Refresh comments
      const updated = await getForumComments(post.id);
      setComments(updated || []);
    } else {
      alert('Failed to add comment. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // Organize comments into parent and replies
  const topLevelComments = comments.filter(c => !c.parent);
  const getReplies = (commentId: number) => comments.filter(c => c.parent === commentId);

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <DashboardLayout
      headerContent={
        <Link 
          to="/forum" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#60308C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community Forum
        </Link>
      }
    >
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-600">
            Loading post...
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-red-600">
            {loadError}
          </div>
        ) : !post ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-600">
            Post not found.
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Post Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              {/* Category Badge */}
              <div className="p-6 pb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
                  {post.category?.name || 'General'}
                </span>
                
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>
                
                {/* Subtitle */}
                {post.content && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {String(post.content).split('\n')[0]}
                  </p>
                )}

                {/* Author and Meta */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {post.author?.initials || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {post.author?.full_name || post.author?.email || 'Member'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatRelativeTime(post.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatRelativeTime(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views_count ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                  <button 
                    type="button"
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comment_count ?? 0}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

            {/* Post Content */}
            <div className="p-6 pt-0">
              <div className="prose prose-lg max-w-none">
                  {contentLines.map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={index} className="font-semibold text-gray-900 mb-3">{paragraph.replace(/\*\*/g, '')}</p>;
                    }
                    if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                      return <blockquote key={index} className="border-l-4 border-purple-500 pl-4 italic text-gray-700 my-6">{paragraph}</blockquote>;
                    }
                    if (paragraph.trim() === '') {
                      return <br key={index} />;
                    }
                    return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>;
                  })}
                </div>
              </div>
            </div>

            {/* Comment Submit */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Add a Comment
              </h2>
              <form onSubmit={handleCommentSubmit}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {post?.author?.initials || 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-[#60308C] text-white rounded-lg hover:bg-[#60308C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
              </h2>
              
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="space-y-6">
                  {topLevelComments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {comment.author?.initials || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">
                                {comment.author?.full_name || comment.author?.email || 'Member'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatCommentDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                          <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#60308C] mt-2 transition-colors"
                          >
                            <ReplyIcon className="w-4 h-4" />
                            Reply
                          </button>
                          
                          {/* Reply Form */}
                          {replyingTo === comment.id && (
                            <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="mt-4">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                  {post?.author?.initials || 'U'}
                                </div>
                                <div className="flex-1">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                                    rows={2}
                                    autoFocus
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button
                                      type="button"
                                      onClick={handleCancelReply}
                                      className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={!replyText.trim() || isSubmitting}
                                      className="flex items-center gap-1 px-4 py-1.5 text-sm bg-[#60308C] text-white rounded-lg hover:bg-[#60308C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Send className="w-3 h-3" />
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          )}
                          
                          {/* Replies */}
                          {getReplies(comment.id).length > 0 && (
                            <div className="ml-6 mt-4 space-y-4">
                              {getReplies(comment.id).map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                  <div className="w-8 h-8 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                    {reply.author?.initials || 'U'}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900 text-sm">
                                          {reply.author?.full_name || reply.author?.email || 'Member'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {formatCommentDate(reply.created_at)}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-sm">{reply.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Introduction */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Introduction</h3>
                <p className="text-sm text-gray-600 mb-4">
                  "{post.title}"
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Category: {post.category?.name || 'General'}</div>
                  <div>Author: {post.author?.full_name || post.author?.email || 'Member'}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{post.views}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{likeCount}</div>
                      <div className="text-xs text-gray-500">Likes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{post.comment_count ?? 0}</div>
                      <div className="text-xs text-gray-500">Comments</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">APF</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Community</span>
                  <span className="px-3 py-1 bg-[#D689FF]/20 text-[#60308C] text-sm rounded-full">Professional</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">Accounting</span>
                </div>
              </div>

              {/* Related Contents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Related Contents</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      to={`/forum/post/${relatedPost.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm group-hover:text-[#60308C] transition-colors line-clamp-2 mb-1">
                            {relatedPost.title}
                          </h4>
                          <span className="text-xs text-gray-500">{relatedPost.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PostDetailPage;
