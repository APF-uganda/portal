import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [data, setData] = useState({
    vision: '',
    mission: '',
    history: '',
    objectives: [] as any[],
    hero: { title: '', description: '' }
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
    
      const res = await api.get('/about-page?populate[hero][populate]=*&populate[objectives][populate]=*');
      const attr = res.data.data.attributes;
      
      setData({
        vision: attr.vision || '',
        mission: attr.mission || '',
        history: attr.history || '',
        objectives: attr.objectives || [],
        hero: attr.hero || { title: '', description: '' }
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      
      await api.put('/about-page', { data });
      alert("About Page updated successfully!");
    } catch (err) {
      alert("Update failed. Check your API permissions.");
    } finally {
      setSaving(false);
    }
  };

  const updateObjective = (index: number, field: string, value: string) => {
    const newObjectives = [...data.objectives];
    newObjectives[index] = { ...newObjectives[index], [field]: value };
    setData({ ...data, objectives: newObjectives });
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading About Content...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 pb-20">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-slate-900">About Page Editor</h1>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#5C32A3] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#4a2885] transition-all disabled:opacity-50"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* VISION & MISSION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Vision</h2>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-xl text-sm min-h-[100px]"
              value={data.vision}
              onChange={(e) => setData({...data, vision: e.target.value})}
            />
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Mission</h2>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-xl text-sm min-h-[100px]"
              value={data.mission}
              onChange={(e) => setData({...data, mission: e.target.value})}
            />
          </section>
        </div>

        {/* HISTORY (RichText) */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-purple-600 uppercase mb-4">Our History</h2>
          <textarea 
            className="w-full p-4 bg-slate-50 rounded-xl text-sm min-h-[200px]"
            value={data.history}
            onChange={(e) => setData({...data, history: e.target.value})}
            placeholder="Write the organization history here (Markdown supported)"
          />
        </section>

        {/* OBJECTIVES  */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-black text-purple-600 uppercase">Strategic Objectives</h2>
            <button 
              onClick={() => setData({...data, objectives: [...data.objectives, { title: '', description: '' }]})}
              className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg"
            >
              <Plus size={14} className="inline mr-1"/> Add Objective
            </button>
          </div>
          
          <div className="space-y-4">
            {data.objectives.map((obj, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-2xl flex gap-4 items-start border border-slate-100">
                <div className="flex-1 space-y-3">
                  <input 
                    className="w-full bg-white px-3 py-2 rounded-lg font-bold text-slate-800 border-none outline-none"
                    placeholder="Objective Title"
                    value={obj.title}
                    onChange={(e) => updateObjective(index, 'title', e.target.value)}
                  />
                  <textarea 
                    className="w-full bg-white px-3 py-2 rounded-lg text-xs text-slate-500 border-none outline-none min-h-[60px]"
                    placeholder="Brief description"
                    value={obj.description}
                    onChange={(e) => updateObjective(index, 'description', e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setData({...data, objectives: data.objectives.filter((_, i) => i !== index)})}
                  className="text-slate-300 hover:text-red-500 p-2"
                ><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPageEditor;