
import { ForumPost } from './types';
import { Eye, Edit3, Trash2, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

export const AdminPostCard = ({ post }: { post: ForumPost }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 hover:shadow-md transition-shadow">
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold">
            {post.authorInitials}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight">{post.authorName}</h4>
            <p className="text-xs text-gray-400">{post.date}</p>
          </div>
        </div>

        {/* Admin Actions (From Image 1) */}
        <div className="flex gap-4 text-gray-400 bg-gray-50 p-2 rounded-lg">
          <button className="hover:text-indigo-600 transition-colors"><Eye size={18} /></button>
          <button className="hover:text-indigo-600 transition-colors"><Edit3 size={18} /></button>
          <button className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
        </div>
      </div>

      {/* Content Section (From Image 2) */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          Dive deep into the full spectrum of benefits with your APF membership. From exclusive resources...
        </p>
      </div>

      {/* Footer: Stats + Tags (From Image 2) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-50 gap-4">
        <div className="flex gap-5 text-gray-400 text-xs font-medium">
          <span className="flex items-center gap-1.5"><MessageSquare size={16} /> {post.comments} Replies</span>
          <span className="flex items-center gap-1.5"><ThumbsUp size={16} /> 32 Likes</span>
          <span className="flex items-center gap-1.5"><Share2 size={16} /> 1,289 Views</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
          {post.status === 'Reported' && (
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Reported
            </span>
          )}
        </div>
      </div>
    </div>
  );
};