import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/cmsApi';
import { ActionHeader } from './actionHeader'; 
import { LogisticsSidebar } from './logistics'; 
import { ImageIcon, Loader2 } from 'lucide-react';

const EventEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '', 
    location: '',
    cpdPoints: 0,
    registrationLink: '',
    imageId: null as number | null,
    imagePreview: ''
  });

  const handleUpdate = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  //  Handle Image Upload 
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      // Strapi's upload endpoint
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedFile = res.data[0];
      
      setEventData(prev => ({ 
        ...prev, 
        imageId: uploadedFile.id,
        imagePreview: `http://localhost:1337${uploadedFile.url}`
      }));
    } catch (err) {
      alert("Image upload failed. Check your connection.");
    } finally {
      setUploading(false);
    }
  };

  //  Publish to Website 
  const handlePublish = async () => {
    if (!eventData.title || !eventData.startDate) {
      alert("Please enter at least a Title and Date.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        data: {
          title: eventData.title,
          description: eventData.description,
          date: eventData.startDate, 
          location: eventData.location,
          cpdPoints: Number(eventData.cpdPoints),
          registrationLink: eventData.registrationLink,
          image: eventData.imageId, 
          publishedAt: new Date().toISOString() 
        }
      };

      const res = await api.post('/events', payload);
      
      if (res.status === 200 || res.status === 201) {
        alert("🚀 Event is now LIVE on the public website!");
        navigate('/events'); 
      }
    } catch (err) {
      console.error("Publishing failed", err);
      alert("Failed to publish. Ensure all required fields in Strapi are filled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <ActionHeader 
        onPublish={handlePublish} 
        onBack={() => navigate(-1)} 
        loading={loading} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <input 
            className="w-full text-4xl font-black bg-transparent outline-none border-b-2 border-slate-200 focus:border-purple-500 pb-4 text-slate-800"
            placeholder="Event Title..."
            value={eventData.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
          />

          {/* Image Upload Area */}
          <div className="relative group h-64 bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-purple-300">
            {eventData.imagePreview ? (
              <img src={eventData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center">
                {uploading ? <Loader2 className="animate-spin text-purple-500 mx-auto" /> : <ImageIcon className="mx-auto text-slate-300 mb-2" size={40} />}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {uploading ? 'Uploading...' : 'Click to Upload Poster'}
                </p>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <textarea 
            className="w-full h-80 p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm outline-none text-slate-600 leading-relaxed"
            placeholder="Describe the event, agenda, and speakers..."
            value={eventData.description}
            onChange={(e) => handleUpdate('description', e.target.value)}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <LogisticsSidebar data={eventData} onChange={handleUpdate} />
          
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Link</label>
             <input 
               placeholder="https://google.forms/..."
               className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100"
               value={eventData.registrationLink}
               onChange={(e) => handleUpdate('registrationLink', e.target.value)}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditor;