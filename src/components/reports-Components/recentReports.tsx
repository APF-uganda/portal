import React from 'react';
import { History, FileText, Download, Share2, Trash2, FileSpreadsheet } from 'lucide-react';

const RecentReports: React.FC = () => {
  const reports = [
    { name: "Membership_Report_Dec2024.pdf", type: "Membership Report", date: "Dec 22, 2024", size: "2.4 MB", ext: 'pdf' },
    { name: "Financial_Summary_Q4_2024.xlsx", type: "Financial Report", date: "Dec 20, 2024", size: "1.8 MB", ext: 'xlsx' },
    { name: "Events_Analysis_2024.pdf", type: "Events Report", date: "Dec 18, 2024", size: "3.1 MB", ext: 'pdf' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[#5E2590]">
          <History size={18} strokeWidth={2.5} />
          <h2 className="font-bold text-slate-800">Recently Generated</h2>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Your recently generated reports are available for download.</span>
      </div>

      <div className="divide-y divide-slate-50">
        {reports.map((report, idx) => (
          <div key={idx} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#5E2590] focus:ring-[#5E2590]" />
              <div className={`p-2.5 rounded-lg ${report.ext === 'pdf' ? 'bg-indigo-50 text-[#5E2590]' : 'bg-emerald-50 text-emerald-600'}`}>
                {report.ext === 'pdf' ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm group-hover:text-[#5E2590] transition-colors">{report.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{report.type} • {report.date} • {report.size}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button title="Download" className="p-2 text-slate-400 hover:text-[#5E2590] hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm transition-all">
                <Download size={16} />
              </button>
              <button title="Share" className="p-2 text-slate-400 hover:text-[#5E2590] hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm transition-all">
                <Share2 size={16} />
              </button>
              <button title="Delete" className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReports;