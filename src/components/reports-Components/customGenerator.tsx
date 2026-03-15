import React, { useState } from 'react';
import { Edit3, Check, Plus, Wand2, X, Save, Loader2 } from 'lucide-react';
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

const SaveTemplateModal: React.FC<{
  onClose: () => void;
  onSave: (name: string, desc: string) => void;
  isSaving: boolean;
}> = ({ onClose, onSave, isSaving }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Save size={18} className="text-[#5E2590]" /> Save Report Template
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Template Name</label>
            <input 
              autoFocus
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#5E2590]/20 focus:border-[#5E2590] outline-none transition-all"
              placeholder="e.g., Weekly Membership Audit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea 
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm h-28 focus:ring-2 focus:ring-[#5E2590]/20 focus:border-[#5E2590] outline-none transition-all resize-none"
              placeholder="Briefly describe what data this template captures..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button 
            disabled={!name || isSaving}
            onClick={() => onSave(name, desc)}
            className="flex-1 bg-[#5E2590] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#4a1d72] transition-all"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16}/> : 'Confirm Save'}
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

  //  API LOGIC 
  
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
          raw_filters: selectedFilters.map(f => f.label)
        },
        fields_to_include: ["all"],
        is_active: true
      };

      await analyticsApi.createReportTemplate(templatePayload);
      alert(`Template "${name}" saved!`);
      setShowSaveModal(false);
      if (onSuccess) onSuccess(); 
    } catch (error) {
      alert('Failed to save template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
    
      const quickTemplate = await analyticsApi.createReportTemplate({
        name: `Ad-hoc ${getSelectedCategory()} Report`,
        description: `Generated manually on ${new Date().toLocaleDateString()}`,
        report_type: getSelectedCategory().toLowerCase(),
        output_format: selectedFormat.toLowerCase(),
        is_active: false // Temporary template
      });

      await analyticsApi.generateReport(
        quickTemplate.id,
        `Custom ${getSelectedCategory()} Report`,
        selectedFormat.toLowerCase()
      );

      alert('Report generation started. Check "Recently Generated" section.');
      if (onSuccess) onSuccess(); 
    } catch (error) {
      alert('Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm border border-slate-100">
     
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 md:mb-8">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="p-1.5 md:p-2 bg-indigo-50 rounded-lg">
              <Edit3 size={18} className="md:w-5 md:h-5 text-[#5E2590]" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">Custom Report Generator</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500">Tailor analytics by category and timeframe to generate instant insights.</p>
        </div>
      </div>

      {/* Active Filters Grid */}
      <div className="bg-slate-50/50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-dashed border-slate-200">
        <label className="block text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4">Active Parameters</label>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {selectedFilters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-1.5 md:gap-2 bg-white text-[#5E2590] pl-3 md:pl-4 pr-1.5 md:pr-2 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs font-bold border border-indigo-100">
              <Check size={12} className="md:w-3.5 md:h-3.5 text-indigo-400" /> 
              <span className="text-slate-600 font-medium mr-1 text-xs">{filter.type}:</span>
              <span className="text-xs">{filter.label}</span>
              <button onClick={() => removeFilter(filter.id)} className="ml-1 md:ml-2 hover:text-red-500 text-slate-300 transition-colors"><X size={12} className="md:w-3.5 md:h-3.5" /></button>
            </div>
          ))}
          
          <div className="relative">
            <button onClick={() => setShowAddFilter(!showAddFilter)} className="flex items-center gap-1.5 md:gap-2 text-[#5E2590] bg-indigo-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
              <Plus size={12} className="md:w-3.5 md:h-3.5" strokeWidth={3} /> 
              <span className="hidden sm:inline">Change Filter</span>
              <span className="sm:hidden">Filter</span>
            </button>
            {showAddFilter && (
              <div className="absolute top-full left-0 mt-2 md:mt-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-xl z-20 min-w-[200px] md:min-w-[220px] p-2">
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 px-2 md:px-3 py-1.5 md:py-2 uppercase">Select Category</p>
                {availableCategories.map(cat => (
                  <button key={cat} onClick={() => addFilter('category', cat)} className="w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-slate-600 hover:bg-indigo-50 hover:text-[#5E2590] rounded-lg transition-colors">{cat}</button>
                ))}
                <div className="h-px bg-slate-100 my-2 mx-2"></div>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 px-2 md:px-3 py-1.5 md:py-2 uppercase">Select Period</p>
                {availablePeriods.map(per => (
                  <button key={per} onClick={() => addFilter('period', per)} className="w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-slate-600 hover:bg-indigo-50 hover:text-[#5E2590] rounded-lg transition-colors">{per}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 pt-4 md:pt-6 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase">Export Format:</span>
          <div className="flex p-1 bg-slate-100 rounded-lg md:rounded-xl overflow-x-auto">
            {(['PDF', 'Excel', 'CSV', 'JSON'] as FormatType[]).map((format) => (
              <button key={format} onClick={() => setSelectedFormat(format)} className={`px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedFormat === format ? 'bg-white text-[#5E2590] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <button onClick={() => setShowSaveModal(true)} className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-slate-50 transition-colors">
            <Save size={14} className="md:w-4 md:h-4" /> 
            <span className="hidden sm:inline">Save Template</span>
            <span className="sm:hidden">Save</span>
          </button>
          
          <button onClick={handleGenerateReport} disabled={generating || analyticsLoading} className="flex items-center justify-center gap-2 bg-[#5E2590] text-white px-6 md:px-8 py-2.5 rounded-xl text-xs md:text-sm font-bold disabled:opacity-50 transition-all">
            {generating ? <div className="animate-spin rounded-full h-3 md:h-4 w-3 md:w-4 border-b-2 border-white"></div> : <><Wand2 size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Generate Report</span><span className="sm:hidden">Generate</span></>}
          </button>
        </div>
      </div>

      {showSaveModal && <SaveTemplateModal onClose={() => setShowSaveModal(false)} onSave={handleSaveTemplate} isSaving={isSaving} />}
    </div>
  );
};

export default CustomGenerator;