import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Video, Image as ImageIcon, 
  Clock, Save, ArrowLeft, Globe,  Sparkles 
} from 'lucide-react';

// Layout Components
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const EventCreatePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // State structured to match Strapi's expected JSON format
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isVirtual: false,
    location: '',
    status: 'Draft',
    featuredImage: null
  });

  const handlePublish = () => {
    //  pass the data to  API
    console.log("Publishing to Strapi...", eventData);
    alert("Event Published Successfully!");
    navigate('/admin/cms');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen`}>
        <Header title="Create New Event" />

        <div className="flex-1 bg-[#F4F2FE] p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Action Header */}
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-purple-700 transition"
              >
                <ArrowLeft size={16} /> Discard & Return
              </button>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition">
                  Save Draft
                </button>
                <button 
                  onClick={handlePublish}
                  className="px-8 py-2.5 bg-[#5C32A3] text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-200 hover:scale-105 transition flex items-center gap-2"
                >
                  <Save size={18} /> Publish Event
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                  <section className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Event Headline</label>
                    <input 
                      type="text"
                      placeholder="Enter a catchy title for the event..."
                      className="w-full text-3xl font-black text-slate-800 outline-none border-b-2 border-transparent focus:border-purple-100 py-2 transition-colors placeholder:text-slate-200"
                      value={eventData.title}
                      onChange={(e) => setEventData({...eventData, title: e.target.value})}
                    />
                  </section>

                  <section className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Full Description</label>
                    <textarea 
                      placeholder="Tell the admin exactly what this event is about..."
                      className="w-full h-96 bg-slate-50 rounded-[32px] p-8 outline-none focus:ring-4 focus:ring-purple-500/5 focus:bg-white border border-transparent focus:border-purple-100 text-slate-600 resize-none font-medium leading-relaxed"
                      value={eventData.description}
                      onChange={(e) => setEventData({...eventData, description: e.target.value})}
                    />
                  </section>
                </div>
              </div>

             
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                  <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Sparkles size={18} className="text-purple-500" /> Logistics
                  </h3>

                 
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Starts</label>
                      <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                         <input 
                           type="datetime-local" 
                           className="w-full bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-purple-200 transition" 
                           onChange={(e) => setEventData({...eventData, startDate: e.target.value})}
                         />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ends</label>
                      <div className="relative">
                         <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                         <input 
                           type="datetime-local" 
                           className="w-full bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-purple-200 transition" 
                           onChange={(e) => setEventData({...eventData, endDate: e.target.value})}
                         />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-50" />

                 
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block">Venue Type</label>
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                      <button 
                        onClick={() => setEventData({...eventData, isVirtual: false})}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${!eventData.isVirtual ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
                      >
                        PHYSICAL
                      </button>
                      <button 
                        onClick={() => setEventData({...eventData, isVirtual: true})}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${eventData.isVirtual ? 'bg-white text-[#5C32A3] shadow-sm' : 'text-slate-400'}`}
                      >
                        VIRTUAL
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                        {eventData.isVirtual ? <Video size={16} /> : <MapPin size={16} />}
                      </div>
                      <input 
                        placeholder={eventData.isVirtual ? "Meeting Link" : "Venue Address"}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-purple-200 transition"
                        value={eventData.location}
                        onChange={(e) => setEventData({...eventData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <hr className="border-slate-50" />

                  {/* Media Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Event Banner</label>
                    <div className="aspect-video bg-slate-50 rounded-[28px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer overflow-hidden relative">
                       <ImageIcon className="text-slate-300 group-hover:text-purple-400 transition-colors mb-2" size={32} />
                       <span className="text-[10px] font-black text-purple-600 uppercase">Click to Upload</span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="bg-[#5C32A3] p-6 rounded-[40px] text-white flex items-center gap-4 shadow-xl shadow-purple-200">
                   <div className="p-3 bg-white/10 rounded-2xl"><Globe size={20} /></div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Visibility</p>
                     <p className="text-sm font-bold">Public on Website</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default EventCreatePage;