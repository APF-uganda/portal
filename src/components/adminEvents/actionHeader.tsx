import { ArrowLeft, Save, Globe, Loader2 } from 'lucide-react';

export const ActionHeader = ({ onPublish, onBack, loading }: any) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 font-sans">
    <button 
      type="button"
      onClick={onBack} 
      className="flex items-center gap-2 text-slate-400 font-bold text-xs md:text-sm uppercase tracking-widest hover:text-purple-700 transition"
    >
      <ArrowLeft size={14} className="md:w-4 md:h-4" /> 
      <span className="hidden sm:inline">Discard & Return</span>
      <span className="sm:hidden">Back</span>
    </button>
    
    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
      <div className="hidden lg:flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full">
        <Globe size={12} className="md:w-3.5 md:h-3.5" />
        <span className="text-xs md:text-sm font-black uppercase tracking-tighter">Public</span>
      </div>

      <button 
        type="button"
        disabled={loading}
        onClick={onPublish} 
        className="flex-1 sm:flex-none px-6 md:px-8 py-2.5 md:py-3 bg-[#5C32A3] text-white rounded-xl md:rounded-2xl font-black text-sm md:text-base shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Connecting...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Publish Event</span>
            <span className="sm:hidden">Publish</span>
          </>
        )}
      </button>
    </div>
  </div>
);

export default ActionHeader;