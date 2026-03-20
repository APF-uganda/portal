import { Calendar, Clock, Video, MapPin, Sparkles, Award, Link, CreditCard, Users, UserPlus } from 'lucide-react';

export const LogisticsSidebar = ({ data, onChange }: any) => {
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-sm space-y-6 md:space-y-8 font-sans">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base uppercase tracking-widest">
        <Sparkles size={16} className="md:w-5 md:h-5 text-[#7E49B3]" /> Logistics
      </h3>

      <div className="space-y-4 md:space-y-6">
        {/* Start Date & Time */}
        <div className="space-y-2">
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
            <Calendar size={12} className="md:w-3.5 md:h-3.5" /> Event Starts
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="date" 
              min={today} 
              className="bg-slate-50 border-none rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
              value={data.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
            />
            <input 
              type="time" 
              className="bg-slate-50 border-none rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
              value={data.startTime}
              onChange={(e) => onChange('startTime', e.target.value)}
            />
          </div>
        </div>

        {/* End Date & Time */}
        <div className="space-y-2">
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
            <Clock size={12} className="md:w-3.5 md:h-3.5" /> Event Ends
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="date" 
              min={data.startDate || today} 
              className="bg-slate-50 border-none rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
              value={data.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
            />
            <input 
              type="time" 
              className="bg-slate-50 border-none rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition" 
              value={data.endTime}
              onChange={(e) => onChange('endTime', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Venue Logic */}
      <div className="space-y-3 md:space-y-4">
        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase ml-1">Venue & Type</label>
        <div className="flex bg-slate-100 p-1 rounded-xl md:rounded-2xl">
          <button 
            type="button"
            onClick={() => onChange('isVirtual', false)}
            className={`flex-1 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all ${!data.isVirtual ? 'bg-white text-[#7E49B3] shadow-sm' : 'text-gray-400'}`}
          >PHYSICAL</button>
          <button 
            type="button"
            onClick={() => onChange('isVirtual', true)}
            className={`flex-1 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all ${data.isVirtual ? 'bg-white text-[#7E49B3] shadow-sm' : 'text-gray-400'}`}
          >VIRTUAL</button>
        </div>
        <div className="relative">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {data.isVirtual ? <Video size={14} className="md:w-4 md:h-4" /> : <MapPin size={14} className="md:w-4 md:h-4" />}
          </div>
          <input 
            placeholder={data.isVirtual ? "Meeting Link" : "Venue Address"}
            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition"
            value={data.location}
            onChange={(e) => onChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Payment Settings Section */}
      <div className="space-y-3 md:space-y-4 pt-4 border-t border-slate-50">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase flex items-center gap-1">
            <CreditCard size={12} className="md:w-3.5 md:h-3.5" /> Payment
          </label>
          <div className="flex items-center gap-2">
             <span className={`text-xs md:text-sm font-bold ${!data.isPaid ? 'text-green-600' : 'text-gray-300'}`}>FREE</span>
             <button 
                type="button"
                onClick={() => onChange('isPaid', !data.isPaid)}
                className={`w-10 md:w-12 h-5 md:h-6 rounded-full relative transition-colors ${data.isPaid ? 'bg-[#7E49B3]' : 'bg-slate-200'}`}
             >
                <div className={`absolute top-0.5 md:top-1 w-3 md:w-4 h-3 md:h-4 bg-white rounded-full transition-all ${data.isPaid ? 'left-6 md:left-7' : 'left-1'}`} />
             </button>
             <span className={`text-xs md:text-sm font-bold ${data.isPaid ? 'text-[#7E49B3]' : 'text-gray-300'}`}>PAID</span>
          </div>
        </div>

        {data.isPaid && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <Users size={12} className="md:w-3.5 md:h-3.5" /> Member Price (UGX)
              </label>
              <input 
                type="number"
                placeholder="e.g. 120000"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition"
                value={data.memberPrice}
                onChange={(e) => onChange('memberPrice', Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                <UserPlus size={12} className="md:w-3.5 md:h-3.5" /> Non-Member Price (UGX)
              </label>
              <input 
                type="number"
                placeholder="e.g. 140000"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition"
                value={data.nonMemberPrice}
                onChange={(e) => onChange('nonMemberPrice', Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="space-y-3 md:space-y-4 pt-4 border-t border-slate-50">
        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase ml-1">CPD Points</label>
          <div className="relative">
            <Award className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            <input 
              type="number"
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition"
              value={data.cpdPoints}
              onChange={(e) => onChange('cpdPoints', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-bold text-gray-500 uppercase ml-1">Registration Link</label>
          <div className="relative">
            <Link className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            <input 
              type="url"
              placeholder="https://..."
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 bg-slate-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition"
              value={data.registrationLink}
              onChange={(e) => onChange('registrationLink', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};