const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className={`p-3 md:p-4 lg:p-6 rounded-lg shadow-md border-l-4 ${color} bg-white`}>
      <h3 className="text-gray-500 text-xs md:text-sm font-medium uppercase truncate">{title}</h3>
      <p className="text-lg md:text-xl lg:text-2xl font-bold">{value}</p>
    </div>
  );
  export default StatCard;