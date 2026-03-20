import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Award, CheckCircle, ArrowLeft, CreditCard, Upload, FileText, X, Clock, AlertCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { baseEvents } from '../components/EventComponents/eventsData';
import eventService from '../services/eventService'; 

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

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  
  // Custom Notification State 
  const [notification, setNotification] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({
    show: false, msg: '', type: 'success'
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+256',
    phoneNumber: '',
    companyName: '',
    agreeToTerms: false
  });

  if (!eventData) {
    navigate('/events');
    return null;
  }

  const localEvent = baseEvents.find(e => e.id === eventData.eventId);
  const displayLocation = eventData.location || localEvent?.location || 'TBA';
  const displayImage = eventData.image || localEvent?.image || DEFAULT_FALLBACK;
  const displayTime = eventData.startTime ? `${eventData.startTime} - ${eventData.endTime || ''}` : 'TBA';
  
  const finalDateDisplay = eventData.displayDate || 
    (eventData.startDate ? new Date(eventData.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null) || 
    localEvent?.date || 'TBA';

  const showToast = (msg: string, type: 'success' | 'error') => {
    setNotification({ show: true, msg, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      showToast("Please agree to the terms.", "error");
      return;
    }
    if (eventData.isPaid || Number(eventData.nonMemberPrice) > 0) {
      setStep(2);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const data = new FormData();
    data.append('full_name', formData.fullName);
    data.append('email', formData.email);
    data.append('phone_number', `${formData.countryCode}${formData.phoneNumber}`);
    data.append('company_name', formData.companyName);
    data.append('event_id', eventData.eventId);
    if (proofOfPayment) data.append('proof_of_payment', proofOfPayment);

    try {
      //  sends to Admin & triggers the confirmation email logic on backend
      await eventService.registerAttendee(data);
      showToast("Registration submitted successfully!", "success");
      setStep(3);
    } catch (error) {
      showToast("Submission failed. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfPayment(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/*  Notification */}
      {notification.show && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border animate-in slide-in-from-top-5 duration-300 ${
          notification.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
          <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      <Navbar />
      
      {step === 1 && (
        <>
          <section
            className="relative h-[450px] flex items-center justify-center overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${displayImage})` }}
          >
            <div className="absolute inset-0 bg-slate-900/80" />

            <div className="relative z-20 max-w-5xl mx-auto text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight uppercase">
                {eventData.eventTitle}
              </h1>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <MapPin size={16} className="text-purple-400" />
                  <span className="font-semibold">{displayLocation}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Calendar size={16} className="text-purple-400" />
                  <span className="font-semibold">{finalDateDisplay}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <Clock size={16} className="text-purple-400" />
                  <span className="font-semibold">{displayTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {Number(eventData.cpdPoints) > 0 && (
                  <div className="flex items-center gap-2 bg-amber-500 px-4 py-1.5 rounded-full">
                    <Award size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">{eventData.cpdPoints} CPD Units</span>
                  </div>
                )}
                <div className="bg-purple-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Member: UGX {Number(eventData.memberPrice).toLocaleString()} | Non-Member: UGX {Number(eventData.nonMemberPrice).toLocaleString()}
                </div>
              </div>
            </div>
          </section>

          <main className="flex-1 py-12 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4">
              <button onClick={() => navigate('/events')} className="flex items-center text-slate-500 font-bold mb-6 hover:text-purple-600 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Events
              </button>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleInitialSubmit} className="p-8 sm:p-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full name</label>
                        <input
                          type="text" required placeholder="Full Name"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email address</label>
                        <input
                          type="email" required placeholder="Email"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone number</label>
                        <div className="flex gap-2">
                          <select className="px-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold">
                            <option>+256</option>
                            <option>+254</option>
                          </select>
                          <input
                            type="tel" required placeholder="700 000 000"
                            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Company</label>
                        <input
                          type="text" placeholder="Optional"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <input
                        type="checkbox" required checked={formData.agreeToTerms}
                        onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-300 text-purple-600"
                      />
                      <label className="text-sm text-slate-600 font-medium">I agree to the terms and conditions.</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-purple-600 transition-all flex items-center justify-center gap-3 mt-4 shadow-lg shadow-slate-200"
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
        <main className="flex-1 py-12 flex items-center bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Price</p>
                  <p className="text-lg font-bold text-slate-700">UGX {Number(eventData.memberPrice).toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Non-Member Price</p>
                  <p className="text-lg font-bold text-purple-700">UGX {Number(eventData.nonMemberPrice).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 mb-8">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Merchant Code</span>
                <span className="text-3xl font-bold text-white tracking-tighter">345678</span>
              </div>

              <div className="space-y-4 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Upload Receipt</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${proofOfPayment ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-purple-300 bg-slate-50'}`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                  {proofOfPayment ? (
                    <div className="flex items-center gap-3 text-green-700 font-bold">
                      <FileText size={20} />
                      <span className="truncate max-w-[200px] text-sm">{proofOfPayment.name}</span>
                      <X size={18} className="text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setProofOfPayment(null); }} />
                    </div>
                  ) : (
                    <>
                      <Upload className="text-slate-400" size={24} />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Click to upload proof</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button onClick={() => setStep(1)} className="py-4 text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600 transition-all">Back</button>
                <button 
                  disabled={!proofOfPayment || isSubmitting}
                  onClick={handleFinalSubmit}
                  className="bg-purple-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-purple-700 disabled:opacity-50 shadow-lg shadow-purple-100 transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {step === 3 && (
        <main className="flex-1 py-12 flex items-center bg-slate-50">
          <div className="max-w-xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Registration Received!</h2>
            <p className="text-slate-600 mb-10">
              Thank you <span className="font-bold text-slate-900">{formData.fullName}</span>. We've received your registration for <span className="font-bold text-purple-600">{eventData.eventTitle}</span>. A confirmation email has been sent to <span className="font-bold text-slate-900">{formData.email}</span>.
            </p>
            <button
              onClick={() => navigate('/events')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl"
            >
              Return to Events
            </button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default EventRegistrationPage;