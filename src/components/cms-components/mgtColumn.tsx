import { ChevronRight } from 'lucide-react';

interface ColumnProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  viewAllLink?: string;
}

export const ManagementColumn = ({ title, icon, children,  }: ColumnProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
        {icon}
      </div>
    </div>
    
    <div className="flex-grow">
      {children}
    </div>

    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
      <span className="font-bold text-sm text-gray-700">Recent {title.split(' ')[0]}</span>
      <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
        View All <ChevronRight size={16} />
      </button>
    </div>
  </div>
);