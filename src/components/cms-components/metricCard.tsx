
import { Eye, Download, Edit3, Clock } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  type: 'published' | 'draft';
}

export const MetricCard = ({ label, value, trend, isPositive, type }: MetricCardProps) => (
  <div className="bg-gray-50 p-4 rounded-xl mb-3 border border-transparent hover:border-gray-200 transition-all">
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex gap-1">
        <button className="p-1.5 hover:bg-white rounded border border-gray-200 text-gray-400">
          {type === 'published' ? <Eye size={14} /> : <Edit3 size={14} />}
        </button>
        <button className="p-1.5 hover:bg-white rounded border border-gray-200 text-gray-400">
          {type === 'published' ? <Download size={14} /> : <Clock size={14} />}
        </button>
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
      <span>{isPositive ? '↑' : '↓'}</span> {trend}
    </div>
  </div>
);