

import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import { analyticsApi, ChartData } from '../../services/analyticsApi';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RevenueChartProps {
  className?: string;
}

type PeriodType = '7d' | '30d' | '90d' | '12m';

const RevenueChart: React.FC<RevenueChartProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>('30d');

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getRevenueTrendsChart(period);
      
      if (!data || !data.labels || data.labels.length === 0) {
        setError('No revenue data available');
      } else {
        setChartData(data);
      }
    } catch (err) {
      setError('Failed to load revenue data');
      console.error('Error fetching revenue chart:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = chartData?.data.reduce((a, b) => a + b, 0) || 0;
  const daysWithRevenue = chartData?.data.filter(value => value > 0).length || 0;
  const averageDailyRevenue = daysWithRevenue > 0 ? Math.round(totalRevenue / daysWithRevenue) : 0;
  
  const growth = chartData?.data && chartData.data.length > 1 
    ? (() => {
        const lastDay = chartData.data[chartData.data.length - 1];
        const previousDay = chartData.data[chartData.data.length - 2];
        return previousDay > 0 ? ((lastDay - previousDay) / previousDay * 100) : 0;
      })()
    : 0;

  if (loading || error) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 flex flex-col items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className={`w-5 h-5 ${error ? 'text-red-500' : 'text-[#5F2F8B]'}`} />
          <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
        </div>
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5F2F8B]"></div>
        ) : (
          <p className="text-sm font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  }

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Daily Revenue (UGX)',
        data: chartData?.data || [],
        backgroundColor: 'rgba(95, 47, 139, 0.05)',
        borderColor: '#5F2F8B',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#5F2F8B',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: period === '7d' ? 4 : 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        callbacks: {
          label: (context: any) => ` Revenue: UGX ${context.parsed.y.toLocaleString()}`,
          title: (context: any) => {
            const label = context[0].label;
            if (label?.includes('/')) {
              const [month, day] = label.split('/');
              const date = new Date(new Date().getFullYear(), parseInt(month) - 1, parseInt(day));
              return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 10 },
          maxTicksLimit: 6,
          callback: (value: any) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value.toLocaleString();
          },
        },
        grid: { color: 'rgba(0, 0, 0, 0.03)' },
        title: {
          display: true,
          text: 'Amount (UGX)',
          font: { size: 9, weight: 'bold' as const },
          color: '#94a3b8'
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          autoSkip: true,
          maxRotation: 0,
          minTickGap: 10,
          maxTicksLimit: window.innerWidth < 640 ? 5 : 10,
          callback: function(value: any, index: number) {
            const label = chartData?.labels[index] || '';
            // Show only DD on very small screens to save space
            if (window.innerWidth < 400 && label.includes('/')) {
              return label.split('/')[1];
            }
            return label;
          }
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' as const },
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="p-4 md:p-6 border-b border-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#5F2F8B]" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-800 leading-tight">Daily Revenue Trends</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Performance metrics for selected period</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Stats Row - Responsive Wrap */}
            <div className="flex items-center justify-between sm:justify-start gap-2 md:gap-4 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1">
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400">Avg/Day</span>
                <span className="text-xs md:text-sm font-bold text-gray-700">{(averageDailyRevenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400">Active</span>
                <span className="text-xs md:text-sm font-bold text-gray-700">{daysWithRevenue}d</span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className={`flex flex-col ${growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400">Trend</span>
                <div className="flex items-center gap-0.5 text-xs md:text-sm font-bold">
                  {growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(growth).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5 bg-white shadow-sm self-end sm:self-auto">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodType)}
                className="text-xs font-bold text-gray-600 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="12m">12 Months</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-2 md:p-6 h-64 md:h-80 w-full">
        <ChartWrapper type="line" data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;