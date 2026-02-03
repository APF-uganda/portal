import React from 'react';
import { Users, Eye, Download, FileText, BarChart3, ShieldCheck, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ReportTemplate } from '../../services/analyticsApi';

interface ReportCardProps {
  template?: ReportTemplate;
  title?: string;
  date?: string;
  description?: string;
  onView?: () => void;
  onDownload?: () => void;
}

const ReportsCard: React.FC<ReportCardProps> = ({ 
  template,
  title: propTitle, 
  date: propDate, 
  description: propDescription, 
  onView, 
  onDownload 
}) => {
  const { analytics } = useAnalytics();
  
  // Use template data if available, otherwise use props
  const title = template ? template.report_type_display : propTitle || 'Report';
  const description = template ? template.description : propDescription || '';
  const date = propDate || new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const getIcon = () => {
    const reportType = template ? template.report_type : title.toLowerCase();
    
    if (reportType.includes('membership')) return <Users className="w-5 h-5" />;
    if (reportType.includes('financial') || reportType.includes('general')) return <DollarSign className="w-5 h-5" />;
    if (reportType.includes('event')) return <Calendar className="w-5 h-5" />;
    if (reportType.includes('compliance')) return <ShieldCheck className="w-5 h-5" />;
    if (reportType.includes('growth')) return <TrendingUp className="w-5 h-5" />;
    if (reportType.includes('application')) return <FileText className="w-5 h-5" />;
    return <BarChart3 className="w-5 h-5" />;
  };

  // Generate realistic chart data based on report type
  const getChartData = () => {
    const reportType = template ? template.report_type : title.toLowerCase();
    
    if (reportType.includes('membership') && analytics?.membership) {
      // Use real membership growth data
      const growthData = analytics.membership.monthly_growth.slice(-6);
      return growthData.map(item => item.count);
    } else if ((reportType.includes('application') || reportType.includes('general')) && analytics?.applications) {
      // Use application status data
      const { pending, approved, rejected } = analytics.applications.status_breakdown;
      return [pending, approved, rejected, pending + approved, rejected + approved, pending + rejected];
    } else {
      // Default chart data
      return [40, 55, 45, 80, 60, 40];
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData);

  const handleView = () => {
    if (onView) {
      onView();
    } else {
      console.log(`Viewing ${title} report`);
      // Add navigation or modal logic here
    }
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
    } else {
      console.log(`Downloading ${title} report`);
      
      try {
        // Generate report data based on type
        let reportData: any = {};
        const reportType = template ? template.report_type : title.toLowerCase();
        let filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
        
        if (reportType.includes('membership') && analytics?.membership) {
          reportData = {
            title: title,
            generated_date: new Date().toISOString(),
            data: analytics.membership,
            summary: {
              total_members: analytics.membership.total_members,
              total_admins: analytics.membership.total_admins,
              profile_completion_rate: analytics.membership.profile_completion.completion_rate
            }
          };
        } else if ((reportType.includes('general') || reportType.includes('application')) && analytics) {
          reportData = {
            title: title,
            generated_date: new Date().toISOString(),
            data: {
              applications: analytics.applications,
              system: analytics.system
            },
            summary: {
              total_applications: analytics.applications.total_applications,
              pending: analytics.applications.status_breakdown.pending,
              approved: analytics.applications.status_breakdown.approved,
              rejected: analytics.applications.status_breakdown.rejected
            }
          };
        } else {
          reportData = {
            title: title,
            generated_date: new Date().toISOString(),
            description: description,
            template_info: template ? {
              id: template.id,
              type: template.report_type,
              output_format: template.output_format
            } : null,
            note: 'Full report data not yet available'
          };
        }
        
        // Create and download JSON file
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`Report downloaded: ${filename}.json`);
      } catch (error) {
        console.error('Error downloading report:', error);
        alert('Failed to download report. Please try again.');
      }
    }
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
        {chartData.map((height, i) => (
          <div 
            key={i} 
            className="flex-1 bg-[#5E2590] rounded-sm opacity-90" 
            style={{ height: `${(height / maxValue) * 100}%` }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-auto">
        <button 
          onClick={handleView}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#5E2590] text-white text-[11px] font-bold py-2.5 rounded-lg hover:bg-[#4a1d72] transition-all whitespace-nowrap min-w-max px-3"
        >
          <Eye size={14} strokeWidth={2.5} /> 
          <span>View Report</span>
        </button>
        
        <button 
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 text-[11px] font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-all whitespace-nowrap min-w-max px-3"
        >
          <Download size={14} strokeWidth={2.5} /> 
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsCard;