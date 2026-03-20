import { Calendar, Clock, Video, MapPin, Sparkles, Award, Link, CreditCard, Users, UserPlus } from 'lucide-react';

export const LogisticsSidebar = ({ data, onChange }: any) => {
  const today = new Date().toISOString().split('T')[0];


  const inputStyles = "w-full bg-slate-900 border-none rounded-2xl px-4 py-3.5 text-sm font-semibold text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none";
  const labelStyles = "text-[10px] f text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5";

  return (
    <div className="bg-slate-950 p-6 md:p-8 rounded-[40px] border border-slate-800 shadow-2xl space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="font-black text-white flex items-center gap-3 text-base uppercase tracking-widest">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Sparkles size={18} className="text-[#A855F7]" />
          </div>
          Logistics
        </h3>
      </div>

      <div className="space-y-6">
        {/* START DATE & TIME */}
        <div className="space-y-3">
          <label className={labelStyles}><Calendar size={12} /> Start Schedule</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative group">
              <input type="date" min={today} className={inputStyles} value={data.startDate} onChange={(e) => onChange('startDate', e.target.value)} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400 opacity-50"><Calendar size={16} /></div>
            </div>
            <div className="relative group">
              <input type="time" className={inputStyles} value={data.startTime} onChange={(e) => onChange('startTime', e.target.value)} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400 opacity-50"><Clock size={16} /></div>
            </div>
          </div>
        </div>

        {/* END DATE & TIME */}
        <div className="space-y-3 pt-2">
          <label className={labelStyles}><Clock size={12} /> End Schedule</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input type="date" min={data.startDate || today} className={inputStyles} value={data.endDate} onChange={(e) => onChange('endDate', e.target.value)} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400 opacity-50"><Calendar size={16} /></div>
            </div>
            <div className="relative">
              <input type="time" className={inputStyles} value={data.endTime} onChange={(e) => onChange('endTime', e.target.value)} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400 opacity-50"><Clock size={16} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* VENUE TOGGLE */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <label className={labelStyles}>Venue </label>
        <div className="flex bg-slate-900 p-1.5 rounded-[20px] border border-slate-800">
          <button type="button" onClick={() => onChange('isVirtual', false)}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${!data.isVirtual ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-500 hover:text-slate-300'}`}
          >PHYSICAL</button>
          <button type="button" onClick={() => onChange('isVirtual', true)}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${data.isVirtual ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-500 hover:text-slate-300'}`}
          >VIRTUAL</button>
        </div>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
            {data.isVirtual ? <Video size={16} /> : <MapPin size={16} />}
          </div>
          <input placeholder={data.isVirtual ? "Meeting Link" : "Venue Address"} className={`${inputStyles} pl-12`} value={data.location} onChange={(e) => onChange('location', e.target.value)} />
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex justify-between items-center px-1">
          <label className={labelStyles}><CreditCard size={12} /> Financials</label>
          <button type="button" onClick={() => onChange('isPaid', !data.isPaid)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all ${data.isPaid ? 'border-purple-500/50 bg-purple-500/10' : 'border-slate-800 bg-slate-900'}`}
          >
            <span className={`text-[10px] font-black tracking-widest ${data.isPaid ? 'text-purple-400' : 'text-slate-600'}`}>{data.isPaid ? 'PAID' : 'FREE'}</span>
            <div className={`w-8 h-4 rounded-full relative ${data.isPaid ? 'bg-purple-600' : 'bg-slate-700'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${data.isPaid ? 'left-4.5 ml-0.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>

        {data.isPaid && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Member (UGX)</label>
              <input type="number" className={inputStyles} placeholder="0" value={data.memberPrice} onChange={(e) => onChange('memberPrice', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Non-Member</label>
              <input type="number" className={inputStyles} placeholder="0" value={data.nonMemberPrice} onChange={(e) => onChange('nonMemberPrice', Number(e.target.value))} />
            </div>
          </div>
        )}
      </div>

      {/* ACCREDITATION */}
      <div className="pt-6 border-t border-slate-800">
        <label className={labelStyles}><Award size={12} /> CPD Points</label>
        <div className="mt-3 relative group">
          <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
          <input type="number" className={`${inputStyles} pl-12 focus:ring-amber-500/50`} placeholder="0" value={data.cpdPoints} onChange={(e) => onChange('cpdPoints', Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
};