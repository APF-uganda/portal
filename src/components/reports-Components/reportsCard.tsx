import React from 'react';
import { Users, Eye, Download, FileText, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';

interface ReportCardProps {
  title: string;
  date: string;
  description: string;
}

const ReportsCard: React.FC<ReportCardProps> = ({ title, date, description }) => {
  const getIcon = () => {
    if (title.includes('Membership')) return <Users className="w-5 h-5" />;
    if (title.includes('General')) return <BarChart3 className="w-5 h-5" />;
    if (title.includes('Event')) return <FileText className="w-5 h-5" />;
    if (title.includes('Compliance')) return <ShieldCheck className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-[15px] p-5 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      
     
      <div className="flex justify-between items-start mb-3 gap-x-4"> 
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="text-[#5E2590] shrink-0">
            {getIcon()}
          </div>
          <h3 className="font-bold text-gray-800 text-[15px] leading-tight whitespace-nowrap">
            {title}
          </h3>
        </div>
        
        
        <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase shrink-0">
          {date}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-[12px] text-gray-500 leading-snug mb-4 min-h-[36px]">
        {description}
      </p>

      {/* Chart */}
      <div className="flex items-end gap-1 h-12 mb-5">
        {[40, 55, 45, 80, 60, 40].map((height, i) => (
          <div 
            key={i} 
            className="flex-1 bg-[#5E2590] rounded-sm opacity-90" 
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-auto">
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#5E2590] text-white text-[11px] font-bold py-2.5 rounded-lg hover:bg-[#4a1d72] transition-all whitespace-nowrap min-w-max px-3">
          <Eye size={14} strokeWidth={2.5} /> 
          <span>View Report</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 text-[11px] font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-all whitespace-nowrap min-w-max px-3">
          <Download size={14} strokeWidth={2.5} /> 
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsCard;