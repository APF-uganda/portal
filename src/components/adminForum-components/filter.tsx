const FilterBar = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center mb-6">
      <div className="flex-1 relative">
        <input 
          type="text" 
          placeholder="Search posts..." 
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Status:</label>
        <select className="border rounded-md px-3 py-2 outline-none"><option>All</option></select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Tag:</label>
        <select className="border rounded-md px-3 py-2 outline-none"><option>All</option></select>
      </div>
    </div>
  );
  export default FilterBar;