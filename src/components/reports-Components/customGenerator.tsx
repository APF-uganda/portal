import React, { useState, useEffect } from 'react';
import { Edit3, Check, Plus, Wand2, X, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { analyticsApi } from '../../services/analyticsApi'; 

type FilterCategory = 'Membership' | 'Applications' | 'System' | 'All';
type FilterPeriod = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'Last 12 Months' | 'All Time';
type FormatType = 'PDF' | 'Excel' | 'CSV' | 'JSON';

interface CustomFilter {
  id: string;
  type: 'category' | 'period' | 'custom';
  label: string;
}

interface CustomGeneratorProps {
  onSuccess?: () => void;
}

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-10 duration-300 ${
      type === 'success' ? 'bg-white border-emerald-100 text-emerald-800' : 'bg-white border-red-100 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
      <p className="text-sm font-bold tracking-tight">{message}</p>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-slate-50 rounded-lg transition-colors">
        <X size={16} className="text-slate-400" />
      </button>
    </div>
  );
};

const SaveTemplateModal: React.FC<{
  onClose: () => void;
  onSave: (name: string, desc: string) => void;
  isSaving: boolean;
}> = ({ onClose, onSave, isSaving }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-lg font-black text-black uppercase tracking-tight">Save Template</h3>
            <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-widest">Reuse parameters for future reports</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X size={20}/></button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Template Name</label>
            <input 
              autoFocus
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-black focus:border-black focus:bg-white outline-none transition-all"
              placeholder="e.g., Monthly Application Audit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm h-28 focus:ring-2 focus:ring-black focus:border-black focus:bg-white outline-none transition-all resize-none font-medium"
              placeholder="Describe the purpose of this report..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-black transition-colors">Cancel</button>
          <button 
            disabled={!name || isSaving}
            onClick={() => onSave(name, desc)}
            className="flex-[1.5] bg-black text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-gray-800 transition-all"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16}/> Save Template</>}
          </button>
        </div>
      </div>
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
  const [isSaving, setIsSaving] = useState(false);
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
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

  const removeFilter = (id: string) => setSelectedFilters(selectedFilters.filter(f => f.id !== id));

  const handleSaveTemplate = async (name: string, description: string) => {
    setIsSaving(true);
    try {
      const templatePayload = {
        name,
        description,
        report_type: getSelectedCategory().toLowerCase(),
        output_format: selectedFormat.toLowerCase(),
        filters: {
          period: getSelectedPeriod(),
          category: getSelectedCategory().toLowerCase(),
          include_visuals: true,
          include_stats: true
        },
        fields_to_include: ["all"],
        is_active: true
      };

      await analyticsApi.createReportTemplate(templatePayload);
      setToast({ message: `Template "${name}" saved!`, type: 'success' });
      setShowSaveModal(false);
      if (onSuccess) onSuccess(); 
    } catch (error) {
      setToast({ message: 'Failed to save template.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const category = getSelectedCategory().toLowerCase();
      
      // Create template with full filter payload for Django backend
      const reportPayload = {
        name: `Manual ${getSelectedCategory()} Report`,
        description: `Generated on ${new Date().toLocaleDateString()}`,
        report_type: category === 'all' ? 'membership' : category,
        output_format: selectedFormat.toLowerCase(),
        is_active: false,
        filters: {
          period: getSelectedPeriod(),
          category: category,
          include_visuals: true, // This enables the graphs in Django
          include_stats: true    // This enables summary stats
        },
        fields_to_include: ["all"]
      };

      const quickTemplate = await analyticsApi.createReportTemplate(reportPayload);

      await analyticsApi.generateReport(
        quickTemplate.id,
        `Custom ${getSelectedCategory()} Report`,
        selectedFormat.toLowerCase()
      );

      setToast({ message: 'Report generation started!', type: 'success' });
      if (onSuccess) onSuccess(); 
    } catch (error) {
      setToast({ message: 'Generation failed. Check category support.', type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative font-sans text-black">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-xl">
              <Wand2 size={22} className="text-black" />
            </div>
            <h2 className="text-xl font-black text-black uppercase tracking-tight">Report Builder</h2>
          </div>
          <p className="text-sm text-gray-500 font-medium">Configure parameters to generate visual audits and system insights.</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Parameters</label>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {selectedFilters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-3 bg-white text-black pl-4 pr-2 py-2 rounded-xl text-[11px] font-black border border-gray-200 shadow-sm uppercase tracking-wider">
              <span className="text-gray-400">{filter.type}:</span>
              <span>{filter.label}</span>
              <button onClick={() => removeFilter(filter.id)} className="p-1 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-300 transition-all">
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
          
          <div className="relative">
            <button 
              onClick={() => setShowAddFilter(!showAddFilter)} 
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                showAddFilter ? 'bg-black text-white' : 'bg-white border border-gray-200 text-black hover:bg-gray-50'
              }`}
            >
              <Plus size={14} strokeWidth={3} /> 
              <span>Adjust Filters</span>
            </button>
            
            {showAddFilter && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[220px] p-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Report Category</p>
                    <div className="space-y-1">
                        {availableCategories.map(cat => (
                        <button key={cat} onClick={() => addFilter('category', cat)} className="w-full text-left px-3 py-2 text-[11px] font-bold text-black hover:bg-gray-100 rounded-lg transition-colors uppercase">{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="px-3 py-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Timeframe</p>
                    <div className="space-y-1">
                        {availablePeriods.map(per => (
                        <button key={per} onClick={() => addFilter('period', per)} className="w-full text-left px-3 py-2 text-[11px] font-bold text-black hover:bg-gray-100 rounded-lg transition-colors uppercase">{per}</button>
                        ))}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Output Format</span>
          <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
            {(['PDF', 'Excel'] as FormatType[]).map((format) => (
              <button 
                key={format} 
                onClick={() => setSelectedFormat(format)} 
                className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedFormat === format ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
          <button 
            onClick={() => setShowSaveModal(true)} 
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            <Save size={16} /> 
            <span>Save Template</span>
          </button>
          
          <button 
            onClick={handleGenerateReport} 
            disabled={generating || analyticsLoading} 
            className="flex-[1.5] flex items-center justify-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-200 disabled:opacity-50 hover:bg-gray-800 transition-all"
          >
            {generating ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                <>
                    <Wand2 size={16} /> 
                    <span>Generate Final Report</span>
                </>
            )}
          </button>
        </div>
      </div>

      {showSaveModal && <SaveTemplateModal onClose={() => setShowSaveModal(false)} onSave={handleSaveTemplate} isSaving={isSaving} />}
    </div>
  );
};

export default CustomGenerator;