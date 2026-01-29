
import { Gem, SquareCheckBig } from 'lucide-react';

const BenefitsCard = () => {
  const benefits = [
    { t: "Exclusive Member Resources", d: "Gain access to a comprehensive library of documents, research papers, and webinars.", green: false },
    { t: "Full Voting Rights", d: "Participate in key decisions and elect board members for the association.", green: true },
    { t: "Professional Recognition & Networking", d: "Be recognized in the industry and connect with peers and leaders.", green: false },
    { t: "Discounted Event Access", d: "Enjoy special member pricing for all APF conferences, workshops, and seminars.", green: true },
    { t: "Priority Communication", d: "Receive early announcements and updates directly to your inbox.", green: false }
  ];

  return (
  
    <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-sm border border-gray-100 h-full flex flex-col w-full min-w-0">
      
      {/* 2. Header Row */}
      <div className="flex justify-between items-start mb-10 gap-4">
        <h2 className="text-xl font-bold text-gray-800 leading-tight">
          Membership Benefits & Privileges
        </h2>
        
        
        <div className="bg-[#F0FDF4] p-2.5 rounded-2xl flex-shrink-0">
          <Gem className="text-[#22C55E] w-6 h-6" strokeWidth={2.5} />
        </div>
      </div>  

      {/* 3. Benefits List*/}
      <div className="flex flex-col space-y-6">
        {benefits.map((b, i) => (
          <div key={i} className="flex items-start gap-4">
            
            <SquareCheckBig 
              className={`${b.green ? 'text-[#22C55E]' : 'text-gray-800'} w-5 h-5 flex-shrink-0 mt-0.5`} 
              strokeWidth={2.5} 
            />
            <div className="flex flex-col min-w-0">
              <p className="font-bold text-gray-800 text-[14px] leading-tight mb-1">
                {b.t}
              </p>
              
              <p className="text-gray-400 text-[12px] leading-relaxed max-w-sm">
                {b.d}
              </p>
            </div>
          </div>
        ))}
      </div>

      
      <div className="flex-grow"></div>
    </div>
  );
};

export default BenefitsCard;