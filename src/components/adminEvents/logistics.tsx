import { Calendar, Clock, Video, MapPin, Sparkles, Award, Link } from 'lucide-react';

export const LogisticsSidebar = ({ data, onChange }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 font-sans">
    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
      <Sparkles size={5} className="text-purple-500" /> Logistics
    </h3>

    {/* Date & Time Section */}
    <div className="space-y-6">
      {/* Start Date & Time */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
          <Calendar size={12} /> Event Starts
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="date" 
            className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
            value={data.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
          />
          <input 
            type="time" 
            className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
            value={data.startTime}
            onChange={(e) => onChange('startTime', e.target.value)}
          />
        </div>
      </div>

      {/* End Date & Time */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
          <Clock size={12} /> Event Ends
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="date" 
            min={data.startDate}
            className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
            value={data.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
          />
          <input 
            type="time" 
            className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
            value={data.endTime}
            onChange={(e) => onChange('endTime', e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Venue Logic */}
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Venue & Type</label>
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          type="button"
          onClick={() => onChange('isVirtual', false)}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${!data.isVirtual ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
        >PHYSICAL</button>
        <button 
          type="button"
          onClick={() => onChange('isVirtual', true)}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${data.isVirtual ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
        >VIRTUAL</button>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {data.isVirtual ? <Video size={16} /> : <MapPin size={16} />}
        </div>
        <input 
          placeholder={data.isVirtual ? "Meeting Link" : "Venue Address"}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100 transition"
          value={data.location}
          onChange={(e) => onChange('location', e.target.value)}
        />
      </div>
    </div>

    {/* Additional Info */}
    <div className="space-y-4 pt-4 border-t border-slate-50">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">CPD Points</label>
        <div className="relative">
          <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="number"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 outline-none"
            value={data.cpdPoints}
            onChange={(e) => onChange('cpdPoints', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Registration Link</label>
        <div className="relative">
          <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="url"
            placeholder="https://..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 outline-none"
            value={data.registrationLink}
            onChange={(e) => onChange('registrationLink', e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
);