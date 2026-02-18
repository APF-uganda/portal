import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi';
import { Save, ArrowLeft, BarChart3, Quote,Plus, Layout, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomepageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [data, setData] = useState<any>({
    hero: { title: '', description: '', backgroundImage: null },
    stats: [],
    chairMessage: { author: '', message: '', role: '', photo: null },
    connectingProfessionals: { title: '', content: '' }
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      
      const res = await api.get('/homepage?populate=deep'); 
      
      const item = res.data.data.attributes || res.data.data;
      setData(item);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
     
      const payload = {
        data: {
          ...data,
          hero: {
            ...data.hero,
            backgroundImage: data.hero.backgroundImage?.id || data.hero.backgroundImage // Send ID only
          }
        }
      };
      await api.put('/homepage', payload);
      alert("Homepage updated successfully!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Landing Page...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10 py-4">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-1">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-black text-slate-900">Landing Page Editor</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#5C32A3] text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:bg-[#4a2885] transition-all disabled:opacity-50"
        >
          <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* HERO COMPONENT */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-purple-600">
              <Layout size={20} />
              <h2 className="font-black uppercase tracking-widest text-xs">Hero Section</h2>
            </div>
            <input 
              className="w-full text-3xl font-black text-slate-800 border-none outline-none mb-4"
              placeholder="Hero Title"
              value={data.hero?.title}
              onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})}
            />
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl text-slate-600 font-medium h-32 outline-none"
              placeholder="Hero description text..."
              value={data.hero?.description}
              onChange={(e) => setData({...data, hero: {...data.hero, description: e.target.value}})}
            />
          </section>

          {/* CHAIR MESSAGE COMPONENT */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Quote size={20} />
              <h2 className="font-black uppercase tracking-widest text-xs">Chair's Message</h2>
            </div>
            <div className="space-y-4">
              <input 
                className="w-full p-4 bg-slate-50 rounded-xl font-bold"
                placeholder="Author Name (e.g. Dr. Jane Doe)"
                value={data.chairMessage?.author}
                onChange={(e) => setData({...data, chairMessage: {...data.chairMessage, author: e.target.value}})}
              />
              <textarea 
                className="w-full p-4 bg-slate-50 rounded-xl text-slate-600 min-h-[150px]"
                placeholder="The message content..."
                value={data.chairMessage?.message}
                onChange={(e) => setData({...data, chairMessage: {...data.chairMessage, message: e.target.value}})}
              />
            </div>
          </section>
        </div>

        {/*  STATS & SETTINGS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* STATS COMPONENT  */}
          <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-emerald-600">
                <BarChart3 size={20} />
                <h2 className="font-black uppercase tracking-widest text-xs">Key Stats</h2>
              </div>
              <button 
                onClick={() => setData({...data, stats: [...data.stats, { label: '', value: '' }]})}
                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {data.stats?.map((stat: any, index: number) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-slate-50 rounded-xl">
                  <input 
                    placeholder="10k+" 
                    className="w-16 bg-white p-2 rounded-lg font-black text-emerald-600 text-center"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...data.stats];
                      newStats[index].value = e.target.value;
                      setData({...data, stats: newStats});
                    }}
                  />
                  <input 
                    placeholder="Members" 
                    className="flex-1 bg-white p-2 rounded-lg text-xs font-bold text-slate-500"
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

          {/* CONNECTING PROFESSIONALS */}
          <section className="bg-slate-900 p-6 rounded-[32px] text-white">
            <h2 className="font-black uppercase tracking-widest text-[10px] mb-4 text-slate-500">Professionals Block</h2>
            <input 
              className="w-full bg-transparent border-b border-slate-700 pb-2 font-bold mb-4 outline-none"
              value={data.connectingProfessionals?.title}
              onChange={(e) => setData({...data, connectingProfessionals: {...data.connectingProfessionals, title: e.target.value}})}
            />
            <textarea 
              className="w-full bg-slate-800 p-3 rounded-xl text-xs text-slate-300 h-24 border-none outline-none"
              value={data.connectingProfessionals?.content}
              onChange={(e) => setData({...data, connectingProfessionals: {...data.connectingProfessionals, content: e.target.value}})}
            />
          </section>
        </div>

      </div>
    </div>
  );
};

export default HomepageEditor;