import React from 'react';
import { Calendar, Clock, Video, MapPin, Sparkles, Award, CreditCard } from 'lucide-react';

export const LogisticsSidebar = ({ data, onChange }: any) => {
  const today = new Date().toISOString().split('T')[0];

 
  const inputStyles = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none";
  const labelStyles = "text-[10px] text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5 font-bold";

  return (
    <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <h3 className="text-slate-900 flex items-center gap-3 text-base font-black uppercase tracking-widest">
          <div className="p-2 bg-purple-50 rounded-xl">
            <Sparkles size={18} className="text-purple-600" />
          </div>
          Logistics
        </h3>
      </div>

      <div className="space-y-6">
        {/* START SCHEDULE */}
        <div className="space-y-3">
          <label className={labelStyles}><Calendar size={12} /> Start Schedule</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative group">
              <input 
                type="date" 
                min={today} 
                className={inputStyles} 
                value={data.startDate || ''} 
                onChange={(e) => onChange('startDate', e.target.value)} 
              />
            </div>
            <div className="relative group">
              <input 
                type="time" 
                className={inputStyles} 
                value={data.startTime || ''} 
                onChange={(e) => onChange('startTime', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* END SCHEDULE */}
        <div className="space-y-3 pt-2">
          <label className={labelStyles}><Clock size={12} /> End Schedule (Optional)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input 
                type="date" 
                min={data.startDate || today} 
                className={inputStyles} 
                value={data.endDate || ''} 
                onChange={(e) => onChange('endDate', e.target.value)} 
              />
            </div>
            <div className="relative">
              <input 
                type="time" 
                className={inputStyles} 
                value={data.endTime || ''} 
                onChange={(e) => onChange('endTime', e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* VENUE TOGGLE */}
      <div className="space-y-4 pt-4 border-t border-slate-50">
        <label className={labelStyles}>Venue </label>
        <div className="flex bg-slate-50 p-1.5 rounded-[20px] border border-slate-100">
          <button type="button" onClick={() => onChange('isVirtual', false)}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${!data.isVirtual ? 'bg-white text-purple-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >PHYSICAL</button>
          <button type="button" onClick={() => onChange('isVirtual', true)}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${data.isVirtual ? 'bg-white text-purple-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >VIRTUAL</button>
        </div>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
            {data.isVirtual ? <Video size={16} /> : <MapPin size={16} />}
          </div>
          <input 
            placeholder={data.isVirtual ? "Meeting Link" : "Venue Address"} 
            className={`${inputStyles} pl-12`} 
            value={data.location || ''} 
            onChange={(e) => onChange('location', e.target.value)} 
          />
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="space-y-4 pt-6 border-t border-slate-50">
        <div className="flex justify-between items-center px-1">
          <label className={labelStyles}><CreditCard size={12} /> Payment</label>
          <button type="button" onClick={() => onChange('isPaid', !data.isPaid)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all ${data.isPaid ? 'border-purple-200 bg-purple-50' : 'border-slate-200 bg-slate-50'}`}
          >
            <span className={`text-[10px] font-black tracking-widest ${data.isPaid ? 'text-purple-600' : 'text-slate-400'}`}>{data.isPaid ? 'PAID' : 'FREE'}</span>
            <div className={`w-8 h-4 rounded-full relative ${data.isPaid ? 'bg-purple-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${data.isPaid ? 'left-4.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>

        {data.isPaid && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Member (UGX)</label>
              <input type="number" className={inputStyles} placeholder="0" value={data.memberPrice || ''} onChange={(e) => onChange('memberPrice', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Non-Member</label>
              <input type="number" className={inputStyles} placeholder="0" value={data.nonMemberPrice || ''} onChange={(e) => onChange('nonMemberPrice', Number(e.target.value))} />
            </div>
          </div>
        )}
      </div>

      {/* ACCREDITATION */}
      <div className="pt-6 border-t border-slate-50">
        <label className={labelStyles}><Award size={12} /> CPD Hours</label>
        <div className="mt-3 relative group">
          <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
          <input type="number" className={`${inputStyles} pl-12 focus:ring-amber-500/20`} placeholder="0" value={data.cpdPoints || ''} onChange={(e) => onChange('cpdPoints', Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
};