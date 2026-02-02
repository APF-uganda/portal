import React from 'react';
import { Edit3, Check, Plus, Wand2 } from 'lucide-react';

const CustomGenerator: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-2">
        <Edit3 size={20} className="text-[#5E2590]" />
        <h2 className="text-lg font-bold text-slate-800">Custom Report Generator</h2>
      </div>
      <p className="text-sm text-slate-500 mb-8">Create a custom report with specific filters and date ranges. Tailor reports to your exact needs.</p>

      <div className="flex flex-wrap gap-3 mb-8">
        {['Membership', 'Last 30 Days', 'PDF'].map((filter) => (
          <div key={filter} className="flex items-center gap-2 bg-indigo-50/50 text-[#5E2590] px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
            <Check size={12} strokeWidth={3} /> {filter}
          </div>
        ))}
        <button className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors">
          <Plus size={12} strokeWidth={3} /> Add Filter
        </button>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
        <div className="flex gap-2">
          {['PDF', 'Excel', 'CSV', 'PPT'].map((format) => (
            <button key={format} className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors ${format === 'PDF' ? 'bg-indigo-100 text-[#5E2590]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
              {format}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-[#5E2590] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#4a1d72] shadow-lg shadow-indigo-200">
          <Wand2 size={16} /> Generate Report
        </button>
      </div>
    </div>
  );
};

export default CustomGenerator;