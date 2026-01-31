import React from 'react';
import chairmanImg from '../../assets/images/landingPage-image/chair.jpg'


import { Pencil, Mail, Phone, MapPin } from 'lucide-react';


const ContactChip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
    <span className="text-gray-400 w-4 h-4">{icon}</span>
    <span className="text-xs text-gray-600 font-medium">{text}</span>
  </div>
);

const ProfileHeader = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-8 mb-6 border-l-8 border-[#5C32A3]">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
          
          <img 
          src={chairmanImg}
             alt="CPA Ronald Mukumba - Chairperson APF Uganda"
            className="w-full h-full object-cover" 
          />
        </div>
        <button className="absolute bottom-0 right-0 bg-[#5C32A3] p-1.5 rounded-full border-2 border-white hover:bg-purple-800 transition-colors">
          <Pencil className="w-3 h-3 text-white" />
        </button>
      </div>
      
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">Joan Ntaky</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
          <p className="text-gray-500 text-sm">
            Admin member • <span className="font-mono">ICPAU Reg. No: F/ICPAU/2015/001</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <ContactChip icon={<Mail size={14} />} text="jane.doe@apf.org" />
          <ContactChip icon={<Phone size={14} />} text="+256 770 123 456" />
          <ContactChip icon={<MapPin size={14} />} text="Kampala, Uganda" />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;