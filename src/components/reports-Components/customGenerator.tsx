import React, { useState } from 'react';
import { Edit3, Check, Plus, Wand2, X, Save, FileText } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';


type FilterCategory = 'Membership' | 'Applications' | 'System' | 'All';
type FilterPeriod = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'Last 12 Months' | 'All Time';
type FormatType = 'PDF' | 'Excel' | 'CSV' | 'JSON';

interface CustomFilter {
  id: string;
  type: 'category' | 'period' | 'custom';
  label: string;
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
            className="flex-1 bg-[#5E2590] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#4a1d72] transition-all shadow-md shadow-indigo-100"
          >
            {isSaving ? 'Saving...' : 'Confirm Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

//  Main Component 
const CustomGenerator: React.FC = () => {
  const { analytics, loading } = useAnalytics();
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

  const getSelectedCategory = (): FilterCategory => {
    const categoryFilter = selectedFilters.find(f => f.type === 'category');
    return (categoryFilter?.label as FilterCategory) || 'All';
  };

  const getSelectedPeriod = (): FilterPeriod => {
    const periodFilter = selectedFilters.find(f => f.type === 'period');
    return (periodFilter?.label as FilterPeriod) || 'Last 30 Days';
  };

  const addFilter = (type: 'category' | 'period', label: string) => {
    
    const filtered = selectedFilters.filter(f => f.type !== type);
    const newFilter: CustomFilter = { id: Date.now().toString(), type, label };
    setSelectedFilters([...filtered, newFilter]);
    setShowAddFilter(false);
  };

  const removeFilter = (id: string) => {
    setSelectedFilters(selectedFilters.filter(f => f.id !== id));
  };

  // --- API Actions ---
  
  const handleSaveTemplate = async (name: string, description: string) => {
    setIsSaving(true);
    try {
   
      const templatePayload = {
        name,
        description,
        report_type: getSelectedCategory().toLowerCase(), // matches REPORT_TYPES choices
        output_format: selectedFormat.toLowerCase(),
        filters: {
          period: getSelectedPeriod(),
          raw_filters: selectedFilters.map(f => f.label)
        },
        fields_to_include: ["all"], // Can be customized further
        chart_configs: { default_view: "bar" },
        is_active: true
      };

      // Mocking the API call to your ReportTemplateViewSet
      console.log('Saving to /api/report-templates/', templatePayload);
      
      // await api.post('/report-templates/', templatePayload);
      
      alert(`Template "${name}" saved successfully!`);
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    // ... your existing handleGenerateReport logic remains the same ...
    setTimeout(() => setGenerating(false), 1500); // UI Simulation
    alert('Report generation started. Check Recently Generated section.');
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Edit3 size={20} className="text-[#5E2590]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Custom Report Generator</h2>
          </div>
          <p className="text-sm text-slate-500">Tailor analytics by category and timeframe to generate instant insights.</p>
        </div>
      </div>

      {/* Active Filters Grid */}
      <div className="bg-slate-50/50 rounded-2xl p-6 mb-8 border border-dashed border-slate-200">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Parameters</label>
        <div className="flex flex-wrap gap-3">
          {selectedFilters.map((filter) => (
            <div 
              key={filter.id} 
              className="flex items-center gap-2 bg-white text-[#5E2590] pl-4 pr-2 py-2 rounded-xl text-xs font-bold border border-indigo-100 shadow-sm transition-all hover:border-[#5E2590]"
            >
              <Check size={14} className="text-indigo-400" /> 
              <span className="text-slate-600 font-medium mr-1">{filter.type}:</span>
              {filter.label}
              <button
                onClick={() => removeFilter(filter.id)}
                className="ml-2 hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-lg p-1 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          <div className="relative">
            <button 
              onClick={() => setShowAddFilter(!showAddFilter)}
              className="flex items-center gap-2 text-[#5E2590] bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              <Plus size={14} strokeWidth={3} /> Change Filter
            </button>
            
            {showAddFilter && (
              <div className="absolute top-full left-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 min-w-[220px] p-2 animate-in slide-in-from-top-2 duration-200">
                <p className="text-[10px] font-bold text-slate-400 px-3 py-2 uppercase">Select Category</p>
                {availableCategories.map(cat => (
                  <button key={cat} onClick={() => addFilter('category', cat)} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-[#5E2590] rounded-lg transition-colors">{cat}</button>
                ))}
                <div className="h-px bg-slate-100 my-2 mx-2"></div>
                <p className="text-[10px] font-bold text-slate-400 px-3 py-2 uppercase">Select Period</p>
                {availablePeriods.map(per => (
                  <button key={per} onClick={() => addFilter('period', per)} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-[#5E2590] rounded-lg transition-colors">{per}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase mr-2">Export Format:</span>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {(['PDF', 'Excel', 'CSV', 'JSON'] as FormatType[]).map((format) => (
              <button 
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedFormat === format
                    ? 'bg-white text-[#5E2590] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowSaveModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
          >
            <Save size={16} /> Save Template
          </button>
          
          <button 
            onClick={handleGenerateReport}
            disabled={generating || loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#5E2590] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#4a1d72] shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
          >
            {generating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Wand2 size={16} /> Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {showSaveModal && (
        <SaveTemplateModal 
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveTemplate}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default CustomGenerator;