import React, { useState } from 'react';
import { Edit3, Check, Plus, Wand2, X } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

type FilterCategory = 'Membership' | 'Applications' | 'System' | 'All';
type FilterPeriod = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'Last 12 Months' | 'All Time';
type FormatType = 'PDF' | 'Excel' | 'CSV' | 'JSON';

interface CustomFilter {
  id: string;
  type: 'category' | 'period' | 'custom';
  label: string;
}

const CustomGenerator: React.FC = () => {
  const { analytics, loading } = useAnalytics();
  const [selectedFilters, setSelectedFilters] = useState<CustomFilter[]>([
    { id: '1', type: 'category', label: 'Membership' },
    { id: '2', type: 'period', label: 'Last 30 Days' },
  ]);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('JSON');
  const [generating, setGenerating] = useState(false);
  const [showAddFilter, setShowAddFilter] = useState(false);

  const availableCategories: FilterCategory[] = ['All', 'Membership', 'Applications', 'System'];
  const availablePeriods: FilterPeriod[] = ['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months'];

  const addFilter = (type: 'category' | 'period', label: string) => {
    const newFilter: CustomFilter = {
      id: Date.now().toString(),
      type,
      label,
    };
    setSelectedFilters([...selectedFilters, newFilter]);
    setShowAddFilter(false);
  };

  const removeFilter = (id: string) => {
    setSelectedFilters(selectedFilters.filter(f => f.id !== id));
  };

  const getSelectedCategory = (): FilterCategory => {
    const categoryFilter = selectedFilters.find(f => f.type === 'category');
    return (categoryFilter?.label as FilterCategory) || 'All';
  };

  const getSelectedPeriod = (): FilterPeriod => {
    const periodFilter = selectedFilters.find(f => f.type === 'period');
    return (periodFilter?.label as FilterPeriod) || 'Last 30 Days';
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    
    try {
      const selectedCategory = getSelectedCategory();
      const selectedPeriod = getSelectedPeriod();
      
      console.log('Generating custom report...', { selectedCategory, selectedPeriod, selectedFormat });
      
      // Prepare report data based on selected filters
      let reportData: any = {
        report_type: 'Custom Report',
        category: selectedCategory,
        period: selectedPeriod,
        format: selectedFormat,
        filters: selectedFilters.map(f => f.label),
        generated_at: new Date().toISOString(),
        generated_by: 'Admin User'
      };

      // Add relevant data based on category
      if (analytics) {
        if (selectedCategory === 'Membership' && analytics.membership) {
          reportData.data = {
            ...analytics.membership,
            summary: {
              total_members: analytics.membership.total_members,
              total_admins: analytics.membership.total_admins,
              new_members: analytics.membership.monthly_growth?.reduce((sum, item) => sum + item.count, 0) || 0,
              profile_completion_rate: analytics.membership.profile_completion.completion_rate
            }
          };
        } else if (selectedCategory === 'Applications' && analytics.applications) {
          reportData.data = {
            ...analytics.applications,
            summary: {
              total: analytics.applications.total_applications,
              pending: analytics.applications.status_breakdown.pending,
              approved: analytics.applications.status_breakdown.approved,
              rejected: analytics.applications.status_breakdown.rejected,
              approval_rate: ((analytics.applications.status_breakdown.approved / Math.max(analytics.applications.total_applications, 1)) * 100).toFixed(2) + '%'
            }
          };
        } else if (selectedCategory === 'System' && analytics.system) {
          reportData.data = {
            ...analytics.system,
            summary: {
              total_users: analytics.system.system_health.total_users,
              active_users: analytics.system.active_users_period || analytics.system.active_users_30d || 0,
              profile_adoption: analytics.system.system_health.profile_adoption_rate + '%',
              recent_updates: analytics.system.recent_profile_updates
            }
          };
        } else if (selectedCategory === 'All') {
          reportData.data = {
            membership: analytics.membership,
            applications: analytics.applications,
            system: analytics.system,
            summary: {
              total_members: analytics.membership.total_members,
              total_applications: analytics.applications.total_applications,
              active_users: analytics.system.active_users_period || analytics.system.active_users_30d || 0
            }
          };
        }
      } else {
        reportData.note = 'Analytics data not available. Please ensure the backend is running and try again.';
      }

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Custom_Report_${selectedCategory.replace(/\s+/g, '_')}_${timestamp}`;
      
      // Download based on format
      if (selectedFormat === 'JSON') {
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        downloadFile(dataBlob, `${filename}.json`);
      } else if (selectedFormat === 'CSV') {
        const csvContent = convertToCSV(reportData);
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        downloadFile(dataBlob, `${filename}.csv`);
      } else {
        // For PDF and Excel, download as JSON with a note
        reportData.note = `${selectedFormat} export will be available in future updates. This is a JSON export.`;
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        downloadFile(dataBlob, `${filename}.json`);
      }
      
      alert(`Report generated successfully! Check your downloads folder.`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any): string => {
    // Simple CSV conversion
    const lines: string[] = ['Category,Period,Generated At'];
    lines.push(`${data.category},${data.period},${data.generated_at}`);
    lines.push('');
    
    if (data.data?.summary) {
      lines.push('Metric,Value');
      Object.entries(data.data.summary).forEach(([key, value]) => {
        lines.push(`${key},${value}`);
      });
    }
    
    return lines.join('\n');
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-2">
        <Edit3 size={20} className="text-[#5E2590]" />
        <h2 className="text-lg font-bold text-slate-800">Custom Report Generator</h2>
      </div>
      <p className="text-sm text-slate-500 mb-8">Create a custom report with specific filters and date ranges. Tailor reports to your exact needs.</p>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {selectedFilters.map((filter) => (
          <div 
            key={filter.id} 
            className="flex items-center gap-2 bg-indigo-50/50 text-[#5E2590] px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100"
          >
            <Check size={12} strokeWidth={3} /> 
            {filter.label}
            <button
              onClick={() => removeFilter(filter.id)}
              className="ml-1 hover:bg-indigo-100 rounded-full p-0.5 transition-colors"
              title="Remove filter"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        ))}
        
        {/* Add Filter Button */}
        <div className="relative">
          <button 
            onClick={() => setShowAddFilter(!showAddFilter)}
            className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            <Plus size={12} strokeWidth={3} /> Add Filter
          </button>
          
          {/* Filter Dropdown */}
          {showAddFilter && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-500 px-2 py-1">Category</p>
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => addFilter('category', category)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                  >
                    {category}
                  </button>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <p className="text-xs font-semibold text-gray-500 px-2 py-1">Period</p>
                {availablePeriods.map(period => (
                  <button
                    key={period}
                    onClick={() => addFilter('period', period)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
        <div className="flex gap-2">
          {(['JSON', 'CSV', 'PDF', 'Excel'] as FormatType[]).map((format) => (
            <button 
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors ${
                selectedFormat === format
                  ? 'bg-indigo-100 text-[#5E2590]'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {format}
            </button>
          ))}
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={generating || loading}
          className="flex items-center gap-2 bg-[#5E2590] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#4a1d72] shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={16} /> Generate Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomGenerator;