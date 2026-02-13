import React, { useState, useRef } from 'react';
import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { NewsArticle, Category, ArticleStatus } from '../../components/createcms-components/newstypes';

interface ArticleFormProps {
  initialData?: Partial<NewsArticle>;
  onSave: (data: Partial<NewsArticle>) => void;
  onCancel: () => void;
}

export const ArticleForm = ({ initialData, onSave, onCancel }: ArticleFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSave({
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      category: formData.get('category') as Category,
      status: formData.get('status') as ArticleStatus,
      imageUrl: imagePreview, 
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onCancel} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
        <ArrowLeft size={18} /> Back to Newsroom
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {initialData?.id ? 'Edit Article' : 'Create New Article'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Cover Image (Optional)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center overflow-hidden hover:border-purple-400 transition bg-gray-50"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <p className="text-white text-sm font-medium">Change Image</p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(undefined); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto p-3 bg-white rounded-full shadow-sm w-fit mb-2">
                    <ImageIcon className="text-gray-400" size={24} />
                  </div>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Article Title</label>
              <input 
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
              <textarea 
                name="subtitle"
                defaultValue={initialData?.subtitle}
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">Discard</button>
            <button type="submit" className="flex items-center gap-2 px-8 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition">
              <Save size={18} /> Save Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};