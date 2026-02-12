
import React from 'react';
import { Save, X, ArrowLeft } from 'lucide-react';
import { NewsArticle, Category, ArticleStatus } from '../../components/createcms-components/newstypes';

interface ArticleFormProps {
  initialData?: Partial<NewsArticle>;
  onSave: (data: Partial<NewsArticle>) => void;
  onCancel: () => void;
}

export const ArticleForm = ({ initialData, onSave, onCancel }: ArticleFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSave({
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      category: formData.get('category') as Category,
      status: formData.get('status') as ArticleStatus,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
        <ArrowLeft size={18} /> Back to CreateNews
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData?.id ? 'Edit Article' : 'Create New Article'}
            </h2>
            <p className="text-gray-500">Fill in the details below to update the community.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Article Title</label>
              <input 
                name="title"
                defaultValue={initialData?.title}
                required
                placeholder="e.g., Q1 Financial Growth Updates"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle / Excerpt</label>
              <textarea 
                name="subtitle"
                defaultValue={initialData?.subtitle}
                rows={3}
                placeholder="A brief summary for the news feed..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select name="category" defaultValue={initialData?.category || 'News'} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white">
                  <option value="News">News</option>
                  <option value="Update">Update</option>
                  <option value="Announcement">Announcement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select name="status" defaultValue={initialData?.status || 'Draft'} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white">
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
            <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
              Discard
            </button>
            <button type="submit" className="flex items-center gap-2 px-8 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition shadow-md shadow-purple-200">
              <Save size={18} /> {initialData?.id ? 'Update' : 'Publish'} Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};