import { useState } from 'react';
import { 
  FileText, CheckCircle, Edit3, Clock, 
  Search, Plus, Download, Eye, Trash2, Image as ImageIcon 
} from 'lucide-react';
import { NewsArticle, ArticleStatus } from '../../components/createcms-components/newstypes';
import { StatCard } from '../../components/createcms-components/statCard';
import { StatusBadge } from '../../components/createcms-components/status';
import { ArticleForm } from '../../components/createcms-components/article';

const INITIAL_DATA: NewsArticle[] = [
  { id: '1', title: 'New Community Guidelines Released', subtitle: 'Updated financial community standards for 2026', category: 'News', status: 'Published', publishDate: '2026-01-24', views: '1,248' },
  { id: '2', title: 'Upcoming Feature: Dark Mode Support', subtitle: 'New interface theme coming next month', category: 'News', status: 'Draft', publishDate: null, views: '—' },
];

const NewsManagement = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | undefined>();
  const [filter, setFilter] = useState<ArticleStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const handleSave = (data: Partial<NewsArticle>) => {
    if (selectedArticle) {
      setArticles(articles.map(a => a.id === selectedArticle.id ? { ...a, ...data } as NewsArticle : a));
    } else {
      const newArt: NewsArticle = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        publishDate: data.status === 'Published' ? new Date().toISOString().split('T')[0] : null,
        views: '0'
      } as NewsArticle;
      setArticles([newArt, ...articles]);
    }
    setIsEditing(false);
  };

  const filteredArticles = articles.filter(a => {
    const matchesFilter = filter === 'All' || a.status === filter;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isEditing) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <ArticleForm initialData={selectedArticle} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsroom Manager</h1>
          <p className="text-gray-500 text-sm">Create, edit, and manage your platform articles</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
            <Download size={18} /> Export CSV
          </button>
          <button onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition text-sm font-semibold shadow-sm">
            <Plus size={18} /> Create Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total" value={articles.length.toString()} change="10%" isUp={true} Icon={FileText} />
        <StatCard title="Published" value={articles.filter(a=>a.status==='Published').length.toString()} change="12%" isUp={true} Icon={CheckCircle} />
        <StatCard title="Drafts" value={articles.filter(a=>a.status==='Draft').length.toString()} change="2%" isUp={false} Icon={Edit3} />
        <StatCard title="Scheduled" value={articles.filter(a=>a.status==='Scheduled').length.toString()} change="5%" isUp={true} Icon={Clock} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 bg-white">
          <div className="flex bg-gray-100/80 p-1 rounded-xl">
            {['All', 'Published', 'Draft', 'Scheduled'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`px-5 py-1.5 text-xs font-bold rounded-lg transition ${filter === t ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                <th className="px-6 py-4">Article Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                            {/* Small Image Thumbnail */}
                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                {article.imageUrl ? (
                                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={16} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="max-w-[300px]">
                                <div className="font-bold text-gray-900 text-sm truncate">{article.title}</div>
                                <div className="text-[11px] text-gray-500 truncate">{article.subtitle}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={article.status} /></td>
                    <td className="px-6 py-4">
                    <span className="text-[11px] font-bold px-2 py-1 bg-purple-50 rounded text-purple-600 uppercase">{article.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 text-gray-400">
                        <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="p-2 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"><Edit3 size={18} /></button>
                        <button className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"><Eye size={18} /></button>
                        <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition"><Trash2 size={18} /></button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {filteredArticles.length === 0 && (
                <div className="py-20 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-gray-300" size={24} />
                    </div>
                    <p className="text-gray-500 font-medium">No articles found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NewsManagement;