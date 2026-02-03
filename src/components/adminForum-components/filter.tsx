
import { Search } from 'lucide-react';

const FilterBar = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center mb-6 shadow-sm">
      
     
      <div className="flex-1 w-full relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

     
      <div className="flex items-center gap-6 w-full md:w-auto">
        
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500">Status:</span>
          <select className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors">
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Reported</option>
          </select>
        </div>

       
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500">Tag:</span>
          <select className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors">
            <option>All</option>
            <option>Budgeting</option>
            <option>Savings</option>
            <option>Investing</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;