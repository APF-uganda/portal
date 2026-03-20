import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Award, CheckCircle, ArrowLeft, CreditCard, Upload, FileText, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { baseEvents } from '../components/EventComponents/eventsData';

const EventRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // STEP 1: Details, STEP 2: Payment (if paid), STEP 3: Success
  const [step, setStep] = useState(1);
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
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
  
  // Robust date pulling logic
  const finalDateDisplay = eventData.displayDate || 
    (eventData.startDate ? new Date(eventData.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null) || 
    localEvent?.date || 
    'TBA';

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

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (eventData.isPaid || Number(eventData.nonMemberPrice) > 0) {
        setStep(2); // Go to payment upload
      } else {
        handleFinalSubmit();
      }
    }
  };

  const handleFinalSubmit = async () => {
  
    console.log("Submitting registration for:", formData.email);
    setStep(3); // Success state
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfPayment(e.target.files[0]);
    }
  };

  const handleBackToEvents = () => navigate('/events');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {step === 1 && (
        <>
          {/* HERO SECTION*/}
          <section
            className="relative h-[400px] flex items-center justify-center overflow-hidden pt-[56px] sm:pt-[64px] mt-[-56px] sm:mt-[-64px] bg-cover bg-center"
            style={{ backgroundImage: `url(${displayImage})` }}
          >
            <div className="absolute inset-0 bg-[#171a1f]/70" />

            <div className="relative z-20 max-w-4xl mx-auto text-center text-white px-4 fade-in-up">
              <h1 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
                {eventData.eventTitle}
              </h1>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base mb-8">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <MapPin size={18} className="text-purple-400" />
                  <span className="font-bold">{displayLocation}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <Calendar size={18} className="text-purple-400" />
                  <span className="font-bold">{finalDateDisplay}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                {Number(eventData.cpdPoints) > 0 && (
                  <div className="flex items-center gap-2 bg-amber-500 px-4 py-1.5 rounded-full shadow-lg">
                    <Award size={16} className="text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {eventData.cpdPoints} CPD Units
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <main className="flex-1 py-12" style={{ backgroundColor: '#f3f0ff' }}>
            <div className="max-w-3xl mx-auto px-4">
              <button onClick={handleBackToEvents} className="flex items-center text-purple-900 font-bold mb-6 hover:gap-2 transition-all">
                <ArrowLeft size={20} className="mr-2" /> Back to Events
              </button>

              <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
                <form onSubmit={handleInitialSubmit} className="p-8 sm:p-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full name</label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email address</label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone number</label>
                        <div className="flex gap-2">
                          <select className="px-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold">
                            <option>+256</option>
                            <option>+254</option>
                          </select>
                          <input
                            type="tel"
                            required
                            placeholder="700 000 000"
                            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Company</label>
                        <input
                          type="text"
                          placeholder="Optional"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreeToTerms}
                        onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label className="text-sm text-slate-600 font-medium">I agree to the terms and conditions.</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                      {(eventData.isPaid || Number(eventData.nonMemberPrice) > 0) ? (
                        <>Proceed to Payment <ArrowLeft className="rotate-180" size={18} /></>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </>
      )}

      {step === 2 && (
        /* PAYMENT PROOF UPLOAD STEP */
        <main className="flex-1 py-12 pt-32" style={{ backgroundColor: '#f3f0ff' }}>
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-[40px] shadow-2xl border border-purple-100 overflow-hidden p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Complete Your Payment</h2>
              <p className="text-slate-500 mb-8">Please pay <span className="font-bold text-purple-600">UGX {Number(eventData.nonMemberPrice).toLocaleString()}</span> to the merchant code below and upload proof.</p>
              
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Merchant Code</span>
                <span className="text-4xl font-black text-purple-600 tracking-tighter">345678</span>
              </div>

              <div className="space-y-4 text-left">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Upload Receipt / Screenshot</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${proofOfPayment ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-purple-400 bg-slate-50'}`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                  {proofOfPayment ? (
                    <div className="flex items-center gap-3 text-green-700 font-bold">
                      <FileText size={20} />
                      <span className="truncate max-w-[200px]">{proofOfPayment.name}</span>
                      <X size={18} className="text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setProofOfPayment(null); }} />
                    </div>
                  ) : (
                    <>
                      <Upload className="text-slate-400" size={24} />
                      <span className="text-sm font-bold text-slate-400 uppercase">Click to upload proof</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button onClick={() => setStep(1)} className="py-4 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Back</button>
                <button 
                  disabled={!proofOfPayment}
                  onClick={handleFinalSubmit}
                  className={`py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${proofOfPayment ? 'bg-purple-600 text-white shadow-purple-200 hover:bg-purple-700' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {step === 3 && (
        /* SUCCESS STATE */
        <main className="flex-1 py-12 pt-32" style={{ backgroundColor: '#f3f0ff' }}>
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-[40px] shadow-2xl border border-purple-100 p-12 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Registration Received!</h2>
              <div className="space-y-4 mb-10">
                <p className="text-slate-600 text-lg">
                  Hello <span className="font-bold text-slate-900">{formData.fullName}</span>, we've received your registration for:
                </p>
                <p className="text-xl font-black text-purple-600 bg-purple-50 py-3 rounded-2xl px-6 inline-block">
                  {eventData.eventTitle}
                </p>
                <p className="text-sm text-slate-500 pt-4">
                  A confirmation email is being sent to <span className="font-bold">{formData.email}</span>.
                </p>
              </div>
              <button
                onClick={handleBackToEvents}
                className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
              >
                Return to Events
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