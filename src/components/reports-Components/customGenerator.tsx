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

// Toast Notification 
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
               Save Template
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Reuse these parameters for future audits.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-all active:scale-90"><X size={20}/></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-[#5E2590] uppercase tracking-[0.15em] mb-2 opacity-70">Template Name</label>
            <input 
              autoFocus
              className="w-full border-2 border-slate-100 bg-slate-50/30 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-[#5E2590]/10 focus:border-[#5E2590] focus:bg-white outline-none transition-all placeholder:text-slate-300"
              placeholder="e.g., Weekly Membership Audit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#5E2590] uppercase tracking-[0.15em] mb-2 opacity-70">Description</label>
            <textarea 
              className="w-full border-2 border-slate-100 bg-slate-50/30 rounded-2xl px-5 py-3.5 text-sm h-32 focus:ring-4 focus:ring-[#5E2590]/10 focus:border-[#5E2590] focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300 font-medium"
              placeholder="Briefly describe what data this template captures..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="p-8 bg-slate-50/80 backdrop-blur-sm flex gap-4">
          <button onClick={onClose} className="flex-1 px-4 py-4 text-slate-500 font-bold text-sm hover:text-slate-800 rounded-2xl transition-colors">Cancel</button>
          <button 
            disabled={!name || isSaving}
            onClick={() => onSave(name, desc)}
            className="flex-[1.5] bg-[#5E2590] shadow-lg shadow-indigo-200 text-white px-4 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#4a1d72] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18}/> Confirm Save</>}
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
  
  // Toast State
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
          raw_filters: selectedFilters.map(f => f.label)
        },
        fields_to_include: ["all"],
        is_active: true
      };

      await analyticsApi.createReportTemplate(templatePayload);
      setToast({ message: `Template "${name}" saved successfully!`, type: 'success' });
      setShowSaveModal(false);
      if (onSuccess) onSuccess(); 
    } catch (error) {
      setToast({ message: 'Failed to save template. Please try again.', type: 'error' });
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
        is_active: false
      });

      await analyticsApi.generateReport(
        quickTemplate.id,
        `Custom ${getSelectedCategory()} Report`,
        selectedFormat.toLowerCase()
      );

      setToast({ message: 'Report generation started! It will appear in "Recently Generated".', type: 'success' });
      if (onSuccess) onSuccess(); 
    } catch (error) {
      setToast({ message: 'Report generation failed.', type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#5E2590]/5 rounded-bl-[100px] -z-10 pointer-events-none" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#5E2590]/10 rounded-2xl">
              <Wand2 size={22} className="text-[#5E2590]" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Report Builder</h2>
          </div>
          <p className="text-sm text-slate-400 font-medium max-w-md">Configure parameters below to generate detailed audits and system insights.</p>
        </div>
      </div>

      <div className="bg-slate-50/80 rounded-[2rem] p-6 md:p-8 mb-8 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
            <label className="block text-[10px] font-black text-[#5E2590] uppercase tracking-[0.2em] opacity-60">Active Parameters</label>
            <div className="h-px flex-1 bg-slate-200/60 ml-4"></div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {selectedFilters.map((filter) => (
            <div key={filter.id} className="group flex items-center gap-2.5 bg-white text-slate-700 pl-4 pr-2 py-2.5 rounded-2xl text-xs font-bold border border-slate-100 shadow-sm hover:border-[#5E2590]/30 transition-all">
              <span className="text-[#5E2590] opacity-40 uppercase text-[9px] tracking-wider">{filter.type}</span>
              <span className="text-slate-800">{filter.label}</span>
              <button onClick={() => removeFilter(filter.id)} className="p-1 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-300 transition-all">
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
          
          <div className="relative">
            <button 
              onClick={() => setShowAddFilter(!showAddFilter)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                showAddFilter ? 'bg-[#5E2590] text-white' : 'bg-[#5E2590]/5 text-[#5E2590] hover:bg-[#5E2590]/10'
              }`}
            >
              <Plus size={14} strokeWidth={3} /> 
              <span>Adjust Filters</span>
            </button>
            
            {showAddFilter && (
              <div className="absolute top-full left-0 mt-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-20 min-w-[240px] p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2">
                    <p className="text-[9px] font-black text-[#5E2590] uppercase tracking-widest opacity-40 mb-2">Category</p>
                    <div className="grid grid-cols-1 gap-1">
                        {availableCategories.map(cat => (
                        <button key={cat} onClick={() => addFilter('category', cat)} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5E2590] rounded-xl transition-colors">{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="h-px bg-slate-50 my-2 mx-3"></div>
                <div className="px-3 py-2">
                    <p className="text-[9px] font-black text-[#5E2590] uppercase tracking-widest opacity-40 mb-2">Timeframe</p>
                    <div className="grid grid-cols-1 gap-1">
                        {availablePeriods.map(per => (
                        <button key={per} onClick={() => addFilter('period', per)} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5E2590] rounded-xl transition-colors">{per}</button>
                        ))}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 pt-8 border-t border-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Output Format</span>
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-fit">
            {(['PDF', 'Excel'] as FormatType[]).map((format) => (
              <button 
                key={format} 
                onClick={() => setSelectedFormat(format)} 
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedFormat === format ? 'bg-white text-[#5E2590] shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
          <button 
            onClick={() => setShowSaveModal(true)} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-2 border-slate-100 text-slate-600 px-8 py-4 rounded-2xl text-sm font-bold hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
          >
            <Save size={18} /> 
            <span>Save Template</span>
          </button>
          
          <button 
            onClick={handleGenerateReport} 
            disabled={generating || analyticsLoading} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-[#5E2590] shadow-lg shadow-indigo-100 text-white px-10 py-4 rounded-2xl text-sm font-bold disabled:opacity-50 hover:bg-[#4a1d72] hover:-translate-y-1 transition-all active:translate-y-0"
          >
            {generating ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <>
                    <Wand2 size={18} /> 
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