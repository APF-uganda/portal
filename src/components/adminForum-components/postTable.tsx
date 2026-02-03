
import { ForumPost, PostStatus } from './types';

import { Eye, Edit3, Trash2 } from 'lucide-react';

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const styles: Record<PostStatus, string> = {
    Published: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Draft: "bg-gray-50 text-gray-500 border-gray-100",
    Reported: "bg-red-50 text-red-600 border-red-100",
  };
  
  return (
    <span className={`px-3 py-1 rounded-md text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export const PostTable = ({ posts }: { posts: ForumPost[] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-50">
      <h2 className="text-xl font-bold text-gray-800">All Forum Posts</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 font-semibold">Post Title</th>
            <th className="px-6 py-4 font-semibold">Author</th>
            <th className="px-6 py-4 font-semibold">Tags</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-5">
                <div className="font-bold text-gray-800 mb-0.5">{post.title}</div>
                <div className="text-xs text-gray-400">Category: {post.category} • {post.comments} comments</div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px] font-bold">
                    {post.authorInitials}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex gap-1.5">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-medium">#{tag}</span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-5"><StatusBadge status={post.status} /></td>
              <td className="px-6 py-5 text-sm text-gray-500 font-medium">{post.date}</td>
              <td className="px-6 py-5">
               
                <div className="flex justify-center gap-4 text-gray-500">
                  <button className="hover:text-indigo-600 transition-colors">
                    <Eye size={18} />
                  </button>
                  <button className="hover:text-indigo-600 transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button className="hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);