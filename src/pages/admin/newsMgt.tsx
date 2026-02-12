
import { useState } from 'react';
import { 
  FileText, CheckCircle, Edit3, Clock, 
  Search, Plus, Download, Eye, Trash2 
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

  // Actions
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
        <ArticleForm 
          initialData={selectedArticle} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Newsroom Manager</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={() => { setSelectedArticle(undefined); setIsEditing(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
          >
            <Plus size={18} /> Create Article
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total" value={articles.length.toString()} change="10%" isUp={true} Icon={FileText} />
        <StatCard title="Published" value={articles.filter(a=>a.status==='Published').length.toString()} change="12%" isUp={true} Icon={CheckCircle} />
        <StatCard title="Drafts" value={articles.filter(a=>a.status==='Draft').length.toString()} change="2%" isUp={false} Icon={Edit3} />
        <StatCard title="Scheduled" value={articles.filter(a=>a.status==='Scheduled').length.toString()} change="5%" isUp={true} Icon={Clock} />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['All', 'Published', 'Draft', 'Scheduled'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${filter === t ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              placeholder="Search title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Article Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{article.title}</div>
                  <div className="text-xs text-gray-500">{article.subtitle}</div>
                </td>
                <td className="px-6 py-4"><StatusBadge status={article.status} /></td>
                <td className="px-6 py-4">
                   <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">{article.category}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 text-gray-400">
                    <button onClick={() => { setSelectedArticle(article); setIsEditing(true); }} className="hover:text-purple-600 transition"><Edit3 size={18} /></button>
                    <button className="hover:text-blue-600 transition"><Eye size={18} /></button>
                    <button className="hover:text-red-600 transition"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsManagement;