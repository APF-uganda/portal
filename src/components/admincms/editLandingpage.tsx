import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Layout, Quote, BarChart3, Users, Image as ImageIcon, Building2 } from 'lucide-react';
import * as cms from '../../services/cmsApi';

const HomepageEditor = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const fetched = await cms.getHomepage();
      setData(fetched);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (media: any) => {
    const url = media?.data?.attributes?.url || media?.url;
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:1337${url}`;
  };

  // THE WORKING LOGIC: Kept exactly as requested
  const prepareDataForStrapi = (item: any): any => {
    if (!item) return null;
    if (Array.isArray(item)) return item.map(prepareDataForStrapi);
    if (typeof item === 'object') {
      if (item.data && item.id) return item.id; 
      if (item.id && (item.url || item.mime)) return item.id;

      const cleanObj: any = {};
      for (const key in item) {
        if (['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale'].includes(key)) continue;
        cleanObj[key] = prepareDataForStrapi(item[key]);
      }
      return cleanObj;
    }
    return item;
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const attr = data.attributes || data;
      const payload = prepareDataForStrapi(attr);
      await cms.updateHomepage(payload);
      alert("SUCCESS! Published.");
      loadData();
    } catch (err: any) {
      console.error("Save Error:", err.response?.data);
      alert(`Error: ${err.response?.data?.error?.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black">SYNCING CONTENT...</div>;

  const attr = data.attributes || data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADERBAR */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center px-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600"/>
          </button>
          <h1 className="font-black text-slate-800 tracking-tight">HOMEPAGE EDITOR</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-[#5C32A3] hover:bg-[#4A2882] text-white px-8 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-purple-200 disabled:opacity-50">
          {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
          PUBLISH CHANGES
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-12 space-y-10 px-6">
        
        {/* HERO SECTION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Layout size={14}/> Hero Header
            </div>
            {attr.hero?.backgroundImage && (
              <div className="relative group">
                <img src={getImageUrl(attr.hero.backgroundImage)} className="w-24 h-14 object-cover rounded-xl border-2 border-white shadow-md" alt="Hero" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                   <ImageIcon size={16} className="text-white"/>
                </div>
              </div>
            )}
          </div>
          <input className="w-full text-4xl font-black outline-none mb-4 placeholder:text-slate-200" placeholder="Main Title" value={attr.hero?.title || ""} 
            onChange={(e) => setData({...data, attributes: {...attr, hero: {...attr.hero, title: e.target.value}}})} 
          />
          <textarea className="w-full text-lg text-slate-500 outline-none h-24 resize-none leading-relaxed" placeholder="Sub-headline text..." value={attr.hero?.subtitle || ""} 
            onChange={(e) => setData({...data, attributes: {...attr, hero: {...attr.hero, subtitle: e.target.value}}})} 
          />
        </div>

        {/* STATS SECTION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-8 w-fit flex items-center gap-2">
            <BarChart3 size={14}/> Impact Statistics
          </div>
          <div className="grid grid-cols-3 gap-6">
            {attr.stats?.map((s: any, i: number) => (
              <div key={i} className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 hover:border-emerald-200 transition-colors">
                <input className="w-full text-3xl font-black text-emerald-600 bg-transparent outline-none mb-1" value={s.value} 
                  onChange={(e) => {
                    const next = [...attr.stats]; next[i].value = e.target.value;
                    setData({...data, attributes: {...attr, stats: next}});
                  }}
                />
                <input className="w-full text-[11px] font-bold text-slate-400 bg-transparent outline-none uppercase tracking-wider" value={s.label}
                  onChange={(e) => {
                    const next = [...attr.stats]; next[i].label = e.target.value;
                    setData({...data, attributes: {...attr, stats: next}});
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CHAIRPERSON SECTION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Quote size={14}/> Leadership Message
            </div>
            {attr.chairMessage?.photo && (
              <img src={getImageUrl(attr.chairMessage.photo)} className="w-14 h-14 rounded-full border-4 border-slate-50 shadow-sm object-cover" alt="Chair" />
            )}
          </div>
          <div className="space-y-4 mb-6">
            <input className="w-full text-2xl font-black outline-none placeholder:text-slate-200" placeholder="Chairperson Name" value={attr.chairMessage?.name || ""} 
              onChange={(e) => setData({...data, attributes: {...attr, chairMessage: {...attr.chairMessage, name: e.target.value}}})} 
            />
            {/* ADDED ROLE FIELD */}
            <input className="w-full text-md font-bold text-blue-500 outline-none border-b border-slate-50 pb-2" placeholder="Professional Title / Role" value={attr.chairMessage?.role || ""} 
              onChange={(e) => setData({...data, attributes: {...attr, chairMessage: {...attr.chairMessage, role: e.target.value}}})} 
            />
          </div>
          <textarea className="w-full bg-slate-50 p-8 rounded-[24px] outline-none h-64 resize-none leading-relaxed text-slate-600 border border-transparent focus:border-blue-100 transition-all" placeholder="Enter the full message here..." value={attr.chairMessage?.fullMessage || ""} 
            onChange={(e) => setData({...data, attributes: {...attr, chairMessage: {...attr.chairMessage, fullMessage: e.target.value}}})} 
          />
        </div>

        {/* CONNECTING PROFESSIONALS */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-8 w-fit flex items-center gap-2">
            <Users size={14}/> Professional Accordion
          </div>
          <div className="grid gap-4">
            {attr.connectingProfessionals?.map((cp: any, i: number) => (
              <div key={i} className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 group">
                <input className="w-full font-black text-slate-800 bg-transparent outline-none mb-2 group-focus-within:text-amber-600 transition-colors" value={cp.title} 
                  onChange={(e) => {
                    const next = [...attr.connectingProfessionals]; next[i].title = e.target.value;
                    setData({...data, attributes: {...attr, connectingProfessionals: next}});
                  }}
                />
                <textarea className="w-full text-sm text-slate-500 bg-transparent outline-none resize-none leading-relaxed h-20" value={cp.content} 
                   onChange={(e) => {
                    const next = [...attr.connectingProfessionals]; next[i].content = e.target.value;
                    setData({...data, attributes: {...attr, connectingProfessionals: next}});
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* PARTNERS SECTION  */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-8 w-fit flex items-center gap-2">
            <Building2 size={14}/> Partner Logos
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {attr.partnerlogo?.map((p: any, i: number) => (
              <div key={i} className="flex-shrink-0 w-32 h-20 bg-slate-50 rounded-xl border flex items-center justify-center p-2">
                {p.logo ? (
                  <img src={getImageUrl(p.logo)} className="max-w-full max-h-full object-contain" alt="Partner" />
                ) : (
                  <ImageIcon size={20} className="text-slate-300"/>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center font-bold italic">Logo management is handled primarily via Strapi Media Library</p>
        </div>

      </div>
    </div>
  );
};

export default HomepageEditor;