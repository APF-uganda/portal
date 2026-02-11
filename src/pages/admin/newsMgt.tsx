
import { 
  FileText, CheckCircle, Edit3, Clock, 
  Search, Filter, Download, Plus, 
  Eye, Trash2,  
} from 'lucide-react';
import { StatCard } from '../../components/createcms-components/statCard';
import { NewsArticle, ArticleStatus } from '../../components/createcms-components/newstypes';






const articles: NewsArticle[] = [
  { id: '1', title: 'New Community Guidelines Released', subtitle: 'Updated financial community standards for 2026', category: 'News', status: 'Published', publishDate: '2026-01-24', views: '1,248' },
  { id: '2', title: 'Upcoming Feature: Dark Mode Support', subtitle: 'New interface theme coming next month', category: 'News', status: 'Draft', publishDate: null, views: '—' },

];

const NewsManagement = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">News Management</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition">
            <Download size={18} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition">
            <Plus size={18} /> Create News
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Articles" value="142" change="12%" isUp={true} Icon={FileText} />
        <StatCard title="Published" value="89" change="8%" isUp={true} Icon={CheckCircle} />
        <StatCard title="Drafts" value="24" change="5%" isUp={false} Icon={Edit3} />
        <StatCard title="Scheduled" value="29" change="18%" isUp={true} Icon={Clock} />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold mb-1">News Articles</h2>
          <p className="text-sm text-gray-500 mb-4">Manage all news articles and announcements published on the platform</p>
          
          {/* Filters */}
          <div className="flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
              <Filter size={18} /> More Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4"><input type="checkbox" className="rounded" /></th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Publish Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Views</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.subtitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{article.publishDate || '—'}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{article.views}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button className="hover:text-purple-600"><Edit3 size={18} /></button>
                      <button className="hover:text-blue-600"><Eye size={18} /></button>
                      <button className="hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ArticleStatus }) => {
  const themes = {
    Published: "bg-green-50 text-green-600 border-green-100",
    Draft: "bg-orange-50 text-orange-600 border-orange-100",
    Scheduled: "bg-blue-50 text-blue-600 border-blue-100",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${themes[status]}`}>
      {status}
    </span>
  );
};

export default NewsManagement;