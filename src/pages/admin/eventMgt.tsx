import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/cmsApi'; 

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { ActionHeader } from '../../components/adminEvents/actionHeader';
import { LogisticsSidebar } from '../../components/adminEvents/logistics';
import { Star, ImageIcon, Loader2 } from 'lucide-react';

const EventCreatePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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

 
  const updateField = (field: string, value: any) => {
    setEventData(prev => {
      let newState = { ...prev, [field]: value };

      
      if (field === 'startDate' && newState.endDate && value > newState.endDate) {
        newState.endDate = value;
      }

      
      if (field === 'endDate' && newState.startDate && value < newState.startDate) {
        alert("End date cannot be earlier than the start date.");
        return prev; 
      }

      return newState;
    });
  };

  // Image Upload Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      alert("Image upload failed. Check Strapi port 1337.");
    } finally {
      setUploading(false);
    }
  };

 
  const handlePublish = async () => {
    
    const hasTitle = !!eventData.title.trim();
    const hasDate = !!eventData.startDate;
    const hasLocation = !!eventData.location.trim();
  
    if (!hasTitle || !hasDate || !hasLocation) {
      alert(`⚠️ Missing Required Fields:\n${!hasTitle ? '- Title\n' : ''}${!hasDate ? '- Start Date\n' : ''}${!hasLocation ? '- Location/Link' : ''}`);
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
          image: eventData.imageId || null, 
          publishedAt: new Date().toISOString()
        }
      };
  
      console.log("Payload sent to Strapi:", payload);
      const res = await api.post('/events', payload);
      
      if (res.status === 201 || res.status === 200) {
        alert(" Published successfully!");
        navigate('/events');
      }
    } catch (err: any) {
      console.error("API Error:", err.response?.data || err);
      alert("Strapi Error: " + (err.response?.data?.error?.message || "Check fields"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#F4F2FE]">
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
                      className="w-full text-4xl font-black text-slate-900 outline-none border-none placeholder:text-slate-200"
                      value={eventData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                    
                    {/* Featured Event Toggle */}
                    <button 
                      type="button"
                      onClick={() => updateField('isFeatured', !eventData.isFeatured)}
                      className={`p-3 rounded-2xl transition-all shadow-sm ${eventData.isFeatured ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-300 border border-transparent'}`}
                      title="Mark as Featured"
                    >
                      <Star size={24} fill={eventData.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  {/* Poster Upload Area  */}
                  <div className="relative h-64 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-8 group transition-colors hover:border-purple-300">
                    {eventData.imagePreview ? (
                      <img src={eventData.imagePreview} className="w-full h-full object-cover" alt="Event preview" />
                    ) : (
                      <div className="text-center">
                        {uploading ? <Loader2 className="animate-spin text-purple-600" /> : <ImageIcon size={40} className="text-slate-300 mx-auto" />}
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-2">Upload Poster (Optional)</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                  </div>

                  <div className="h-[1px] w-full bg-slate-100 mb-8" />

                  <textarea 
                    placeholder="Describe the event, agenda, and speakers..."
                    className="w-full h-80 bg-transparent text-slate-600 font-medium leading-relaxed outline-none resize-none text-lg"
                    value={eventData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>
              </div>

              {/* Sidebar with Logistics and Time */}
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