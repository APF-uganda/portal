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
  ThumbsUp
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { getForumPostDetail } from '../../services/forum.service';

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
      }
      setLoading(false);
    };

    loadPost();
  }, [id]);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  type Reply = {
    id: number;
    author: string;
    authorInitials: string;
    content: string;
    createdAt: string;
    likes: number;
  };

  type Comment = {
    id: number;
    author: string;
    authorInitials: string;
    content: string;
    createdAt: string;
    likes: number;
    replies?: Reply[];
  };

  const comments: Comment[] = [];

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
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (replyText.trim()) {
      console.log('Reply to comment', commentId, ':', replyText);
      setReplyText('');
      setReplyingTo(null);
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
    if (post?.like_count) {
      setLikeCount(post.like_count);
    }
  }, [post]);

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
                    <span>{post.comment_count ?? comments.length}</span>
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

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    SL
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

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {comment.authorInitials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                          <span className="text-sm text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                        
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#60308C] transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.likes}</span>
                          </button>
                          <button 
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-sm text-gray-500 hover:text-[#60308C] transition-colors"
                          >
                            Reply
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-4">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                SL
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={`Reply to ${comment.author}...`}
                                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => setReplyingTo(null)}
                                    className="px-4 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={!replyText.trim()}
                                    className="px-4 py-1 bg-[#60308C] text-white text-sm rounded hover:bg-[#60308C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-8 h-8 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                  {reply.authorInitials}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-gray-900 text-sm">{reply.author}</h5>
                                    <span className="text-xs text-gray-500">{formatRelativeTime(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
                                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#60308C] transition-colors">
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{reply.likes}</span>
                                  </button>
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
                      <div className="font-medium text-gray-900">{post.comment_count ?? comments.length}</div>
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
