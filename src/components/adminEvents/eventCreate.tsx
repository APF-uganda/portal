import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2, Star } from 'lucide-react';
import api from '../../services/cmsApi';
import { CMS_BASE_URL } from '../../config/api';
import { ActionHeader } from './actionHeader';
import { LogisticsSidebar } from './logistics';

interface EventFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

 
  const formatDate = (isoStr: string) => isoStr ? isoStr.split('T')[0] : '';
    const formatTime = (timeStr: string, index: number) => {
    if (!timeStr) return index === 0 ? '09:00' : '17:00';
    const parts = timeStr.split(' - ');
    return parts[index] || (index === 0 ? '09:00' : '17:00');
  };

  const [eventData, setEventData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: formatDate(initialData?.date),
    endDate: formatDate(initialData?.endDate),
    startTime: formatTime(initialData?.time, 0),
    endTime: formatTime(initialData?.time, 1),
    location: initialData?.location || '',
    cpdPoints: initialData?.cpdPoints || 0,
    registrationLink: initialData?.registrationLink || '',
    isFeatured: initialData?.isFeatured || false,
    isPaid: initialData?.isPaid || false,
    memberPrice: initialData?.memberPrice || 0,
    nonMemberPrice: initialData?.nonMemberPrice || 0,
    imageId: initialData?.image?.id || null,
    imagePreview: initialData?.featuredImage || '' 
  });

  const updateField = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    try {
      const res = await api.post('/upload', formData);
      const uploadedFile = res.data[0];
      updateField('imageId', uploadedFile.id);
      updateField('imagePreview', `${CMS_BASE_URL}${uploadedFile.url}`);
    } catch (err) {
      console.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!eventData.title || !eventData.startDate || !eventData.location) return;
    
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

      if (eventData.endDate) {
        (payload.data as any).endDate = new Date(`${eventData.endDate}T${eventData.endTime}:00`).toISOString();
      }

      if (initialData?.id) {
        await api.put(`/events/${initialData.documentId || initialData.id}`, payload);
      } else {
        await api.post('/events', payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ActionHeader onBack={onCancel} onPublish={handlePublish} loading={loading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 lg:p-10 rounded-[40px] border border-slate-100 shadow-sm relative">
            <div className="flex justify-between items-start gap-4 mb-6">
              <input 
                type="text" placeholder="Event Headline..."
                className="w-full text-3xl  text-slate-900 outline-none uppercase tracking-tighter"
                value={eventData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
              <button onClick={() => updateField('isFeatured', !eventData.isFeatured)} className={`p-3 rounded-2xl transition-all ${eventData.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-300'}`}>
                <Star size={24} fill={eventData.isFeatured ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="relative h-80 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-8 group">
              {eventData.imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={eventData.imagePreview} className="w-full h-full object-cover" alt="" />
                  {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>}
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon size={32} className="text-purple-500 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Poster</p>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
            </div>

            <textarea 
              placeholder="Describe the event..."
              className="w-full h-80 bg-transparent text-slate-600 outline-none resize-none text-lg font-medium"
              value={eventData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>
        </div>
        <LogisticsSidebar data={eventData} onChange={updateField} />
      </div>
    </div>
  );
};
export default EventForm;