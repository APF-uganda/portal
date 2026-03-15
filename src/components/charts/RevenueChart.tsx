/**
 * Revenue Trends Chart Component
 */

import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import { analyticsApi, ChartData } from '../../services/analyticsApi';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

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
      // For now, we'll create mock revenue data since the API might not have this endpoint yet
      const mockData: ChartData = {
        labels: period === '7d' 
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : period === '30d'
          ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
          : period === '90d'
          ? ['Month 1', 'Month 2', 'Month 3']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: period === '7d'
          ? [450000, 320000, 680000, 890000, 1200000, 750000, 560000]
          : period === '30d'
          ? [2800000, 3200000, 4100000, 3800000]
          : period === '90d'
          ? [12500000, 14200000, 16800000]
          : [8500000, 9200000, 11800000, 13400000, 15600000, 14200000, 16800000, 18200000, 17500000, 19800000, 21200000, 23500000]
      };
      setChartData(mockData);
    } catch (err) {
      setError('Failed to load revenue data');
      console.error('Error fetching revenue chart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-[#5F2F8B]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Revenue Trends</h3>
        </div>
        <div className="h-48 md:h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 md:h-8 w-6 md:w-8 border-b-2 border-[#5F2F8B]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-[#5F2F8B]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Revenue Trends</h3>
        </div>
        <div className="h-48 md:h-64 flex items-center justify-center text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Revenue (UGX)',
        data: chartData?.data || [],
        backgroundColor: 'rgba(95, 47, 139, 0.1)',
        borderColor: '#5F2F8B',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#5F2F8B',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Revenue: UGX ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `UGX ${(value / 1000000).toFixed(1)}M`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const totalRevenue = chartData?.data.reduce((a, b) => a + b, 0) || 0;
  const averageRevenue = totalRevenue > 0 ? Math.round(totalRevenue / chartData!.data.length) : 0;
  const growth = chartData?.data && chartData.data.length > 1 
    ? ((chartData.data[chartData.data.length - 1] - chartData.data[chartData.data.length - 2]) / chartData.data[chartData.data.length - 2] * 100)
    : 0;

  return (
    <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-[#5F2F8B]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Revenue Trends</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 md:w-4 h-3 md:h-4" />
              <span>Total: UGX {(totalRevenue / 1000000).toFixed(1)}M</span>
            </div>
            <div className={`flex items-center gap-1 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>{growth >= 0 ? '↗' : '↘'} {Math.abs(growth).toFixed(1)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 md:w-4 h-3 md:h-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodType)}
              className="text-xs md:text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#5F2F8B] focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="h-48 md:h-64">
        <ChartWrapper
          type="line"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default RevenueChart;