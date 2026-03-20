import React, { useEffect, useState } from 'react';
import { CheckCircle, ExternalLink, ShieldCheck, Mail, User, Phone } from 'lucide-react';
import axios from 'axios'; 
const AdminEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchRegistrations = async () => {
    try {
     
      const response = await axios.get('http://localhost:8000/api/events/admin/registrations/');
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Payment Action
  const handleVerify = async (id: number) => {
    if (!window.confirm("Confirm verification? This will trigger the confirmation email.")) return;
    
    try {
      await axios.patch(`http://localhost:8000/api/events/admin/verify/${id}/`);
      // Refresh the list to show updated status
      fetchRegistrations();
    } catch (error) {
      alert("Verification failed. Make sure you are logged in as an admin.");
    }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  if (loading) return <div className="p-10 text-center font-bold">Loading Attendees...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Event Management</h1>
            <p className="text-slate-500 font-medium">Verify payments and manage registrations</p>
          </div>
          <div className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold">
            <ShieldCheck size={18} /> Admin Access
          </div>
        </header>

        <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-[0.2em]">
                <th className="px-6 py-5">Attendee Details</th>
                <th className="px-6 py-5">Event</th>
                <th className="px-6 py-5">Proof of Payment</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.map((reg: any) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900">{reg.full_name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Mail size={12} /> {reg.email}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone size={12} /> {reg.phone_number}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">
                      {reg.event_title}
                    </span>
                    <div className="text-[10px] uppercase font-black text-slate-400 mt-1 tracking-widest">
                      {reg.attendance_mode}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {reg.proof_of_payment ? (
                      <a 
                        href={reg.proof_of_payment} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"
                      >
                        View Receipt <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-slate-300 text-xs italic">Not required/uploaded</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      reg.payment_status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {reg.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {reg.payment_status !== 'Verified' && (
                      <button 
                        onClick={() => handleVerify(reg.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-md shadow-green-100"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;