import { useState, useEffect } from 'react';
import api from '../../../utils/cmsapi';
import { CMS_BASE_URL } from '../../../config/api';
import { Pencil, Trash2, UserPlus, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadershipManager = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    order: 0,
    isActive: true,
    Photo: null as number | null
  });

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
     
      const res = await api.get('/leaderships?populate=Photo&sort=order:asc');
      setLeaders(res.data.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('files', file);

    try {
      const res = await api.post('/upload', uploadData);
      setFormData({ ...formData, Photo: res.data[0].id });
      alert("Photo uploaded successfully!");
    } catch (err) {
      alert("Upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Collection types use POST for new entries
      await api.post('/leaderships', { data: formData });
      setIsModalOpen(false);
      fetchLeaders(); // Refresh list
      setFormData({ name: '', role: '', order: 0, isActive: true, Photo: null });
    } catch (err) {
      alert("Error saving leader");
    }
  };

  const deleteLeader = async (id: number) => {
    if (!window.confirm("Delete this leader?")) return;
    await api.delete(`/leaderships/${id}`);
    fetchLeaders();
  };

  if (loading) return <div className="p-10">Loading Governance...</div>;

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
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold"
        >
          <UserPlus size={18}/> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map((leader: any) => (
          <div key={leader.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative">
            <div className="flex items-center gap-4">
              {leader.attributes.Photo?.data?.attributes?.url && (
                <img 
                  src={`${CMS_BASE_URL}${leader.attributes.Photo.data.attributes.url}`} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-bold text-slate-800">{leader.attributes.name}</h3>
                <p className="text-sm text-slate-500">{leader.attributes.role}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="flex items-center gap-1 text-xs font-bold">
                {leader.attributes.isActive ? (
                  <><CheckCircle size={14} className="text-green-500"/> Active</>
                ) : (
                  <><XCircle size={14} className="text-red-400"/> Inactive</>
                )}
              </span>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-purple-600"><Pencil size={16}/></button>
                <button 
                   onClick={() => deleteLeader(leader.id)}
                   className="p-2 text-slate-400 hover:text-red-500"
                ><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FOR ADDING (Simple version) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-black mb-6">New Leader</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Full Name" 
                className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <input 
                placeholder="Role (e.g. Chairperson)" 
                className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                onChange={e => setFormData({...formData, role: e.target.value})}
                required
              />
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">PHOTO</label>
                <input type="file" onChange={handleFileUpload} required />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500"
                >Cancel</button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold"
                >Save Leader</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipManager;
