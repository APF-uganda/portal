import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Award, CheckCircle, ArrowLeft, CreditCard } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {step === 1 ? (
        <>
          <section
            className="relative h-[550px] flex items-center justify-center overflow-hidden pt-[56px] sm:pt-[64px] mt-[-56px] sm:mt-[-64px] bg-cover bg-center"
            style={{ backgroundImage: `url(${displayImage})` }}
          >
            <div className="absolute inset-0 bg-[#171a1f]/60" />

            <div className="relative z-20 max-w-4xl mx-auto text-center text-white px-4 fade-in-up">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 fade-in-up delay-200">
                {eventData.eventTitle}
              </h1>
              <p className="text-lg md:text-xl mb-6 fade-in-up delay-400">
                {localEvent?.description || 'Join us for this exciting event'}
              </p>
              
              {/* DATE & LOCATION */}
              <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base mb-6 fade-in-up delay-600">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-purple-400" />
                  <span className="font-medium">{displayLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-purple-400" />
                  <span className="font-medium">{displayDate}</span>
                </div>
              </div>

              {/* CPD AND PRICES UNDER DATES */}
              <div className="flex flex-col items-center gap-4 fade-in-up delay-600">
                {eventData.cpdPoints && (
                  <div className="flex items-center gap-2 bg-purple-600/90 px-4 py-2 rounded-full border border-purple-400 shadow-lg">
                    <Award size={18} className="text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {eventData.cpdPoints} CPD Units
                    </span>
                  </div>
                )}

                {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && (
                  <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-left min-w-[140px]">
                      <p className="text-[10px] text-purple-300 font-bold uppercase">Member Price</p>
                      <p className="text-lg font-black">UGX {Number(eventData.memberPrice).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-left min-w-[140px]">
                      <p className="text-[10px] text-gray-300 font-bold uppercase">Non-Member</p>
                      <p className="text-lg font-black">UGX {Number(eventData.nonMemberPrice).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <style>
              {`
                @keyframes fadeInUp {
                  0% { opacity: 0; transform: translateY(30px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                .fade-in-up { animation: fadeInUp 1s ease-out both; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-600 { animation-delay: 0.6s; }
              `}
            </style>
          </section>

          <main className="flex-1 py-12" style={{ backgroundColor: '#d0c9ea' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={handleBackToEvents}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Events
              </button>

              <div className="bg-white rounded-lg shadow-md border border-purple-300 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                  <div className="space-y-5">
                    
                    {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && (
                      <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-purple-700 uppercase tracking-wider">Registration Fee</span>
                        <span className="text-xl font-bold text-purple-900">UGX {Number(eventData.nonMemberPrice).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Full name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your Full name"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                          value={formData.fullName}
                          onChange={(e) => { setFormData({...formData, fullName: e.target.value}); setErrors({...errors, fullName: ''}); }}
                        />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Email address <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                          value={formData.email}
                          onChange={(e) => { setFormData({...formData, email: e.target.value}); setErrors({...errors, email: ''}); }}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Phone number <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <select
                            value={formData.countryCode}
                            onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                            className="w-24 px-2 py-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                          >
                            <option value="+256">+256</option>
                            <option value="+254">+254</option>
                          </select>
                          <input
                            type="tel"
                            required
                            placeholder="Enter your Phone number"
                            className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.phoneNumber}
                            onChange={(e) => { setFormData({...formData, phoneNumber: e.target.value}); setErrors({...errors, phoneNumber: ''}); }}
                          />
                        </div>
                        {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Company name</label>
                        <input
                          type="text"
                          placeholder="Enter your company name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={(e) => { setFormData({...formData, agreeToTerms: e.target.checked}); setErrors({...errors, agreeToTerms: ''}); }}
                          className="mt-1 w-4 h-4 text-purple-600"
                        />
                        <label className="text-sm text-gray-700">I agree to the terms and conditions.</label>
                      </div>
                      {errors.agreeToTerms && <p className="text-xs text-red-500 mt-1">{errors.agreeToTerms}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-6 flex items-center justify-center gap-2"
                    >
                      {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) && <CreditCard size={18} />}
                      {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) ? 'Proceed to Payment' : 'Register'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </>
      ) : (
        <main className="flex-1 py-12 pt-24" style={{ backgroundColor: '#d0c9ea' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md border border-purple-300 p-12 text-center">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) ? 'Payment Successful!' : 'Registration Successful!'}
              </h2>
              <div className="space-y-3 mb-8">
                <p className="text-gray-600 text-lg">
                  Hello <span className="font-semibold text-gray-900">{formData.fullName}</span>, 
                  you are successfully registered for:
                </p>
                <p className="text-xl font-bold text-purple-600 px-4">
                  {eventData.eventTitle}
                </p>
                <p className="text-gray-500 pt-4">
                  A confirmation has been sent to <span className="font-semibold">{formData.email}</span>.
                </p>
              </div>
              <button
                onClick={handleBackToEvents}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
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