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
      
      // Fetch real revenue data from API
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
        label: 'Daily Revenue (UGX)',
        data: chartData?.data || [],
        backgroundColor: 'rgba(95, 47, 139, 0.1)',
        borderColor: '#5F2F8B',
        borderWidth: 2,
        fill: true,
        tension: 0.3, // Smoother curves for daily data
        pointBackgroundColor: '#5F2F8B',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4, // Smaller points for daily data
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#5F2F8B',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
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
          title: (context: any) => {
            // Show full date in tooltip for better context
            const label = context[0].label;
            if (label && label.includes('/')) {
              // Convert MM/DD format back to readable date
              const [month, day] = label.split('/');
              const currentYear = new Date().getFullYear();
              const date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
              return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              });
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
          callback: (value: any) => {
            if (value >= 1000000) {
              return `UGX ${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `UGX ${(value / 1000).toFixed(0)}K`;
            }
            return `UGX ${value.toLocaleString()}`;
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: period === '7d' ? 7 : period === '30d' ? 10 : 8,
          callback: function(value: any, index: number): string {
            // For daily data, show every nth label to avoid crowding
            if (period === '30d' && index % 3 !== 0) {
              return ''; // Show every 3rd label for 30-day view
            }
            return String(value);
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const totalRevenue = chartData?.data.reduce((a, b) => a + b, 0) || 0;
  const daysWithRevenue = chartData?.data.filter(value => value > 0).length || 0;
  const averageDailyRevenue = daysWithRevenue > 0 ? Math.round(totalRevenue / daysWithRevenue) : 0;
  
  // Calculate growth (compare last day with previous day if available)
  const growth = chartData?.data && chartData.data.length > 1 
    ? (() => {
        const lastDay = chartData.data[chartData.data.length - 1];
        const previousDay = chartData.data[chartData.data.length - 2];
        if (previousDay > 0) {
          return ((lastDay - previousDay) / previousDay * 100);
        }
        return 0;
      })()
    : 0;

  return (
    <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-[#5F2F8B]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Daily Revenue Trends</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 md:w-4 h-3 md:h-4" />
              <span>Avg/Day: UGX {(averageDailyRevenue / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Days Active: {daysWithRevenue}</span>
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