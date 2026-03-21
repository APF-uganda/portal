import { useState, useEffect } from 'react';
import { Category, PostStatus, CreatePostRequest } from '../adminForum-components/types';

interface CreatePostFormProps {
  categories: Category[];
  tags: any[]; // Kept for prop compatibility but unused in UI
  onSubmit: (data: CreatePostRequest) => Promise<void>;
  loading?: boolean;
  initialData?: any;
  error?: string | null;
}

const CreatePostForm = ({ 
  categories, 
  onSubmit, 
  loading = false, 
  initialData, 
  error = null 
}: CreatePostFormProps) => {
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    status: 'draft',
    category_id: undefined,
    tag_ids: [],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ==========================================
  // SYNC DATA WHEN EDITING
  // ==========================================
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        status: initialData.status || 'draft',
        category_id: initialData.category?.id || initialData.category_id,
        tag_ids: initialData.tags?.map((t: any) => t.id) || initialData.tag_ids || [],
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must not exceed 255 characters';
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      errors.content = 'Content must be at least 20 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Submit with existing tag_ids from state (allows keeping tags on edit without editing them)
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-3 rounded-xl text-sm md:text-base">
          {error}
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
          Post Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (validationErrors.title) {
              setValidationErrors({ ...validationErrors, title: '' });
            }
          }}
          className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] transition-all text-sm md:text-base ${
            validationErrors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter a descriptive title for your post..."
          disabled={loading}
        />
        {validationErrors.title && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          {formData.title.length}/255 characters
        </p>
      </div>

      {/* Content Field */}
      <div>
        <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">
          Post Content *
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
            if (validationErrors.content) {
              setValidationErrors({ ...validationErrors, content: '' });
            }
          }}
          rows={8}
          className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] transition-all resize-none text-sm md:text-base ${
            validationErrors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write your post content here..."
          disabled={loading}
        />
        {validationErrors.content && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.content}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          {formData.content.length} characters (minimum 20 required)
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
          Category (Optional)
        </label>
        <select
          id="category"
          value={formData.category_id || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            category_id: e.target.value ? Number(e.target.value) : undefined 
          })}
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] transition-all text-sm md:text-base"
          disabled={loading}
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.post_count || 0} posts)
            </option>
          ))}
        </select>
      </div>

      {/* Status Selection */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Post Status *
        </label>
        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={formData.status === 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
              className="w-4 h-4 text-[#5C32A3] focus:ring-[#5C32A3] mt-0.5 flex-shrink-0"
              disabled={loading}
            />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-gray-700 block">Draft</span>
              <span className="text-gray-400 text-xs">Save for later editing</span>
            </div>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="published"
              checked={formData.status === 'published'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
              className="w-4 h-4 text-[#5C32A3] focus:ring-[#5C32A3] mt-0.5 flex-shrink-0"
              disabled={loading}
            />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-gray-700 block">Published</span>
              <span className="text-gray-400 text-xs">Visible to all users</span>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5C32A3] text-white px-4 md:px-6 py-3 rounded-xl font-bold hover:bg-[#4A2885] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          {loading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={loading}
          className="w-full px-4 md:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;