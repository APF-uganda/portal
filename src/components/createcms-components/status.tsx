import { ArticleStatus } from '../../components/createcms-components/newstypes';

interface StatusBadgeProps {
  status: ArticleStatus | 'Featured'; 
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const themes = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Draft: "bg-amber-50 text-amber-700 border-amber-100",
    Scheduled: "bg-blue-50 text-blue-700 border-blue-100",
    Featured: "bg-purple-50 text-purple-700 border-purple-100",
  };

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${themes[status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
      {status}
    </span>
  );
};