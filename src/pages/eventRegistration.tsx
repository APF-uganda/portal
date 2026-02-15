import React, { useState } from 'react';
import { User, Mail,  CheckCircle, ArrowRight } from 'lucide-react';

export const EventRegistrationForm = ({ eventTitle, eventId, onClose }: any) => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    firmName: '',
    membershipId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    console.log(`Registering for Event ${eventId}:`, formData);
    setStep(2);
  };

  if (step === 2) {
    return (
      <div className="bg-white p-12 rounded-[40px] text-center space-y-6 font-sans max-w-md mx-auto shadow-2xl">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">You're Registered!</h2>
        <p className="text-slate-500 font-medium">A confirmation email has been sent to {formData.email}. We look forward to seeing you at {eventTitle}.</p>
        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Close Window</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden font-sans max-w-lg mx-auto">
      {/* Form Header */}
      <div className="bg-[#5C32A3] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-70 mb-2">Event Registration</h2>
          <h3 className="text-2xl font-bold leading-tight">{eventTitle}</h3>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-6">
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Professional Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="text" 
                placeholder="e.g. Jane Doe"
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100 transition"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="email" 
                placeholder="jane@firm.com"
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100 transition"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Firm/Org</label>
              <input 
                type="text" 
                placeholder="Company Name"
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100"
                onChange={(e) => setFormData({...formData, firmName: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Membership ID</label>
              <input 
                type="text" 
                placeholder="APF-000"
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-purple-100"
                onChange={(e) => setFormData({...formData, membershipId: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#5C32A3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-100 flex items-center justify-center gap-2 group hover:scale-[1.02] transition-all"
        >
          Confirm Registration <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};