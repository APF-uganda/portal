import { Search } from 'lucide-react';
import { Category, PostStatus } from './types';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: PostStatus | 'all';
  onStatusChange: (status: PostStatus | 'all') => void;
  selectedCategory: string | 'all';
  onCategoryChange: (category: string | 'all') => void;
  categories: Category[];
  categoriesLoading?: boolean;
}

const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  categories,
  categoriesLoading = false,
}: FilterBarProps) => {
  return (
    <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 flex flex-col gap-3 md:gap-4 shadow-sm">
      <div className="w-full relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="md:w-[18px] md:h-[18px] text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search posts by title, content, or author..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Status:</span>
          <select 
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as PostStatus | 'all')}
            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors min-w-0 flex-1"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="reported">Reported</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Category:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={categoriesLoading}
            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-0 flex-1"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;