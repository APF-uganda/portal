import React, { useState } from 'react';
import { User, Mail, CheckCircle, ArrowRight, X, Video, MapPin } from 'lucide-react';

export const EventRegistrationForm = ({ eventTitle, eventId, onClose }: any) => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    firmName: '',
    membershipId: '',
    attendanceMode: 'Physical' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Registering for Event ${eventId}:`, formData);
    setStep(2);
  };

  
  if (step === 2) {
    return (
      <div className="bg-white p-12 rounded-[40px] text-center space-y-6 font-montserrat max-w-md mx-auto shadow-2xl relative">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Success!</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          You are registered for the <span className="text-[#5C32A3] font-bold">{formData.attendanceMode}</span> session. 
          Check <span className="font-bold">{formData.email}</span> for your confirmation.
        </p>
        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5C32A3] transition-colors">
          Close Window
        </button>
      </div>
    );
  }

  // FORM STATE
  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden font-montserrat max-w-lg mx-auto relative">
      
     
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all backdrop-blur-md"
      >
        <X size={20} />
      </button>

      {/* Form Header */}
      <div className="bg-[#5C32A3] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Secure Your Spot</h2>
          <h3 className="text-2xl font-bold leading-tight tracking-tight">{eventTitle}</h3>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-6">
        
        
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Attendance Preference</label>
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData({...formData, attendanceMode: 'Physical'})}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${formData.attendanceMode === 'Physical' ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
            >
              <MapPin size={14} /> Physical
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, attendanceMode: 'Virtual'})}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${formData.attendanceMode === 'Virtual' ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
            >
              <Video size={14} /> Virtual
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Professional Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="text" 
                placeholder="e.g. CPA Joshua Lumu"
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100 transition shadow-inner"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest"> Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="email" 
                placeholder="Enter your Email"
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100 transition shadow-inner"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Organization</label>
              <input 
                type="text" 
                placeholder="Firm Name"
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm  text-slate-700 outline-none focus:ring-2 ring-purple-100 shadow-inner"
                onChange={(e) => setFormData({...formData, firmName: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Member ID</label>
              <input 
                type="text" 
                placeholder="Optional"
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100 shadow-inner"
                onChange={(e) => setFormData({...formData, membershipId: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#5C32A3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-100 flex items-center justify-center gap-2 group hover:bg-[#4a2885] active:scale-[0.98] transition-all"
        >
         Register  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};