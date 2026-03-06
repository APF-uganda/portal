import { useState, useEffect } from 'react';
import api from '../../utils/cmsapi'; // Verify if
import { Save, Plus, Trash2, ArrowLeft, UserPlus, Loader2, Camera, Globe, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadershipManager = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchLeaders(); }, []);

  const fetchLeaders = async () => {
    try {
      // We fetch both drafts and published to manage them here
      const res = await api.get('/leaderships?populate=*&sort=order:asc&publicationState=preview');
      setLeaders(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeader = async () => {
    try {
      setSaving(true);
      const newLeader = {
        data: {
          name: "New Leader",
          role: "Role Title",
          order: leaders.length + 1,
        }
      };
      // Note: By default Strapi creates this as a draft
      await api.post('/leaderships', newLeader);
      fetchLeaders();
    } catch (err) {
      alert("Failed to add leader");
    } finally {
      setSaving(false);
    }
  };

  // NEW: Function to Publish a leader so they appear on the public Governance page
  const handlePublish = async (id: number) => {
    try {
      setSaving(true);
     
      await api.put(`/leaderships/${id}`, {
        data: { publishedAt: new Date() }
      });
      alert("Leader published to website!");
      fetchLeaders();
    } catch (err) {
      console.error("Publish error:", err);
      alert("Failed to publish. Check if Draft/Publish is enabled in Strapi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this leader?")) return;
    try {
      await api.delete(`/leaderships/${id}`);
      setLeaders(leaders.filter(l => l.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdateField = async (id: number, field: string, value: any) => {
    try {
      await api.put(`/leaderships/${id}`, { data: { [field]: value } });
      setLeaders(leaders.map(l => l.id === id ? { ...l, attributes: { ...l.attributes, [field]: value } } : l));
    } catch (err) {
      console.error("Update failed");
    }
  };

  const handlePhotoUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('files', file);

    try {
      setSaving(true);
      const uploadRes = await api.post('/upload', formData);
      const imageId = uploadRes.data[0].id;
      await api.put(`/leaderships/${id}`, { data: { Photo: imageId } });
      fetchLeaders();
    } catch (err) {
      alert("Photo upload failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center px-10">
        <div className="flex items-center gap-4">
          {/* Updated: Navigates back to Admin Dashboard */}
          <button onClick={() => navigate('/admincms')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="font-black text-slate-800 tracking-tight text-xl uppercase">Governance</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team & Leadership</p>
          </div>
        </div>
        <button 
          onClick={handleAddLeader} 
          disabled={saving} 
          className="bg-[#5C32A3] text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-[#4a2885] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} 
          NEW MEMBER
        </button>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {leaders.map((leader) => {
          const attr = leader.attributes;
          const photoUrl = attr.Photo?.data?.attributes?.url;
          const isPublished = attr.publishedAt !== null;

          return (
            <div key={leader.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-6 group relative transition-all hover:shadow-md">
              
              <div className="flex gap-6">
                {/* Photo Column */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <div className="w-full h-full rounded-2xl bg-slate-50 overflow-hidden border-2 border-white shadow-inner">
                    {photoUrl ? (
                      <img src={`http://localhost:1337${photoUrl}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Camera size={28}/></div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:text-purple-600 transition-colors border border-slate-50">
                    <Plus size={14} />
                    <input type="file" className="hidden" onChange={(e) => handlePhotoUpload(leader.id, e)} />
                  </label>
                </div>

                {/* Info Column */}
                <div className="flex-1 space-y-3">
                  <input 
                    className="w-full text-lg font-black outline-none border-b border-transparent focus:border-purple-200"
                    placeholder="Name"
                    value={attr.name}
                    onChange={(e) => handleUpdateField(leader.id, 'name', e.target.value)}
                  />
                  <input 
                    className="w-full text-xs text-slate-500 font-bold outline-none uppercase tracking-wider"
                    placeholder="Role"
                    value={attr.role}
                    onChange={(e) => handleUpdateField(leader.id, 'role', e.target.value)}
                  />
                  
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-[9px] font-black text-slate-400">ORDER:</span>
                     <input 
                        type="number"
                        className="w-10 text-[10px] font-bold bg-slate-50 rounded p-1"
                        value={attr.order || 0}
                        onChange={(e) => handleUpdateField(leader.id, 'order', parseInt(e.target.value))}
                     />
                  </div>
                </div>
              </div>

              {/* Status & Actions Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {isPublished ? <CheckCircle2 size={12}/> : <Globe size={12}/>}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isPublished ? 'Live on Site' : 'Draft Only'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!isPublished && (
                    <button 
                      onClick={() => handlePublish(leader.id)}
                      className="text-[10px] font-black text-purple-600 hover:underline"
                    >
                      PUBLISH NOW
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(leader.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadershipManager;