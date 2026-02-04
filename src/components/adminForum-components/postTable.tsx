
import { ForumPost, PostStatus } from './types';
import { Eye, Edit3, Trash2 } from 'lucide-react';

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const styles: Record<PostStatus, string> = {
    Published: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Draft: "bg-gray-50 text-gray-400 border-gray-100",
    Reported: "bg-red-50 text-red-600 border-red-100",
  };
  
  return (
    <span className={`px-3 py-1 rounded-md text-[10px] font-bold border ${styles[status]}`}>
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
            <th className="px-6 py-4 font-semibold text-center">Status</th>
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
              
             
              <td className="px-6 py-5 max-w-[280px]">
                <div className="font-bold text-black-100 text-sm leading-tight line-clamp-2 mb-1">
                  {post.title}
                </div>
                <div className="text-[11px] text-gray-400 whitespace-nowrap">
                  Category: {post.category} • {post.comments} comments
                </div>
              </td>

              
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {post.authorInitials}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
                </div>
              </td>

              
              <td className="px-6 py-5">
                <div className="flex flex-col gap-1 items-start">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-6 py-5 text-center">
                <StatusBadge status={post.status} />
              </td>
              
              <td className="px-6 py-5 text-[12px] text-gray-500 font-medium whitespace-nowrap">
                {post.date}
              </td>

             
              <td className="px-6 py-5">
                <div className="flex justify-center items-center gap-5 text-black-100">
                  <button className="hover:text-indigo-600 transition-colors" title="View">
                    <Eye size={15} strokeWidth={2.5} />
                  </button>
                  <button className="hover:text-indigo-600 transition-colors" title="Edit">
                    <Edit3 size={15} strokeWidth={2.5} />
                  </button>
                  <button className="hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={15} strokeWidth={2.5} />
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