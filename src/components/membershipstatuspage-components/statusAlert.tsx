import { AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatusAlert = () => {
  return (
   
    <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-sm border border-gray-100 h-full flex flex-col w-full min-w-0">
      
      {/* Header Row  */}
      <div className="flex justify-between items-start mb-8 sm:mb-10 gap-4">
        <h2 className="text-xl font-bold text-gray-800 leading-tight">
          Membership Alert
        </h2>
        <div className="bg-[#FFF5E6] p-2.5 rounded-2xl flex-shrink-0">
          <AlertTriangle className="text-[#F59E0B] w-6 h-6" strokeWidth={2.5} />
        </div>
      </div>

      {/* Content Body  */}
      <div className="flex flex-col sm:flex-row items-start gap-5">
        
      
        <div className="bg-[#FFF5E6] p-3 rounded-2xl flex-shrink-0 mt-1">
          <Clock className="text-[#F59E0B] w-6 h-6" strokeWidth={2.5} />
        </div>

    
        <div className="flex flex-col flex-1 min-w-0 w-full">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
              Membership Nearing Expiry!
            </h3>
            
            
            <p className="text-gray-400 text-sm leading-relaxed w-full max-w-xs">
              Your membership will expire on January 26, 2026. Only 7 days remaining! Renew now to avoid interruption.
            </p>
          </div>

          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/payments">
              <button className="bg-[#7338A0] hover:bg-[#4C1D95] text-white px-7 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm text-center w-full">
                Renew Now
              </button>
            </Link>
            <button className="bg-[#F5F3FF] hover:bg-[#EDE9FE] text-black px-7 py-2.5 rounded-xl font-bold text-sm transition-all text-center border border-transparent">
              Remind Later
            </button>
          </div>
        </div>
      </div>

      
      <div className="flex-grow"></div>
    </div>
  );
};

export default StatusAlert;