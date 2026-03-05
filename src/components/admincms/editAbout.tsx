import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi';
import { Save, Plus, Trash2, ArrowLeft, Image as ImageIcon, Users, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CMS_BASE_URL } from '../../config/api';

const AboutPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  const [data, setData] = useState({
    vision: '',
    mission: '',
    history: '',
    objectives: [] as any[],
    hero: { 
      title: '', 
      description: '', 
      backgroundImage: null as any 
    }
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
     
      const res = await api.get('/about-page?populate[hero][populate]=*&populate[objectives][populate]=*');
      
    
      const raw = res.data.data;
      const attr = raw?.attributes || raw;

      if (attr) {
        setData({
          vision: attr.vision || '',
          mission: attr.mission || '',
          history: attr.history || '',
          objectives: attr.objectives || [],
          hero: {
            title: attr.hero?.title || '',
            description: attr.hero?.description || '',
           
            backgroundImage: attr.hero?.backgroundImage?.data?.attributes || attr.hero?.backgroundImage || null
          }
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      setSaving(true);
      const uploadRes = await api.post('/upload', formData);
      const imageInfo = uploadRes.data[0];

      setData(prev => ({
        ...prev,
        hero: { ...prev.hero, backgroundImage: { id: imageInfo.id, url: imageInfo.url } }
      }));
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
     
      const payload = {
        data: {
          vision: data.vision,
          mission: data.mission,
          history: data.history,
          objectives: data.objectives.map((obj: any) => ({
            title: obj.title,
            description: obj.description
          })),
          hero: {
            title: data.hero.title,
            description: data.hero.description,
            backgroundImage: data.hero.backgroundImage?.id || null 
          }
        }
      };
      
      await api.put('/about-page', payload);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed. Check Strapi console for validation errors.");
    } finally {
      setSaving(false);
    }
  };

  const updateObjective = (index: number, field: string, value: string) => {
    const newObjectives = [...data.objectives];
    newObjectives[index] = { ...newObjectives[index], [field]: value };
    setData({ ...data, objectives: newObjectives });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-purple-600 mx-auto" size={40} />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Content...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4 px-10 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/cmspage')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-slate-800 text-xl tracking-tight uppercase">About Editor</h1>
            {lastSaved && <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Last saved: {lastSaved}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admincms/leadership')} 
            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <Users size={18} /> GOVERNANCE
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#5C32A3] text-white px-8 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-purple-100 hover:bg-[#4a2885] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
            SAVE CHANGES
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* HERO SECTION WITH IMAGE */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Hero Section & Image</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
               <input 
                placeholder="Hero Title"
                className="w-full text-xl font-bold border-b border-slate-100 focus:border-purple-500 outline-none pb-2"
                value={data.hero.title}
                onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})}
              />
              <textarea 
                placeholder="Hero Subtitle"
                className="w-full p-3 bg-slate-50 rounded-xl text-sm text-slate-600 h-24"
                value={data.hero.description}
                onChange={(e) => setData({...data, hero: {...data.hero, description: e.target.value}})}
              />
            </div>
            <div className="w-full md:w-64">
              <div className="relative group aspect-video md:aspect-square bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                {data.hero.backgroundImage?.url ? (
                  <img 
                    src={`${CMS_BASE_URL}${data.hero.backgroundImage.url}`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <ImageIcon size={32} className="text-slate-300" />
                )}
                <input 
                  type="file" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </section>

        {/* VISION & MISSION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-4">Our Vision</h2>
            <textarea 
              className="w-full p-0 bg-transparent text-slate-600 text-sm h-32 outline-none resize-none leading-relaxed"
              value={data.vision}
              onChange={(e) => setData({...data, vision: e.target.value})}
              placeholder="Where are we going?"
            />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-4">Our Mission</h2>
            <textarea 
              className="w-full p-0 bg-transparent text-slate-600 text-sm h-32 outline-none resize-none leading-relaxed"
              value={data.mission}
              onChange={(e) => setData({...data, mission: e.target.value})}
              placeholder="How do we get there?"
            />
          </div>
        </div>

        {/* HISTORY SECTION */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-6">Organization History</h2>
          <textarea 
            className="w-full p-5 bg-slate-50 rounded-[2rem] text-slate-600 text-sm h-64 outline-none focus:ring-2 focus:ring-purple-100 transition-all leading-relaxed"
            value={data.history}
            onChange={(e) => setData({...data, history: e.target.value})}
          />
        </section>

        {/* OBJECTIVES SECTION */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Strategic Objectives</h2>
            <button 
              onClick={() => setData({...data, objectives: [...data.objectives, { title: '', description: '' }]})}
              className="text-[10px] font-black bg-purple-50 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-all uppercase tracking-widest"
            >
              + Add Objective
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.objectives.map((obj, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-[2rem] group relative border border-transparent hover:border-purple-100 hover:bg-white transition-all">
                <input 
                  className="w-full bg-transparent font-black text-slate-800 mb-2 outline-none text-sm uppercase tracking-tight"
                  placeholder="Objective Title"
                  value={obj.title}
                  onChange={(e) => updateObjective(index, 'title', e.target.value)}
                />
                <textarea 
                  className="w-full bg-transparent text-xs text-slate-500 outline-none h-20 resize-none leading-normal"
                  placeholder="Describe this objective..."
                  value={obj.description}
                  onChange={(e) => updateObjective(index, 'description', e.target.value)}
                />
                <button 
                  onClick={() => setData({...data, objectives: data.objectives.filter((_, i) => i !== index)})}
                  className="absolute top-4 right-4 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPageEditor;
