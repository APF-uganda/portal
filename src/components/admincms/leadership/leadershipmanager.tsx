import { useState, useEffect } from 'react';
import api from '../../../services/cmsApi';
import { Save, Plus, Trash2, ArrowLeft, UserPlus, Loader2, Camera, RefreshCw, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadershipManager = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<any | null>(null);

  useEffect(() => { fetchLeaders(); }, []);

  const fetchLeaders = async () => {
    try {
      // Fetching and sorting by 'order' ascending
      const res = await api.get('/leaderships?populate=*&sort=order:asc');
      setLeaders(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = async (id: any, field: string, value: any) => {
    setUpdatingId(id);
    try {
      
      const targetId = typeof id === 'object' ? id.documentId : id;
      await api.put(`/leaderships/${targetId}`, { data: { [field]: value } });
      
      setLeaders(prev => prev.map(l => (l.id === id || l.documentId === id) 
        ? { ...l, attributes: { ...l.attributes, [field]: value } } 
        : l
      ));
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePhotoUpload = async (id: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('files', file);

    setUpdatingId(id);
    try {
      const uploadRes = await api.post('/upload', formData);
      const imageId = uploadRes.data[0].id;
      
      const targetId = typeof id === 'object' ? id.documentId : id;
      await api.put(`/leaderships/${targetId}`, { data: { Photo: imageId } });
      fetchLeaders(); 
    } catch (err) {
      alert("Photo upload failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("Are you sure? This will remove the leader from the website.")) return;
    try {
      const targetId = typeof id === 'object' ? id.documentId : id;
      await api.delete(`/leaderships/${targetId}`);
      setLeaders(prev => prev.filter(l => (l.id !== id && l.documentId !== id)));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
       <div className="text-center space-y-4">
         <Loader2 className="animate-spin text-purple-600 mx-auto" size={40} />
         <p className="font-black text-slate-400 uppercase tracking-widest text-xs"> Governance...</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center px-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/cmsPage')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 p-2 pr-4 rounded-full transition-all">
            <ArrowLeft size={18} />
            <span className="text-xs font-bold">BACK </span>
          </button>
          <h1 className="font-black text-slate-800 text-xl tracking-tight uppercase">Governance </h1>
        </div>
        <button 
          onClick={async () => {
            await api.post('/leaderships', { 
              data: { name: "New Member", role: "Assign Role", order: leaders.length + 1 } 
            });
            fetchLeaders();
          }} 
          className="bg-emerald-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-100"
        >
          <UserPlus size={18} /> ADD LEADER
        </button>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {leaders.map((leader) => {
          const attr = leader.attributes || leader;
          const photoUrl = attr.Photo?.data?.attributes?.url || attr.Photo?.url;
          const currentId = leader.documentId || leader.id;
          const isProcessing = updatingId === currentId;

          return (
            <div key={currentId} className={`bg-white p-6 rounded-[32px] shadow-sm border-2 ${isProcessing ? 'border-purple-400' : 'border-white'} flex gap-6 relative group transition-all hover:shadow-md`}>
              
              {/* Photo Section */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <div className="w-full h-full rounded-[2.5rem] bg-slate-50 overflow-hidden border-2 border-slate-100 shadow-inner">
                  {photoUrl ? (
                    <img src={`http://localhost:1337${photoUrl}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><Camera size={32}/></div>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-transform border border-slate-100 text-purple-600">
                  <Plus size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(currentId, e)} />
                </label>
              </div>

              {/* Data Section */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      className="w-full text-lg font-black outline-none border-b-2 border-transparent focus:border-purple-100 transition-colors"
                      value={attr.name}
                      onChange={(e) => setLeaders(prev => prev.map(l => (l.id === leader.id || l.documentId === leader.documentId) ? {...l, attributes: {...(l.attributes || l), name: e.target.value}} : l))}
                      onBlur={(e) => handleUpdateField(currentId, 'name', e.target.value)}
                    />
                  </div>
                  
                  {/* Sort Order Field */}
                  <div className="w-14">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Hash size={8}/> Order</label>
                    <input 
                      type="number"
                      className="w-full text-sm font-black text-purple-600 bg-purple-50 rounded-lg px-2 py-1 outline-none"
                      value={attr.order || 0}
                      onChange={(e) => setLeaders(prev => prev.map(l => (l.id === leader.id || l.documentId === leader.documentId) ? {...l, attributes: {...(l.attributes || l), order: parseInt(e.target.value)}} : l))}
                      onBlur={(e) => handleUpdateField(currentId, 'order', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Position / Role</label>
                  <input 
                    className="w-full text-sm font-bold text-slate-500 outline-none uppercase border-b-2 border-transparent focus:border-purple-100 transition-colors"
                    value={attr.role}
                    onChange={(e) => setLeaders(prev => prev.map(l => (l.id === leader.id || l.documentId === leader.documentId) ? {...l, attributes: {...(l.attributes || l), role: e.target.value}} : l))}
                    onBlur={(e) => handleUpdateField(currentId, 'role', e.target.value)}
                  />
                </div>
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(currentId)}
                className="absolute top-4 right-4 text-slate-200 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={18} />
              </button>

              {/* Saving Indicator */}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-[32px] flex items-center justify-center z-10">
                  <RefreshCw size={24} className="animate-spin text-purple-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadershipManager;