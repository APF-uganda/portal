import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/cmsApi';
import ActionHeader from './actionHeader'; 
import { LogisticsSidebar } from './logistics'; 
import { ImageIcon, Loader2, Clock, Calendar, Star } from 'lucide-react';

const EventEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
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
    imageId: null as number | null,
    imagePreview: ''
  });

 
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

    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await api.post('/upload', formData);
      const uploadedFile = res.data[0];
      setEventData(prev => ({ 
        ...prev, 
        imageId: uploadedFile.id,
        imagePreview: `http://localhost:1337${uploadedFile.url}`
      }));
    } catch (err) {
      alert("Image upload failed. Ensure Strapi is running.");
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
   
    if (!eventData.title || !eventData.startDate || !eventData.location || !eventData.imageId || !eventData.description) {
      alert("⚠️ Strapi Error: Please fill all required fields (Title, Date, Description, Location, and Image).");
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
          image: eventData.imageId, 
          publishedAt: new Date().toISOString() 
        }
      };

      const res = await api.post('/events', payload);
      
      if (res.status === 200 || res.status === 201) {
        alert("🚀 Published! Event is now LIVE.");
        navigate('/events'); 
      }
    } catch (err: any) {
      console.error("API Error:", err.response?.data || err);
      alert("Publishing failed: " + (err.response?.data?.error?.message || "Check fields"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <ActionHeader onPublish={handlePublish} onBack={() => navigate(-1)} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <input 
              className="w-full text-4xl font-black bg-transparent border-b-2 border-slate-200 outline-none pb-4 text-slate-800"
              placeholder="Event Title..."
              value={eventData.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
            />
            
            {/* Featured Toggle */}
            <button 
              onClick={() => handleUpdate('isFeatured', !eventData.isFeatured)}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${eventData.isFeatured ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-400'}`}
            >
              <Star size={20} fill={eventData.isFeatured ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
            </button>
          </div>

          {/* Time & Date Pickers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Start Date</label>
              <input type="date" value={eventData.startDate} onChange={e => handleUpdate('startDate', e.target.value)} className="w-full bg-slate-50 p-2 rounded-xl text-sm font-bold outline-none"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> End Date</label>
              <input type="date" value={eventData.endDate} min={eventData.startDate} onChange={e => handleUpdate('endDate', e.target.value)} className="w-full bg-slate-50 p-2 rounded-xl text-sm font-bold outline-none"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Clock size={12}/> Start Time</label>
              <input type="time" value={eventData.startTime} onChange={e => handleUpdate('startTime', e.target.value)} className="w-full bg-slate-50 p-2 rounded-xl text-sm font-bold outline-none"/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Clock size={12}/> End Time</label>
              <input type="time" value={eventData.endTime} onChange={e => handleUpdate('endTime', e.target.value)} className="w-full bg-slate-50 p-2 rounded-xl text-sm font-bold outline-none"/>
            </div>
          </div>

          {/* Image Upload */}
          <div className="relative group h-80 bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-purple-300">
            {eventData.imagePreview ? (
              <img src={eventData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center">
                {uploading ? <Loader2 className="animate-spin text-purple-500 mx-auto" /> : <ImageIcon className="mx-auto text-slate-300 mb-2" size={40} />}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {uploading ? 'Uploading...' : 'Click to Upload Poster (Required)'}
                </p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
          </div>

          <textarea 
            className="w-full h-64 p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm outline-none text-slate-600 leading-relaxed"
            placeholder="Event description..."
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