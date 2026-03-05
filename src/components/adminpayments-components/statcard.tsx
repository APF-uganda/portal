import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number; 
  icon: LucideIcon;
  iconBg: string; 
  color: string;  
}

export const PaymentStatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconBg, 
  color 
}: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className={`bg-white p-6 rounded-[20px] shadow-sm border-l-4 ${color} border border-y-gray-100 border-r-gray-100 transition-transform hover:scale-[1.02] duration-200`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            {title}
          </p>
          
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {value}
          </h3>
          
          <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            <div className={`flex items-center px-1.5 py-0.5 rounded-lg ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="ml-0.5">{Math.abs(change)}%</span>
            </div>
            <span className="ml-2 text-slate-400 font-medium whitespace-nowrap">vs last month</span>
          </div>
        </div>

        <div className={`${iconBg} p-3 rounded-xl text-white shadow-lg shadow-gray-100`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};