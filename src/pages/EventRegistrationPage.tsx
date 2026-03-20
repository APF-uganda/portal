import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Award, CheckCircle, ArrowLeft, CreditCard, Users, UserPlus } from 'lucide-react';
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
    date?: string;
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
    attendanceMode: 'Physical',
    sessions: '',
    accessibilityRequests: '',
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
  const displayDate = eventData.date || localEvent?.date || 'TBA';
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
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.email && !newErrors.phoneNumber && !newErrors.agreeToTerms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {step === 1 ? (
        <>
          {/* HERO SECTION */}
          <section
            className="relative h-[550px] flex items-center justify-center overflow-hidden pt-[64px] mt-[-64px] bg-cover bg-center"
            style={{ backgroundImage: `url(${displayImage})` }}
          >
            <div className="absolute inset-0 bg-[#171a1f]/70 backdrop-blur-[1px]" />

            <div className="relative z-10 max-w-5xl mx-auto text-center text-white px-4 fade-in-up">
              <h1 className="text-3xl md:text-6xl font-black mb-6 uppercase tracking-tighter leading-tight">
                {eventData.eventTitle}
              </h1>
              
              {/* LOGISTICS */}
              <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm md:text-base font-bold uppercase tracking-widest opacity-90">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                  <MapPin size={18} className="text-purple-400" />
                  <span>{displayLocation}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                  <Calendar size={18} className="text-purple-400" />
                  <span>{displayDate}</span>
                </div>
              </div>

              
              <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                
                {/* CPD Points Hero Badge */}
                {eventData.cpdPoints && Number(eventData.cpdPoints) > 0 && (
                  <div className="flex items-center gap-2 bg-[#7E49B3] text-white px-5 py-2.5 rounded-xl border border-purple-400 shadow-lg shadow-purple-900/20">
                    <Award size={20} className="text-amber-400" />
                    <span className="text-xs md:text-sm font-black uppercase tracking-[0.1em]">
                      {eventData.cpdPoints} CPD Units
                    </span>
                  </div>
                )}

                {/* Pricing Hero Badges */}
                {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && (
                  <>
                    <div className="flex items-center gap-3 bg-white text-slate-900 px-5 py-2.5 rounded-xl border border-white shadow-lg">
                      <Users size={18} className="text-purple-600" />
                      <div className="text-left leading-none">
                        <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Member</p>
                        <p className="text-sm font-black">UGX {Number(eventData.memberPrice || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white text-slate-900 px-5 py-2.5 rounded-xl border border-white shadow-lg">
                      <UserPlus size={18} className="text-purple-600" />
                      <div className="text-left leading-none">
                        <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Non-Member</p>
                        <p className="text-sm font-black">UGX {Number(eventData.nonMemberPrice || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          <main className="flex-1 py-12" style={{ backgroundColor: '#F4F2FE' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => navigate('/events')}
                className="flex items-center text-purple-600 hover:text-purple-800 mb-8 transition-all font-bold uppercase text-xs tracking-widest"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Events
              </button>

              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-200/50 border border-white overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-8">
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Rest of the form inputs... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                       <input type="tel" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Attendance</label>
                       <select className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none" value={formData.attendanceMode} onChange={e => setFormData({...formData, attendanceMode: e.target.value})}>
                          <option value="Physical">Physical</option>
                          <option value="Virtual">Virtual</option>
                       </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#7E49B3] text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#3C096C] transition-all"
                  >
                    {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) ? 'Proceed to Payment' : 'Confirm Registration'}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </>
      ) : (
     
        <main className="flex-1 py-12 pt-24 bg-[#F4F2FE]">
          <div className="max-w-2xl mx-auto px-4 text-center bg-white p-12 rounded-[3rem] shadow-xl">
              <CheckCircle size={80} className="mx-auto text-emerald-500 mb-6" />
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Registration Confirmed!</h2>
              <p className="text-slate-500 font-medium mb-8">A confirmation email has been sent to {formData.email}</p>
              <button onClick={() => navigate('/events')} className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs">Return to Home</button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default EventRegistrationPage;