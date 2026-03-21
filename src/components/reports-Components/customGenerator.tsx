import React, { useState } from 'react';
import { Plus, Wand2, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { analyticsApi } from '../../services/analyticsApi'; 

type FilterCategory = 'Membership' | 'Applications' | 'System' | 'All';
type FilterPeriod = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'Last 12 Months' | 'All Time';
type FormatType = 'PDF' | 'Excel' | 'CSV' | 'JSON';

interface CustomFilter {
  id: string;
  type: 'category' | 'period';
  label: string;
}

interface CustomGeneratorProps {
  onSuccess?: () => void;
}

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border animate-in slide-in-from-right-10 duration-300 ${
      type === 'success' ? 'bg-white border-emerald-100 text-emerald-800' : 'bg-white border-red-100 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-slate-100 rounded-lg transition-colors">
        <X size={16} className="text-slate-400" />
      </button>
    </div>
  );
};

const CustomGenerator: React.FC<CustomGeneratorProps> = ({ onSuccess }) => {
  const { loading: analyticsLoading } = useAnalytics();
  const [selectedFilters, setSelectedFilters] = useState<CustomFilter[]>([
    { id: '1', type: 'category', label: 'Membership' },
    { id: '2', type: 'period', label: 'Last 30 Days' },
  ]);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('PDF');
  const [generating, setGenerating] = useState(false);
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const availableCategories: FilterCategory[] = ['All', 'Membership', 'Applications', 'System'];
  const availablePeriods: FilterPeriod[] = ['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months'];

  const getSelectedCategory = () => selectedFilters.find(f => f.type === 'category')?.label || 'All';
  const getSelectedPeriod = () => selectedFilters.find(f => f.type === 'period')?.label || 'Last 30 Days';

  const addFilter = (type: 'category' | 'period', label: string) => {
    const filtered = selectedFilters.filter(f => f.type !== type);
    setSelectedFilters([...filtered, { id: Date.now().toString(), type, label }]);
    setShowAddFilter(false);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const category = getSelectedCategory().toLowerCase();
      
      //  pass the filters here 
      
      const reportPayload = {
        name: `Manual ${getSelectedCategory()} Report`,
        description: `Generated on ${new Date().toLocaleDateString()}`,
        report_type: category === 'all' ? 'membership' : category,
        output_format: selectedFormat.toLowerCase(),
        is_active: false,
        filters: {
          period: getSelectedPeriod(),
          category: category,
          include_visuals: true, 
          include_stats: true    
        },
        fields_to_include: ["all"]
      };

      // Create the template with the filters
      const quickTemplate = await analyticsApi.createReportTemplate(reportPayload);

      // Trigger the actual generation
      await analyticsApi.generateReport(
        quickTemplate.id,
        `Custom ${getSelectedCategory()} Report`,
        selectedFormat.toLowerCase()
      );

      setToast({ message: 'Report generation started!', type: 'success' });
      if (onSuccess) onSuccess(); 
    } catch (error) {
      console.error("Generation error:", error);
      setToast({ message: 'Generation failed. Check server connection.', type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 relative text-slate-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Wand2 size={20} className="text-slate-700" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Report Builder</h2>
        </div>
        <p className="text-sm text-slate-500">Configure parameters to generate visual audits and system insights.</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-100">
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Selected Parameters</label>
        
        <div className="flex flex-wrap gap-3">
          {selectedFilters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-xs border border-slate-200 shadow-sm">
              <span className="text-slate-400">{filter.type}:</span>
              <span className="font-medium">{filter.label}</span>
            </div>
          ))}
          
          <div className="relative">
            <button 
              onClick={() => setShowAddFilter(!showAddFilter)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                showAddFilter ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Plus size={14} /> 
              <span>Change Filters</span>
            </button>
            
            {showAddFilter && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 min-w-[200px] p-2">
                <div className="px-3 py-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Category</p>
                    <div className="space-y-1">
                        {availableCategories.map(cat => (
                        <button key={cat} onClick={() => addFilter('category', cat)} className="w-full text-left px-2 py-1.5 text-xs hover:bg-slate-100 rounded-md transition-colors">{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="px-3 py-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Timeframe</p>
                    <div className="space-y-1">
                        {availablePeriods.map(per => (
                        <button key={per} onClick={() => addFilter('period', per)} className="w-full text-left px-2 py-1.5 text-xs hover:bg-slate-100 rounded-md transition-colors">{per}</button>
                        ))}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-500">Output Format</span>
          <div className="flex p-1 bg-slate-100 rounded-lg">
            {(['PDF', 'Excel'] as FormatType[]).map((format) => (
              <button 
                key={format} 
                onClick={() => setSelectedFormat(format)} 
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedFormat === format ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerateReport} 
          disabled={generating || analyticsLoading} 
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md"
        >
          {generating ? (
              <Loader2 className="animate-spin" size={18} />
          ) : (
              <>
                  <Wand2 size={16} /> 
                  <span>Generate Report</span>
              </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomGenerator;