import  { useState } from 'react';
import { 
   MapPin, Video, Image as ImageIcon, 
  Clock, Save, ArrowLeft,
} from 'lucide-react';

export const EventForm = ({ initialData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(initialData || {
    isVirtual: false,
    status: 'Draft'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#5C32A3] transition">
          <ArrowLeft size={18} /> Back to Events
        </button>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition">
            Save as Draft
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2.5 bg-[#5C32A3] text-white rounded-xl font-black text-sm shadow-lg shadow-purple-200 flex items-center gap-2"
          >
            <Save size={18} /> Publish Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Event Identity</label>
              <input 
                placeholder="e.g. Annual Members Conference 2026"
                className="w-full text-3xl font-black text-slate-800 outline-none border-b-2 border-transparent focus:border-purple-100 py-2 placeholder:text-slate-200"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">About the Event</label>
              <textarea 
                placeholder="Describe what will happen at this event..."
                className="w-full h-64 bg-slate-50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-purple-100 text-slate-600 resize-none font-medium"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Logistics Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-purple-500" /> Logistics
            </h3>

            {/* Date Selection */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <label className="text-[10px] font-black text-slate-400 uppercase">Starts</label>
                <input type="datetime-local" className="w-full bg-transparent font-bold text-slate-700 outline-none mt-1" />
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <label className="text-[10px] font-black text-slate-400 uppercase">Ends</label>
                <input type="datetime-local" className="w-full bg-transparent font-bold text-slate-700 outline-none mt-1" />
              </div>
            </div>

            {/* Location Toggle */}
            <div className="flex items-center justify-between p-2 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setFormData({...formData, isVirtual: false})}
                className={`flex-1 py-2 rounded-lg text-xs font-black transition ${!formData.isVirtual ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}
              >
                Physical
              </button>
              <button 
                onClick={() => setFormData({...formData, isVirtual: true})}
                className={`flex-1 py-2 rounded-lg text-xs font-black transition ${formData.isVirtual ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}
              >
                Virtual
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                {formData.isVirtual ? <Video size={18} className="text-blue-500" /> : <MapPin size={18} className="text-rose-500" />}
                <input 
                  placeholder={formData.isVirtual ? "Zoom/Meet Link" : "Venue Address"}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-widest">Event Banner</label>
             <div className="h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-purple-300 transition-colors cursor-pointer">
                <ImageIcon className="text-slate-300 group-hover:text-purple-400 transition-colors" size={32} />
                <span className="text-[10px] font-black text-purple-600 mt-2">UPLOAD IMAGE</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};