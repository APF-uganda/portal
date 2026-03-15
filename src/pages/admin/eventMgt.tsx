import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/cmsApi'; 
import { CMS_BASE_URL } from '../../config/api'; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { ActionHeader } from '../../components/adminEvents/actionHeader';
import { LogisticsSidebar } from '../../components/adminEvents/logistics';
import { ImageIcon, Loader2, Star, CheckCircle2, AlertCircle, X } from 'lucide-react';

const EventCreatePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    cpdPoints: 0,
    registrationLink: '',
    isFeatured: false,
    isPaid: false,
    memberPrice: 0,
    nonMemberPrice: 0,
    imageId: null as number | null,
    imagePreview: '' 
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000); 
  };

  const updateField = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setEventData(prev => ({ ...prev, imagePreview: localPreview }));

    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await api.post('/upload', formData);
      const uploadedFile = res.data[0];
      
     
      const fullImageUrl = uploadedFile.url.startsWith('http') 
        ? uploadedFile.url 
        : `${CMS_BASE_URL}${uploadedFile.url}`;

      setEventData(prev => ({ 
        ...prev, 
        imageId: uploadedFile.id,
        imagePreview: fullImageUrl // Updates to the server URL once done
      }));
      showToast("Poster uploaded successfully", "success");
    } catch (err) {
      showToast("Upload failed. Check server connection.", "error");
      setEventData(prev => ({ ...prev, imagePreview: '' }));
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!eventData.title.trim() || !eventData.startDate || !eventData.location) {
      showToast("Please fill in all required fields", "error");
      return;
    }
  
    setLoading(true);
    try {
      const payload = {
        data: {
          title: eventData.title,
          description: eventData.description,
          date: new Date(`${eventData.startDate}T${eventData.startTime}:00`).toISOString(),
          time: `${eventData.startTime} - ${eventData.endTime}`,
          location: eventData.location,
          cpdPoints: Number(eventData.cpdPoints),
          registrationLink: eventData.registrationLink,
          isFeatured: eventData.isFeatured,
          isPaid: eventData.isPaid,
          memberPrice: Number(eventData.memberPrice),
          nonMemberPrice: Number(eventData.nonMemberPrice),
          image: eventData.imageId, 
          publishedAt: new Date().toISOString()
        }
      };
  
      await api.post('/events', payload);
      showToast("Event Published Successfully! 🚀", "success");
      setTimeout(() => navigate('/events'), 1500);
    } catch (err: any) {
      showToast("Publishing Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F2FE] relative overflow-hidden">
      
      {/* PREMIUM NOTIFICATION POP */}
      {notification && (
        <div className={`fixed top-4 md:top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 transition-all animate-in fade-in slide-in-from-top-10 duration-500 mx-4 ${
          notification.type === 'success' ? 'bg-white border-emerald-50 text-emerald-900' : 'bg-white border-red-50 text-red-900'
        }`}>
          <div className={`p-1.5 md:p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500 w-4.5 h-4.5 md:w-6 md:h-6"/> : <AlertCircle className="text-red-500 w-4.5 h-4.5 md:w-6 md:h-6"/>}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs md:text-sm opacity-40 leading-none mb-1">Status</span>
            <span className="text-xs truncate">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="ml-2 md:ml-4 p-1.5 md:p-2 hover:bg-slate-50 rounded-lg md:rounded-xl transition-colors flex-shrink-0">
            <X size={14} className="md:w-4 md:h-4 text-slate-300" />
          </button>
        </div>
      )}

      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} flex flex-col min-w-0 overflow-hidden`}>
        <Header 
          title="Create Event Content" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 p-3 md:p-6 lg:p-8 xl:p-12 overflow-y-auto">
          <div className="max-w-full lg:max-w-6xl mx-auto">
            
            <ActionHeader 
              onBack={() => navigate(-1)} 
              onPublish={handlePublish} 
              loading={loading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <div className="bg-white p-4 md:p-6 lg:p-10 rounded-2xl md:rounded-3xl lg:rounded-[40px] border border-slate-100 shadow-sm relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 md:mb-6">
                    <input 
                      type="text"
                      placeholder="Event Headline..."
                      className="w-full text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 outline-none border-none placeholder:text-slate-200 uppercase tracking-tighter"
                      value={eventData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                    
                    <button 
                      type="button"
                      onClick={() => updateField('isFeatured', !eventData.isFeatured)}
                      className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all shadow-sm flex-shrink-0 ${eventData.isFeatured ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-300 border border-transparent'}`}
                    >
                      <Star size={20} className="md:w-6 md:h-6" fill={eventData.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  {/* PREVIEW BOX MOBILE RESPONSIVE */}
                  <div className="relative h-48 md:h-64 lg:h-80 bg-slate-50 rounded-xl md:rounded-2xl lg:rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-6 md:mb-8 group transition-all hover:border-purple-300 hover:bg-purple-50/30">
                    {eventData.imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={eventData.imagePreview} 
                          className="w-full h-full object-cover" 
                          alt="Event preview" 
                          onLoad={() => {
                           
                            if (!uploading) console.log("Image Loaded");
                          }}
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                            <Loader2 className="animate-spin text-purple-600 w-6 h-6 md:w-8 md:h-8" />
                            <span className="text-xs md:text-sm font-black uppercase tracking-widest text-purple-700">Syncing...</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <p className="text-white text-xs md:text-sm font-black uppercase tracking-widest text-center px-4">Click to Replace Poster</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center pointer-events-none">
                        <div className="p-3 md:p-4 lg:p-5 bg-white rounded-2xl md:rounded-3xl shadow-sm mb-2 md:mb-3 inline-block">
                          <ImageIcon size={24} className="md:w-8 md:h-8 text-purple-500" />
                        </div>
                        <p className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4">Upload Event Poster</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                  </div>

                  <div className="h-[1px] w-full bg-slate-100 mb-6 md:mb-8" />

                  <textarea 
                    placeholder="Describe the event, agenda, and speakers..."
                    className="w-full h-48 md:h-64 lg:h-80 bg-transparent text-slate-600 leading-relaxed outline-none resize-none text-sm md:text-base lg:text-lg font-medium"
                    value={eventData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>
              </div>

              <LogisticsSidebar 
                data={eventData} 
                onChange={updateField} 
              />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default EventCreatePage;