interface RecentItemProps {
    title: string;
    subtitle: string;
    statusColor: string;
  }
  
  export const RecentItem = ({ title, subtitle, statusColor }: RecentItemProps) => (
    <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl mb-2 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${statusColor}`} />
      <div>
        <h4 className="text-sm font-bold text-gray-800 leading-tight">{title}</h4>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );