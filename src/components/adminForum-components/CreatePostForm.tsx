import { useState } from 'react';
import { X } from 'lucide-react';
import { Category, Tag, PostStatus, CreatePostRequest } from '../adminForum-components/types';

interface CreatePostFormProps {
  categories: Category[];
  tags: Tag[];
  onSubmit: (data: CreatePostRequest) => Promise<void>;
  loading?: boolean;
  initialData?: any;
  error?: string | null;
}

const CreatePostForm = ({ categories, tags, onSubmit, loading = false, error = null }: CreatePostFormProps) => {
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    status: 'draft',
    category_id: undefined,
    tag_ids: [],
  });

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

    const submitData = {
      ...formData,
      tag_ids: selectedTags.length > 0 ? selectedTags : undefined,
    };

    await onSubmit(submitData);
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const getSelectedTagsData = () => {
    return tags.filter(tag => selectedTags.includes(tag.id));
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
              {category.name} ({category.post_count} posts)
            </option>
          ))}
        </select>
      </div>

      {/* Tag Selection */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Tags (Optional)
        </label>
        
        {/* Selected Tags Display */}
        {getSelectedTagsData().length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-2 mb-3 p-2 md:p-3 bg-gray-50 rounded-lg">
            {getSelectedTagsData().map(tag => (
              <span 
                key={tag.id}
                className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium"
              >
                #{tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                  disabled={loading}
                >
                  <X size={12} className="md:w-[14px] md:h-[14px]" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tag Selection Buttons */}
        <div className="flex flex-wrap gap-1 md:gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                selectedTags.includes(tag.id)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              #{tag.name}
            </button>
          ))}
        </div>
        {tags.length === 0 && (
          <p className="text-gray-400 text-xs md:text-sm">No tags available</p>
        )}
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
          {loading ? 'Creating Post...' : 'Create Post'}
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
