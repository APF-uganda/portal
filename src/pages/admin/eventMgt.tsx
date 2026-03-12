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
    <div className="flex min-h-screen bg-[#F4F2FE] relative">
      
      {/* PREMIUM NOTIFICATION POP */}
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-8 py-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 transition-all animate-in fade-in slide-in-from-top-10 duration-500 ${
          notification.type === 'success' ? 'bg-white border-emerald-50 text-emerald-900' : 'bg-white border-red-50 text-red-900'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={24}/> : <AlertCircle className="text-red-500" size={24}/>}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Notification</span>
            <span className="text-xs font-black uppercase tracking-wider">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="ml-4 p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <X size={16} className="text-slate-300" />
          </button>
        </div>
      )}

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col`}>
        <Header title="Create Event Content" />

        <div className="flex-1 p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            
            <ActionHeader 
              onBack={() => navigate(-1)} 
              onPublish={handlePublish} 
              loading={loading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative">
                  <div className="flex justify-between items-start mb-4">
                    <input 
                      type="text"
                      placeholder="Event Headline..."
                      className="w-full text-4xl font-black text-slate-900 outline-none border-none placeholder:text-slate-200 uppercase tracking-tighter"
                      value={eventData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                    
                    <button 
                      type="button"
                      onClick={() => updateField('isFeatured', !eventData.isFeatured)}
                      className={`p-3 rounded-2xl transition-all shadow-sm ${eventData.isFeatured ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-300 border border-transparent'}`}
                    >
                      <Star size={24} fill={eventData.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  {/* PREVIEW BOX FIXED */}
                  <div className="relative h-80 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-8 group transition-all hover:border-purple-300 hover:bg-purple-50/30">
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
                            <Loader2 className="animate-spin text-purple-600" size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">Syncing to Server...</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <p className="text-white text-[10px] font-black uppercase tracking-widest">Click to Replace Poster</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center pointer-events-none">
                        <div className="p-5 bg-white rounded-3xl shadow-sm mb-3 inline-block">
                          <ImageIcon size={32} className="text-purple-500" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Event Poster</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                  </div>

                  <div className="h-[1px] w-full bg-slate-100 mb-8" />

                  <textarea 
                    placeholder="Describe the event, agenda, and speakers..."
                    className="w-full h-80 bg-transparent text-slate-600 leading-relaxed outline-none resize-none text-lg font-medium"
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