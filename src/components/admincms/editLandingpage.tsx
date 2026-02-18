import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi';
import { Save, ArrowLeft, BarChart3, Quote, Plus, Layout, Image as ImageIcon, X, Building2, MousePointer2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomepageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [data, setData] = useState<any>({
    hero: { title: '', description: '', backgroundImage: null },
    stats: [],
    chairMessage: { author: '', message: '', role: '', photo: null },
    partners: [], 
    connectingProfessionals: { title: '', content: '' }
  });

  useEffect(() => { fetchHomeData(); }, []);

  const fetchHomeData = async () => {
    try {
      const res = await api.get('/homepage?populate=deep'); 
      const item = res.data.data.attributes || res.data.data;
      setData(item);
    } catch (err) { console.error("Fetch error:", err); } 
    finally { setLoading(false); }
  };

  // Helper for uploading images
  const handleImageUpload = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append('files', file);
    try {
      const res = await api.post('/upload', formData);
      const uploadedFile = res.data[0];
      
     
      if (path === 'chairMessage.photo') {
        setData({ ...data, chairMessage: { ...data.chairMessage, photo: uploadedFile } });
      }
    } catch (err) { alert("Upload failed"); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        data: {
          ...data,
          
          hero: { ...data.hero, backgroundImage: data.hero.backgroundImage?.id },
          chairMessage: { ...data.chairMessage, photo: data.chairMessage.photo?.id },
          partners: data.partners.map((p: any) => ({ ...p, logo: p.logo?.id }))
        }
      };
      await api.put('/homepage', payload);
      alert("Homepage updated!");
    } catch (err) { alert("Update failed."); } 
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 font-sans">Loading Landing Page...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 pb-32 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 sticky top-0 bg-gray-50/80 backdrop-blur-md z-10 py-4">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-1 hover:text-[#5C32A3]">
            <ArrowLeft size={16} /> Back to Portal
          </button>
          <h1 className="text-2xl font-black text-slate-900">Landing Page Editor</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-[#5C32A3] text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:bg-[#4a2885] transition-all disabled:opacity-50">
          <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* HERO SECTION */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-purple-600">
              <Layout size={20} />
              <h2 className="font-black uppercase tracking-widest text-[10px]">Main Hero Banner</h2>
            </div>
            <input 
              className="w-full text-3xl font-black text-slate-800 border-none outline-none mb-4"
              placeholder=" Headline..."
              value={data.hero?.title}
              onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})}
            />
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl text-slate-600 font-medium h-24 outline-none border-none resize-none"
              placeholder="Sub-headline description..."
              value={data.hero?.description}
              onChange={(e) => setData({...data, hero: {...data.hero, description: e.target.value}})}
            />
          </section>

          {/* CHAIR MESSAGE + PHOTO */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Quote size={20} />
              <h2 className="font-black uppercase tracking-widest text-[10px]">Chairman's Message</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-40 space-y-2">
                <div className="aspect-square bg-slate-100 rounded-2xl relative overflow-hidden group border-2 border-dashed border-slate-200">
                  {data.chairMessage?.photo?.url ? (
                    <img src={`http://localhost:1337${data.chairMessage.photo.url}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold mt-1">PHOTO</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'chairMessage.photo')}
                  />
                </div>
                <p className="text-[9px] text-center font-bold text-slate-400 uppercase">Click to upload</p>
              </div>
              <div className="flex-1 space-y-4">
                <input 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none"
                  placeholder="Chairman's Name"
                  value={data.chairMessage?.author}
                  onChange={(e) => setData({...data, chairMessage: {...data.chairMessage, author: e.target.value}})}
                />
                <textarea 
                  className="w-full p-4 bg-slate-50 rounded-xl text-slate-600 min-h-[120px] outline-none border-none"
                  placeholder="Write the message here..."
                  value={data.chairMessage?.message}
                  onChange={(e) => setData({...data, chairMessage: {...data.chairMessage, message: e.target.value}})}
                />
              </div>
            </div>
          </section>

          {/* PARTNER LOGOS SECTION */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-rose-500">
                <Building2 size={20} />
                <h2 className="font-black uppercase tracking-widest text-[10px]">Partner Organizations</h2>
              </div>
              <button 
                onClick={() => setData({...data, partners: [...(data.partners || []), { name: '', logo: null }]})}
                className="flex items-center gap-2 text-[10px] font-black bg-rose-50 text-rose-600 px-4 py-2 rounded-full hover:bg-rose-100 transition"
              >
                <Plus size={14} /> ADD PARTNER
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.partners?.map((partner: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl relative group border border-slate-100">
                  <button 
                    onClick={() => {
                      const newList = [...data.partners];
                      newList.splice(idx, 1);
                      setData({...data, partners: newList});
                    }}
                    className="absolute -top-2 -right-2 bg-white text-rose-500 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                  <div className="aspect-video bg-white rounded-lg mb-2 flex items-center justify-center overflow-hidden relative">
                    {partner.logo?.url ? (
                      <img src={`http://localhost:1337${partner.logo.url}`} className="h-full w-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="text-slate-200" size={20} />
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        if (e.target.files) {
                          const formData = new FormData();
                          formData.append('files', e.target.files[0]);
                          const res = await api.post('/upload', formData);
                          const newList = [...data.partners];
                          newList[idx].logo = res.data[0];
                          setData({...data, partners: newList});
                        }
                      }}
                    />
                  </div>
                  <input 
                    placeholder="Partner Name"
                    className="w-full bg-transparent text-[10px] font-bold text-center text-slate-500 uppercase outline-none"
                    value={partner.name}
                    onChange={(e) => {
                      const newList = [...data.partners];
                      newList[idx].name = e.target.value;
                      setData({...data, partners: newList});
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* STATS */}
          <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-emerald-600">
                <BarChart3 size={20} />
                <h2 className="font-black uppercase tracking-widest text-[10px]">Impact Numbers</h2>
              </div>
              <button 
                onClick={() => setData({...data, stats: [...data.stats, { label: '', value: '' }]})}
                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {data.stats?.map((stat: any, index: number) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-slate-50 rounded-xl group">
                  <input 
                    placeholder="Value" 
                    className="w-20 bg-white p-2 rounded-lg font-black text-emerald-600 text-center text-sm outline-none"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...data.stats];
                      newStats[index].value = e.target.value;
                      setData({...data, stats: newStats});
                    }}
                  />
                  <input 
                    placeholder="Label" 
                    className="flex-1 bg-white p-2 rounded-lg text-[10px] font-bold text-slate-500 uppercase outline-none"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...data.stats];
                      newStats[index].label = e.target.value;
                      setData({...data, stats: newStats});
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          
        </div>

      </div>
    </div>
  );
};

export default HomepageEditor;