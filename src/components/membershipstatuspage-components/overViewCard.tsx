import React from 'react';
import { IdCard, User, CalendarCheck, CalendarX, BarChart3 } from 'lucide-react';

const OverviewCard = () => {
  return (
   
    <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-sm border border-gray-100 h-full flex flex-col w-full min-w-0">
      
      {/* Header Row  */}
      <div className="flex justify-between items-start mb-10 gap-4">
        <h2 className="text-xl font-bold text-gray-800 leading-tight">
          Your Membership Overview
        </h2>
        <div className="bg-[#F5F3FF] p-2.5 rounded-2xl flex-shrink-0">
          <IdCard className="text-[#915DB1] w-6 h-6" strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        
        {/* Membership Type  */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 gap-2">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">Membership Type:</p>
            <p className="text-gray-800 font-bold text-sm truncate">Premium Professional</p>
          </div>
          <User className="text-[#915DB1] w-5 h-5 flex-shrink-0" />
        </div>

        {/* Approval Date */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">Approval Date:</p>
            <p className="text-gray-800 font-bold text-sm">January 26, 2025</p>
          </div>
          <CalendarCheck className="text-[#915DB1] w-5 h-5 flex-shrink-0" />
        </div>

        {/* Expiry Date */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">Expiry Date:</p>
            <p className="text-gray-800 font-bold text-sm">January 26, 2026</p>
          </div>
          <CalendarX className="text-[#F59E0B] w-5 h-5 flex-shrink-0" />
        </div>

        {/* Progress Section */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
             <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400">Progress:</p>
             <BarChart3 className="text-[#7338A0] w-5 h-5 flex-shrink-0" />
          </div>
          <p className="text-gray-800 font-bold text-sm mb-2">85% Complete</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            
            <div className="bg-[#5B21B6] h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      <div className="flex-grow"></div>
    </div>
  );
};

export default OverviewCard;