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
        showToast(" Event is now LIVE!", "success");
        setTimeout(() => navigate('/events'), 1500); 
      }
    } catch (err: any) {
      showToast("Publishing failed. Please check fields.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen relative font-sans">
      
      {/* NOTIFICATION POP */}
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl shadow-purple-200/50 border transition-all animate-in fade-in slide-in-from-top-10 duration-500 ${
          notification.type === 'success' ? 'bg-white border-emerald-100 text-emerald-900' : 'bg-white border-red-100 text-red-900'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={24}/> : <AlertCircle className="text-red-500" size={24}/>}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">Status</span>
            <span className="text-sm font-bold uppercase tracking-tight">{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="ml-4 p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <X size={16} className="text-gray-300" />
          </button>
        </div>
      )}

      <ActionHeader onPublish={handlePublish} onBack={() => navigate(-1)} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-start gap-4">
            <input 
              className="w-full text-4xl font-bold bg-transparent border-b-2 border-gray-100 outline-none pb-4 text-gray-900 tracking-tight placeholder:text-gray-200 focus:border-[#7E49B3] transition-colors"
              placeholder="Event Title..."
              value={eventData.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
            />
            
            <button 
              onClick={() => handleUpdate('isFeatured', !eventData.isFeatured)}
              className={`p-4 rounded-[20px] border transition-all flex items-center gap-2 ${eventData.isFeatured ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'bg-white border-gray-100 text-gray-300 hover:border-gray-200'}`}
            >
              <Star size={20} fill={eventData.isFeatured ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50">
            {[
              { label: 'Start Date', field: 'startDate', icon: Calendar },
              { label: 'End Date', field: 'endDate', icon: Calendar, min: eventData.startDate },
              { label: 'Start', field: 'startTime', icon: Clock, type: 'time' },
              { label: 'End', field: 'endTime', icon: Clock, type: 'time' }
            ].map((item) => (
              <div key={item.field} className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <item.icon size={12} className="text-[#7E49B3]"/> {item.label}
                </label>
                <input 
                  type={item.type || 'date'} 
                  value={(eventData as any)[item.field]} 
                  min={item.min}
                  onChange={e => handleUpdate(item.field, e.target.value)} 
                  className="w-full bg-gray-50 p-3 rounded-2xl text-xs font-bold text-gray-700 outline-none border border-transparent focus:border-purple-200 focus:bg-white transition-all"
                />
              </div>
            ))}
          </div>

          <div className="relative group h-[400px] bg-white rounded-[3rem] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-[#7E49B3] hover:bg-purple-50/10 shadow-sm">
            {eventData.imagePreview ? (
              <div className="relative w-full h-full">
                <img src={eventData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                {uploading && (
                   <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center backdrop-blur-md gap-3">
                      <Loader2 className="animate-spin text-[#7E49B3]" size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#7E49B3]">Processing Image...</span>
                   </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <p className="text-white text-xs font-bold uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full">Change Poster</p>
                </div>
              </div>
            ) : (
              <div className="text-center pointer-events-none">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-4 mx-auto transition-transform group-hover:scale-110 duration-500">
                   <ImageIcon className="text-[#7E49B3]" size={32} />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Add Event Poster
                </p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
          </div>

          <textarea 
            className="w-full h-[400px] p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 outline-none text-gray-600 leading-relaxed font-medium text-lg placeholder:text-gray-200 focus:ring-4 focus:ring-purple-50/50 transition-all"
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