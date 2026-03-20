import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Award, CheckCircle, ArrowLeft, CreditCard, Clock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { baseEvents } from '../components/EventComponents/eventsData';

const EventRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800";

  
  const eventData = location.state as { 
    eventTitle: string; 
    eventId: string;
    location?: string;
    startDate?: string; 
    endDate?: string;   
    displayDate?: string; 
    startTime?: string;
    endTime?: string;
    image?: string;
    isPaid?: boolean;
    memberPrice?: number;
    nonMemberPrice?: number;
    cpdPoints?: number;
    description?: string;
  } | null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+256',
    phoneNumber: '',
    companyName: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    agreeToTerms: ''
  });

  if (!eventData) {
    navigate('/events');
    return null;
  }

  const localEvent = baseEvents.find(e => e.id === eventData.eventId);
  const displayLocation = eventData.location || localEvent?.location || 'TBA';
  const displayImage = eventData.image || localEvent?.image || DEFAULT_FALLBACK;
  
  
  const finalDateDisplay = eventData.displayDate || eventData.startDate || localEvent?.date || 'TBA';

  const validateForm = () => {
    const newErrors = { fullName: '', email: '', phoneNumber: '', agreeToTerms: '' };
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.email && !newErrors.phoneNumber && !newErrors.agreeToTerms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setStep(2);
  };

  const handleBackToEvents = () => navigate('/events');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {step === 1 ? (
        <>
          {/* HERO SECTION */}
          <section
            className="relative h-[650px] flex items-center justify-center overflow-hidden pt-[56px] sm:pt-[64px] mt-[-56px] sm:mt-[-64px] bg-cover bg-center"
            style={{ backgroundImage: `url(${displayImage})` }}
          >
            {/* Darker gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#171a1f]/70 to-[#d0c9ea]" />

            <div className="relative z-20 max-w-5xl mx-auto text-center text-white px-4">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-purple-500/30 backdrop-blur-md border border-purple-400/30 text-purple-200 text-xs font-black uppercase tracking-[0.2em] fade-in-up">
                Event Registration
              </div>
              
              <h1 className="text-4xl md:text-6xl  mb-6 fade-in-up delay-200 tracking-tight leading-tight">
                {eventData.eventTitle}
              </h1>
              
              <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-3xl mx-auto fade-in-up delay-400 font-medium leading-relaxed">
                {eventData.description || localEvent?.description || 'Join us for this professional development session designed for modern practitioners.'}
              </p>
              
              {/* LOGISTICS ROW */}
              <div className="flex flex-wrap justify-center gap-4 mb-10 fade-in-up delay-600">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
                  <div className="p-2.5 bg-purple-500/20 rounded-xl">
                    <Calendar size={22} className="text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-black text-purple-300 tracking-widest">Schedule</p>
                    <p className="text-sm font-bold">{finalDateDisplay}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
                  <div className="p-2.5 bg-purple-500/20 rounded-xl">
                    <MapPin size={22} className="text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-black text-purple-300 tracking-widest">Location</p>
                    <p className="text-sm font-bold">{displayLocation}</p>
                  </div>
                </div>

                {Number(eventData.cpdPoints) > 0 && (
                  <div className="flex items-center gap-3 bg-amber-500/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-amber-500/20 shadow-2xl">
                    <div className="p-2.5 bg-amber-500/20 rounded-xl">
                      <Award size={22} className="text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-black text-amber-300 tracking-widest">Accreditation</p>
                      <p className="text-sm font-bold">{eventData.cpdPoints} CPD Units</p>
                    </div>
                  </div>
                )}
              </div>

              {/* PRICING ROW */}
              {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && (
                <div className="flex flex-wrap justify-center gap-4 fade-in-up delay-600">
                  <div className="bg-gradient-to-br from-white/15 to-transparent backdrop-blur-xl border border-white/20 p-5 rounded-[24px] text-left w-48 shadow-2xl">
                    <p className="text-[10px] text-purple-300 font-black uppercase tracking-widest mb-1">Members</p>
                    <p className="text-2xl font-black">
                      <span className="text-xs mr-1 text-gray-400 font-normal">UGX</span>
                      {Number(eventData.memberPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 p-5 rounded-[24px] text-left w-48 shadow-2xl">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Non-Members</p>
                    <p className="text-2xl font-black text-white/90">
                       <span className="text-xs mr-1 text-gray-500 font-normal">UGX</span>
                       {Number(eventData.nonMemberPrice || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <style>
              {`
                @keyframes fadeInUp {
                  0% { opacity: 0; transform: translateY(30px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-600 { animation-delay: 0.6s; }
              `}
            </style>
          </section>

          {/* FORM SECTION */}
          <main className="flex-1 py-16" style={{ backgroundColor: '#d0c9ea' }}>
            <div className="max-w-4xl mx-auto px-4">
              <button
                onClick={handleBackToEvents}
                className="group flex items-center text-purple-900 font-black mb-10 transition-all"
              >
                <div className="p-2.5 bg-white rounded-full shadow-lg mr-4 group-hover:bg-[#7E49B3] group-hover:text-white transition-all transform group-hover:-translate-x-1">
                  <ArrowLeft size={18} />
                </div>
                Back to Events
              </button>

              <div className="bg-white rounded-[40px] shadow-2xl border border-purple-200/40 overflow-hidden transform transition-all">
                <form onSubmit={handleSubmit} className="p-10 md:p-14">
                  <div className="space-y-8">
                    {/* Selected Summary */}
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-[#7E49B3]">
                          <CheckCircle size={24} />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] block mb-1">Registration Type</span>
                          <span className="text-lg  text-slate-800">Professional Delegate</span>
                        </div>
                      </div>
                      
                      {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && (
                        <div className="text-left sm:text-right">
                          <span className="text-[10px]  text-slate-400 uppercase tracking-[0.2em] block mb-1">Total Due</span>
                          <span className="text-3xl  text-[#7E49B3]">UGX {Number(eventData.nonMemberPrice).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs  text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your official name"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none text-sm font-bold transition-all"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50 outline-none text-sm font-bold transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-[#7E49B3] text-white py-5 rounded-[24px] font-black text-lg hover:bg-[#6a3d99] shadow-xl hover:shadow-purple-300 transform transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
                      >
                        {eventData.isPaid ? (
                          <>
                            <CreditCard size={22} className="group-hover:rotate-12 transition-transform" />
                            Secure My Spot
                          </>
                        ) : (
                          <>
                            <CheckCircle size={22} />
                            Complete Registration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </>
      ) : (
        /* SUCCESS STEP */
        <main className="flex-1 py-16 flex items-center justify-center" style={{ backgroundColor: '#d0c9ea' }}>
           <div className="max-w-2xl mx-auto px-4 w-full">
            <div className="bg-white rounded-[48px] shadow-2xl p-16 text-center border border-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 transform rotate-12 shadow-inner">
                <CheckCircle size={48} className="-rotate-12" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">You're Confirmed!</h2>
              <div className="space-y-4 mb-10">
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Excellent, <span className="text-slate-900 font-bold">{formData.fullName}</span>! You've successfully secured your place at:
                </p>
                <p className="text-2xl font-black text-[#7E49B3] px-6">
                  {eventData.eventTitle}
                </p>
                <p className="text-sm text-slate-400 italic">
                  A receipt and calendar invite has been sent to {formData.email}.
                </p>
              </div>
              <button
                onClick={handleBackToEvents}
                className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-[20px] font-black hover:bg-slate-800 transition-all shadow-xl"
              >
                Go to My Dashboard
              </button>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default EventRegistrationPage;