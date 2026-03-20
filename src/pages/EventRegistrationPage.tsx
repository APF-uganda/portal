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

  // Updated interface to match LogisticsSidebar keys
  const eventData = location.state as { 
    eventTitle: string; 
    eventId: string;
    location?: string;
    startDate?: string; // Changed from date
    endDate?: string;   // Added
    startTime?: string;
    endTime?: string;
    image?: string;
    isPaid?: boolean;
    memberPrice?: number;
    nonMemberPrice?: number;
    cpdPoints?: number;
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
  
  // Format Date Range
  const displayStartDate = eventData.startDate || localEvent?.date || 'TBA';
  const displayEndDate = eventData.endDate || '';
  const displayTime = eventData.startTime ? `${eventData.startTime} - ${eventData.endTime || ''}` : '';
  
  const displayImage = eventData.image || localEvent?.image || DEFAULT_FALLBACK;

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
          <section
            className="relative h-[600px] flex items-center justify-center overflow-hidden pt-[56px] sm:pt-[64px] mt-[-56px] sm:mt-[-64px] bg-cover bg-center"
            style={{ backgroundImage: `url(${displayImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#171a1f]/80 to-[#d0c9ea]" />

            <div className="relative z-20 max-w-5xl mx-auto text-center text-white px-4">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-[0.2em] fade-in-up">
                Event Registration
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black mb-6 fade-in-up delay-200 tracking-tight">
                {eventData.eventTitle}
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto fade-in-up delay-400 font-medium">
                {localEvent?.description || 'Join us for this professional development session designed for modern practitioners.'}
              </p>
              
              {/* MODERNIZED LOGISTICS CHIPS */}
              <div className="flex flex-wrap justify-center gap-4 mb-10 fade-in-up delay-600">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-xl">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Calendar size={20} className="text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Date</p>
                    <p className="text-sm font-bold">
                      {displayStartDate} {displayEndDate && ` - ${displayEndDate}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-xl">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <MapPin size={20} className="text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Venue</p>
                    <p className="text-sm font-bold">{displayLocation}</p>
                  </div>
                </div>

                {eventData.cpdPoints ? (
                  <div className="flex items-center gap-3 bg-amber-500/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-amber-500/20 shadow-xl">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Award size={20} className="text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Accreditation</p>
                      <p className="text-sm font-bold">{eventData.cpdPoints} CPD Units</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* PRICING CARDS */}
              {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && (
                <div className="flex justify-center gap-4 fade-in-up delay-600">
                  <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-left w-44 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-2 -top-2 bg-purple-500/20 w-12 h-12 rounded-full blur-xl" />
                    <p className="text-[10px] text-purple-300 font-black uppercase tracking-widest mb-1">Members</p>
                    <p className="text-2xl font-black">
                      <span className="text-xs mr-1 text-gray-400 font-normal">UGX</span>
                      {Number(eventData.memberPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-left w-44 shadow-2xl group">
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

          <main className="flex-1 py-12" style={{ backgroundColor: '#d0c9ea' }}>
            <div className="max-w-4xl mx-auto px-4">
              <button
                onClick={handleBackToEvents}
                className="group flex items-center text-purple-900 font-bold mb-8 transition-all hover:gap-3"
              >
                <div className="p-2 bg-white rounded-full shadow-sm mr-3 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <ArrowLeft size={18} />
                </div>
                Back to Events
              </button>

              <div className="bg-white rounded-[32px] shadow-2xl border border-purple-200/50 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 md:p-12">
                  <div className="space-y-6">
                    {/* Dynamic Pricing Info in Form */}
                    {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && (
                      <div className="bg-slate-50 border border-slate-100 p-6 rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Selected Tier</span>
                          <span className="text-lg font-black text-slate-800">Standard Registration</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Investment</span>
                          <span className="text-2xl font-black text-[#7E49B3]">UGX {Number(eventData.nonMemberPrice).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none text-sm font-medium transition-all"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none text-sm font-medium transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#7E49B3] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#6a3d99] hover:shadow-xl hover:shadow-purple-200 transform transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
                    >
                      {eventData.isPaid ? (
                        <>
                          <CreditCard size={20} />
                          Secure My Spot
                        </>
                      ) : 'Confirm Registration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </>
      ) : (
        /* Success step remains largely the same but with rounded-32px */
        <main className="flex-1 py-12 pt-24" style={{ backgroundColor: '#d0c9ea' }}>
           <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center border border-white">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-12">
                <CheckCircle size={40} className="-rotate-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">You're In!</h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Confirmation for <span className="text-slate-900 font-bold">{eventData.eventTitle}</span> has been sent to your inbox.
              </p>
              <button
                onClick={handleBackToEvents}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Return to Dashboard
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