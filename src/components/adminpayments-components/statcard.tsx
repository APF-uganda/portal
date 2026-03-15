import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // Optional to prevent errors if data isn't ready
  icon?: LucideIcon;
  iconBg?: string;
  color?: string; // For the border-left-4 color
}

export const PaymentStatCard = ({ 
  title, 
  value, 
  change = 0, 
  icon: Icon, 
  iconBg = "bg-indigo-500", 
  color = "border-gray-200" 
}: StatCardProps) => {
  // Debug logging
  console.log(`StatCard ${title}:`, { value, change });
  
  return (
    <div className={`bg-white p-6 rounded-[20px] shadow-sm border-l-4 ${color} border border-y-gray-100 border-r-gray-100`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-black text-slate-800">
            {value}
          </h3>
          
          <div className={`flex items-center mt-2 text-sm font-bold ${
            change === 0 ? 'text-gray-600' : change > 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {change === 0 ? (
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
                <span>0%</span>
              </div>
            ) : change > 0 ? (
              <div className="flex items-center">
                <ArrowUpRight size={16} className="mr-1" />
                <span>+{Math.abs(change)}%</span>
              </div>
            ) : (
              <div className="flex items-center">
                <ArrowDownRight size={16} className="mr-1" />
                <span>-{Math.abs(change)}%</span>
              </div>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`${iconBg} p-3 rounded-xl text-white shadow-sm`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatCard;