import { useState } from 'react';
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

// Import images
import chairImage from '../../assets/images/landingPage-image/chair.jpg';
import connectImage from '../../assets/images/landingPage-image/connect.jpg';
import eventImage from '../../assets/images/landingPage-image/event1.jpg';
import newsImage from '../../assets/images/landingPage-image/news1.webp';

const PostDetailPage = () => {
  const { id } = useParams();
  
  // Mock post database - matches ForumPage posts
  const postsDatabase = {
    1: {
      id: 1,
      title: 'Understanding Your APF Membership Benefits',
      subtitle: 'Dive deep into the full spectrum of benefits available with your APF membership. From exclusive resources and networking opportunities to professional development tools, this guide will help you maximize your membership value.',
      content: `As a member of the Accountancy Practitioners Forum (APF), you have access to a comprehensive suite of benefits designed to support your professional growth and development. This guide will walk you through all the advantages available to you.

## Exclusive Resources and Tools

Your APF membership provides access to a wealth of exclusive resources that can enhance your professional practice:

**Professional Development Library**: Access to over 500 technical publications, research papers, and industry reports that keep you updated on the latest accounting standards and practices.

**CPD Training Programs**: Structured continuing professional development courses that help you maintain your professional certifications and stay current with industry requirements.

**Technical Support Hotline**: Direct access to our team of technical experts who can provide guidance on complex accounting issues and regulatory compliance matters.

## Networking Opportunities

One of the most valuable aspects of APF membership is the networking opportunities available:

**Annual Conference**: Our flagship event brings together over 1,000 accounting professionals for three days of learning, networking, and professional development.

**Regional Chapter Events**: Local meetups and seminars held throughout the year in major cities across the country.

**Online Community Forum**: Connect with fellow practitioners, ask questions, and share insights through our digital platform.

## Career Development Support

APF is committed to supporting your career advancement:

**Job Board Access**: Exclusive access to accounting positions from top firms and organizations.

**Mentorship Program**: Connect with experienced practitioners who can provide guidance and career advice.

**Professional Certification Support**: Resources and study materials for various accounting certifications.

## Conclusion

Your APF membership is an investment in your professional future. Take advantage of these benefits to maximize your potential and advance your career in the accounting profession.`,
      author: 'Alice Wonderland',
      authorInitials: 'AW',
      authorRole: 'Senior Member Relations Manager',
      category: 'Announcements',
      createdAt: '2024-01-15T08:30:00Z',
      readTime: '6 min read',
      views: 1289,
      likes: 32,
      replies: 124
    },
    2: {
      id: 2,
      title: 'Idea: Dark Mode Option for the APF Portal',
      subtitle: 'Many modern applications offer a dark mode for better eye comfort, especially during nighttime use. Would the APF team consider implementing a dark mode option for the portal?',
      content: `As someone who spends long hours working on the APF portal, especially during evening hours, I've been thinking about how we could improve the user experience for members who work late or prefer darker interfaces.

## The Benefits of Dark Mode

Dark mode has become increasingly popular across digital platforms, and for good reason:

**Reduced Eye Strain**: Dark backgrounds with light text can be easier on the eyes, particularly in low-light environments or during extended screen time.

**Battery Conservation**: On devices with OLED screens, dark mode can help conserve battery life by using fewer pixels that emit light.

**Professional Preference**: Many professionals in technical fields prefer dark interfaces as they're often easier to read and less distracting.

## Implementation Considerations

While implementing dark mode might seem straightforward, there are several factors to consider:

**Design Consistency**: Any dark mode implementation should maintain the professional appearance and branding of the APF portal while ensuring all elements remain clearly visible and accessible.

**User Preference Storage**: The system should remember each user's preference and apply it consistently across all portal sections.

**Accessibility Compliance**: Dark mode must meet accessibility standards and provide sufficient contrast ratios for users with visual impairments.

## Proposed Features

Here's what I envision for an APF portal dark mode:

- Toggle switch in user settings or header
- Automatic switching based on system preferences
- Consistent styling across all portal sections
- Maintained readability for all text and data

## Community Feedback

I'd love to hear from other members about this idea. Would you use a dark mode option? What features would be most important to you?

Let's discuss this in the comments below and see if we can build support for this enhancement.`,
      author: 'Evanescence Star',
      authorInitials: 'ES',
      authorRole: 'UX Designer & APF Member',
      category: 'Suggestions',
      createdAt: '2024-01-08T16:45:00Z',
      readTime: '4 min read',
      views: 2100,
      likes: 55,
      replies: 210
    },
    3: {
      id: 3,
      title: 'Seeking Advice: Best Practices for Project Management',
      subtitle: 'I\'m new to leading projects within APF and would appreciate advice from experienced members. What are some essential tools or methodologies you recommend for effective project management?',
      content: `As a newly appointed project lead for several APF initiatives, I'm reaching out to our experienced community for guidance on project management best practices, particularly in the context of professional accounting organizations.

## My Current Challenge

I've recently been tasked with leading multiple projects simultaneously, including:

- Updating our member onboarding process
- Coordinating the annual conference planning
- Managing the implementation of new CPD tracking systems

While I have strong technical skills, project management is relatively new to me, and I want to ensure I'm using the most effective approaches.

## Areas Where I Need Guidance

**Project Planning and Scope Management**: How do you effectively define project scope and prevent scope creep while remaining flexible to necessary changes?

**Team Coordination**: What are the best practices for coordinating team members who may be volunteers, part-time contributors, or have varying levels of availability?

**Communication Strategies**: How do you maintain clear communication with stakeholders who have different technical backgrounds and involvement levels?

**Risk Management**: What are common risks in APF-type projects, and how do you proactively address them?

## Tools and Methodologies

I'm particularly interested in hearing about:

- Project management software that works well for professional organizations
- Methodologies (Agile, Waterfall, hybrid approaches) that you've found effective
- Communication tools and practices that keep everyone aligned
- Reporting and tracking methods that provide visibility without being burdensome

## What I've Tried So Far

Currently, I'm using basic spreadsheets and email for coordination, but I suspect there are more efficient approaches. I've been reading about various project management methodologies, but I'd value real-world experience from fellow APF members.

## Request for Mentorship

If any experienced project managers in our community would be willing to provide occasional guidance or mentorship, I would be incredibly grateful. Sometimes having someone to bounce ideas off or review approaches can make all the difference.

Thank you in advance for any advice, recommendations, or insights you can share!`,
      author: 'Bob The Builder',
      authorInitials: 'BT',
      authorRole: 'Project Coordinator',
      category: 'General Discussion',
      createdAt: '2024-01-14T11:20:00Z',
      readTime: '5 min read',
      views: 954,
      likes: 18,
      replies: 87
    }
  };

  // Get the specific post based on ID, fallback to post 1 if not found
  const post = postsDatabase[parseInt(id || '1') as keyof typeof postsDatabase] || postsDatabase[1];
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Comments database for each post
  const commentsDatabase = {
    1: [
      {
        id: 1,
        author: 'Sandra Lyton',
        authorInitials: 'SL',
        content: 'This is exactly what I needed! I\'ve been a member for two years but wasn\'t aware of all these benefits. The mentorship program sounds particularly valuable.',
        createdAt: '2024-01-15T10:20:00Z',
        likes: 15,
        isLiked: false,
        replies: [
          {
            id: 11,
            author: 'Alice Wonderland',
            authorInitials: 'AW',
            content: 'I\'m so glad this was helpful! The mentorship program has been a game-changer for many of our members. Feel free to reach out if you need help getting started.',
            createdAt: '2024-01-15T11:10:00Z',
            likes: 8,
            isLiked: false
          }
        ]
      },
      {
        id: 2,
        author: 'Michael Jordan',
        authorInitials: 'MJ',
        content: 'The CPD training programs have been invaluable for maintaining my certifications. The quality of content is consistently high.',
        createdAt: '2024-01-15T14:45:00Z',
        likes: 12,
        isLiked: true,
        replies: []
      }
    ],
    2: [
      {
        id: 1,
        author: 'Bob The Builder',
        authorInitials: 'BT',
        content: 'I absolutely support this idea! As someone who works late hours frequently, dark mode would be a huge improvement for eye comfort.',
        createdAt: '2024-01-08T18:20:00Z',
        likes: 23,
        isLiked: false,
        replies: [
          {
            id: 11,
            author: 'Evanescence Star',
            authorInitials: 'ES',
            content: 'Thanks for the support! It\'s great to hear from other members who would benefit from this feature.',
            createdAt: '2024-01-08T19:15:00Z',
            likes: 7,
            isLiked: false
          }
        ]
      },
      {
        id: 2,
        author: 'Alice Wonderland',
        authorInitials: 'AW',
        content: 'This is a fantastic suggestion! From a UX perspective, offering both light and dark modes is becoming a standard expectation. I\'d love to see this implemented.',
        createdAt: '2024-01-09T09:30:00Z',
        likes: 18,
        isLiked: true,
        replies: []
      },
      {
        id: 3,
        author: 'Sandra Lyton',
        authorInitials: 'SL',
        content: 'Count me in as another supporter! I use dark mode on all my other professional tools, and it would be great to have consistency across platforms.',
        createdAt: '2024-01-09T15:45:00Z',
        likes: 14,
        isLiked: false,
        replies: []
      }
    ],
    3: [
      {
        id: 1,
        author: 'Alice Wonderland',
        authorInitials: 'AW',
        content: 'Great question! I\'ve been managing projects for APF for several years. I\'d recommend starting with a hybrid approach - use Agile principles for flexibility but maintain some structure for stakeholder communication.',
        createdAt: '2024-01-14T13:20:00Z',
        likes: 25,
        isLiked: false,
        replies: [
          {
            id: 11,
            author: 'Bob The Builder',
            authorInitials: 'BT',
            content: 'Thank you Alice! That hybrid approach sounds practical. Do you have any specific tools you\'d recommend for tracking progress?',
            createdAt: '2024-01-14T14:10:00Z',
            likes: 8,
            isLiked: false
          }
        ]
      },
      {
        id: 2,
        author: 'Michael Jordan',
        authorInitials: 'MJ',
        content: 'For APF projects, I\'ve found that Trello works well for smaller teams, while Asana is better for larger, more complex initiatives. The key is keeping stakeholders informed without overwhelming them with details.',
        createdAt: '2024-01-14T16:45:00Z',
        likes: 19,
        isLiked: true,
        replies: []
      }
    ]
  };

  const comments = commentsDatabase[post.id as keyof typeof commentsDatabase] || [];

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
  ].filter(relatedPost => relatedPost.id !== post.id); // Don't show current post in related

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Post Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              {/* Category Badge */}
              <div className="p-6 pb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
                  {post.category}
                </span>
                
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {post.subtitle}
                </p>

                {/* Author and Meta */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {post.authorInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{post.author}</div>
                      <div className="text-sm text-gray-500">{post.authorRole}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
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
                    <span>{comments.length}</span>
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
                  {post.content.split('\n').map((paragraph, index) => {
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
                  <div>Category: {post.category}</div>
                  <div>Author: {post.author}</div>
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
                      <div className="font-medium text-gray-900">{comments.length}</div>
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
      </div>
    </DashboardLayout>
  );
};

export default PostDetailPage;