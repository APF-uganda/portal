import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle, ArrowLeft, CreditCard } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { baseEvents } from '../components/EventComponents/eventsData';

const EventRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const eventData = location.state as { 
    eventTitle: string; 
    eventId: string;
    location?: string;
    date?: string;
    image?: string;
    isPaid?: boolean;
    nonMemberPrice?: number;
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

  // Redirect if no event data
  if (!eventData) {
    navigate('/events');
    return null;
  }

  const localEvent = baseEvents.find(e => e.id === eventData.eventId);

  const displayLocation = eventData.location || localEvent?.location || 'TBA';
  const displayDate = eventData.date || localEvent?.date || 'TBA';
  const displayImage = eventData.image || localEvent?.image || '';

  const validateForm = () => {
    const newErrors = { fullName: '', email: '', phoneNumber: '', agreeToTerms: '' };

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
          <section
            className="relative h-[450px] flex items-center justify-center pt-[64px] bg-cover bg-center"
            style={{ backgroundImage: `url(${displayImage})` }}
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
            <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-lg">
                {eventData.eventTitle}
              </h1>
              <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base font-bold">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                  <MapPin size={18} className="text-purple-400" />
                  <span>{displayLocation}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                  <Calendar size={18} className="text-purple-400" />
                  <span>{displayDate}</span>
                </div>
              </div>
            </div>
          </section>

          <main className="flex-1 py-12 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-purple-600 mb-8 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Change Event
              </button>

              <div className="bg-white rounded-[40px] shadow-2xl shadow-purple-900/5 border border-slate-100 overflow-hidden">
                <div className="bg-purple-600 p-8 text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black">Registration Form</h2>
                    <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Please provide your details</p>
                  </div>
                  {eventData.isPaid && (
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase opacity-80">Total Fee</p>
                      <p className="text-2xl font-black">UGX {Number(eventData.nonMemberPrice).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        className={`w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition border ${errors.fullName ? 'border-red-300' : 'border-transparent'} text-sm font-bold`} 
                        placeholder="John Doe"
                        value={formData.fullName} 
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        className={`w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition border ${errors.email ? 'border-red-300' : 'border-transparent'} text-sm font-bold`} 
                        placeholder="john@company.com"
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="flex gap-3">
                      <select className="px-4 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm">
                        <option>+256</option>
                        <option>+254</option>
                      </select>
                      <input 
                        className="flex-1 px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition border-none text-sm font-bold" 
                        placeholder="700 000 000"
                        value={formData.phoneNumber} 
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attendance</label>
                      <select className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border-none text-sm font-bold appearance-none" value={formData.attendanceMode} onChange={(e) => setFormData({...formData, attendanceMode: e.target.value})}>
                        <option value="Physical">Physical</option>
                        <option value="Virtual">Virtual</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Session</label>
                      <select className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border-none text-sm font-bold appearance-none" value={formData.sessions} onChange={(e) => setFormData({...formData, sessions: e.target.value})}>
                        <option value="Full Day">Full Day</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-slate-200 text-purple-600 focus:ring-purple-500" 
                        checked={formData.agreeToTerms} 
                        onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})} 
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        I agree to the Event Terms & Conditions
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-purple-500/20 mt-4"
                  >
                    {eventData.isPaid ? <CreditCard size={18} /> : null}
                    {eventData.isPaid ? 'Proceed to Payment' : 'Complete Registration'}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </>
      ) : (
        <main className="flex-1 py-12 pt-24 bg-slate-50 flex items-center">
          <div className="max-w-xl mx-auto px-4">
            <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center border border-slate-100">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Registration Complete!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Check your email <span className="font-bold text-slate-900">{formData.email}</span> for your ticket and event schedule.
              </p>
              <button onClick={() => navigate('/events')} className="w-full py-5 bg-purple-600 text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all">
                Back to Events
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