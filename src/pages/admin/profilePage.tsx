import  { useState } from "react";

import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { PersonalInfo } from '../../components/profilepage-components/personalInfo';
import { ProfessionalInfo } from '../../components/profilepage-components/professionalInfo';
import { SecuritySettings } from '../../components/profilepage-components/securitySettings';
import { NotificationPrefs } from '../../components/profilepage-components/notificationprefs';

const ProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      
      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        
       
        <Header title="My Profile" />

        <div className="flex-1 bg-[#F4F2FE] p-8 space-y-10">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
            
            <div>
              <h1 className="text-[26px] font-bold text-slate-800 tracking-tight text-[#5C32A3]">My Profile</h1>
              <p className="text-slate-500 mt-1">Manage your personal and professional information. Keep your profile updated to ensure seamless communication.</p>
            </div>

           
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 border-l-8 border-[#5C32A3]">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joan" 
                    alt="CPA Mutumba" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <button className="absolute bottom-1 right-1 bg-[#5C32A3] p-2 rounded-full border-2 border-white text-white hover:scale-110 transition-transform">
                  <span className="text-xs">✏️</span>
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">Joan Ntaky</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  <p className="text-sm text-gray-500">
                    Admin member • <span className="font-semibold">ICPAU Reg. No: F/ICPAU/2015/001</span>
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
                    <span>✉️</span> jane.doe@apf.org
                  </div>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
                    <span>📞</span> +256 770 123 456
                  </div>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
                    <span>📍</span> Kampala, Uganda
                  </div>
                </div>
              </div>
            </div>

            {/* Form Sections */}
            <div className="space-y-8">
              <PersonalInfo />
              <ProfessionalInfo />
              <SecuritySettings />
              <NotificationPrefs />
            </div>

          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default ProfilePage;