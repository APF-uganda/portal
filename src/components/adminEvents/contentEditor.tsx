import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api'; 
import ActionHeader from './actionHeader'; 
import { LogisticsSidebar } from './logistics'; 
import { 
  ImageIcon, 
  Loader2, 
  Clock, 
  Calendar, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  X 
} from 'lucide-react';

const EventEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Premium Notification State
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

  const handleUpdate = (field: string, value: any) => {
    setEventData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'startDate' && next.endDate && value > next.endDate) {
        next.endDate = value;
      }
      if (field === 'endDate' && next.startDate && value < next.startDate) {
        next.endDate = next.startDate;
      }
      return next;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    const localUrl = URL.createObjectURL(file);
    setEventData(prev => ({ ...prev, imagePreview: localUrl }));

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
        imagePreview: fullImageUrl
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
    // Validation check
    if (!eventData.title || !eventData.startDate || !eventData.location || !eventData.imageId) {
      showToast("Required fields missing: Title, Date, Location, and Poster", "error");
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
          registrationLink: eventData.registrationLink,
          cpdPoints: Number(eventData.cpdPoints),
          isFeatured: eventData.isFeatured,
          isPaid: eventData.isPaid,
          memberPrice: Number(eventData.memberPrice),
          nonMemberPrice: Number(eventData.nonMemberPrice),
          image: eventData.imageId, 
          publishedAt: new Date().toISOString() 
        }
      };

      const res = await api.post('/events', payload);
      
      if (res.status === 200 || res.status === 201) {
        showToast("🚀 Event is now LIVE!", "success");
        setTimeout(() => navigate('/events'), 1500); 
      }
    } catch (err: any) {
      showToast("Publishing failed. Please check fields.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen relative">
      
      {/* PREMIUM NOTIFICATION POP */}
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-8 py-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 transition-all animate-in fade-in slide-in-from-top-10 duration-500 ${
          notification.type === 'success' ? 'bg-white border-emerald-50 text-emerald-900' : 'bg-white border-red-50 text-red-900'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={24}/> : <AlertCircle className="text-red-500" size={24}/>}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Status</span>
            <span className="text-xs font-black uppercase tracking-wider">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="ml-4 p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <X size={16} className="text-slate-300" />
          </button>
        </div>
      )}

      <ActionHeader onPublish={handlePublish} onBack={() => navigate(-1)} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <input 
              className="w-full text-4xl font-black bg-transparent border-b-2 border-slate-200 outline-none pb-4 text-slate-900 uppercase tracking-tighter placeholder:text-slate-200"
              placeholder="Event Title..."
              value={eventData.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
            />
            
            <button 
              onClick={() => handleUpdate('isFeatured', !eventData.isFeatured)}
              className={`p-4 rounded-[20px] border transition-all flex items-center gap-2 ${eventData.isFeatured ? 'bg-amber-100 border-amber-200 text-amber-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}
            >
              <Star size={20} fill={eventData.isFeatured ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} className="text-purple-500"/> Start Date</label>
              <input type="date" value={eventData.startDate} onChange={e => handleUpdate('startDate', e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-black outline-none border border-transparent focus:border-purple-200 transition-all"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} className="text-purple-500"/> End Date</label>
              <input type="date" value={eventData.endDate} min={eventData.startDate} onChange={e => handleUpdate('endDate', e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-black outline-none border border-transparent focus:border-purple-200 transition-all"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={12} className="text-purple-500"/> Start</label>
              <input type="time" value={eventData.startTime} onChange={e => handleUpdate('startTime', e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-black outline-none border border-transparent focus:border-purple-200 transition-all"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={12} className="text-purple-500"/> End</label>
              <input type="time" value={eventData.endTime} onChange={e => handleUpdate('endTime', e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-black outline-none border border-transparent focus:border-purple-200 transition-all"/>
            </div>
          </div>

          <div className="relative group h-96 bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-purple-300 hover:bg-purple-50/20">
            {eventData.imagePreview ? (
              <div className="relative w-full h-full">
                <img src={eventData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                {uploading && (
                   <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-sm gap-3">
                      <Loader2 className="animate-spin text-purple-600" size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">Uploading...</span>
                   </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Poster</p>
                </div>
              </div>
            ) : (
              <div className="text-center pointer-events-none">
                <div className="p-5 bg-slate-50 rounded-3xl mb-4 inline-block shadow-sm">
                   <ImageIcon className="text-purple-500" size={32} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Add Event Poster
                </p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
          </div>
          

          <textarea 
            className="w-full h-80 p-10 rounded-[40px] bg-white border border-slate-100 shadow-sm outline-none text-slate-600 leading-relaxed font-medium text-lg placeholder:text-slate-300 focus:ring-4 focus:ring-purple-50 transition-all"
            placeholder="Describe the event, agenda, and speakers..."
            value={eventData.description}
            onChange={(e) => handleUpdate('description', e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <LogisticsSidebar data={eventData} onChange={handleUpdate} />
        </div>
      </div>
    </div>
  );
};

export default EventEditor;