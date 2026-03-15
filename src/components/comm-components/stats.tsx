export const Badge = ({ label, type }: { label: string; type: string }) => {
  const styles: Record<string, string> = {
    Sent: "bg-green-100 text-green-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Draft: "bg-orange-100 text-orange-700",
    Email: "bg-emerald-50 text-emerald-600",
    "In-App": "bg-purple-50 text-purple-600",
    Both: "bg-amber-50 text-amber-600",
    Audience: "bg-indigo-50 text-indigo-600"
  };

  const colorClass = styles[label] || styles[type] || "bg-gray-100 text-gray-600";
  
  return (
    <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium ${colorClass} whitespace-nowrap`}>
      {label}
    </span>
  );
};

export const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
    <div className="min-w-0 flex-1">
      <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{title}</p>
      <h3 className="text-2xl md:text-4xl font-bold mt-1 md:mt-2 text-gray-800">{value}</h3>
      <p className="text-xs text-gray-400 mt-1 md:mt-2">{subtext}</p>
    </div>
    <div className={`h-10 md:h-12 w-10 md:w-12 rounded-xl flex items-center justify-center ${color} flex-shrink-0 ml-2`}>
      <Icon size={20} className="md:w-6 md:h-6" />
    </div>
  </div>
);