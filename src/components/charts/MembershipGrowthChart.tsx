/**
 * Membership Growth Chart Component
 */

import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import { analyticsApi, ChartData } from '../../services/analyticsApi';
import { TrendingUp, Calendar } from 'lucide-react';

interface MembershipGrowthChartProps {
  className?: string;
}

const MembershipGrowthChart: React.FC<MembershipGrowthChartProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'30d' | '12m'>('30d');

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching membership growth chart data for period:', period);
      const data = await analyticsApi.getMembershipGrowthChart(period);
      console.log('Received membership growth data:', data);
      
      // Check if data is valid
      if (!data || !data.labels || !data.data) {
        console.warn('Invalid chart data received:', data);
        setError('No data available for the selected period');
        return;
      }
      
      // Check if arrays are empty
      if (data.labels.length === 0 || data.data.length === 0) {
        console.warn('Empty chart data arrays');
        setError('No membership growth data available for the selected period');
        return;
      }
      
      setChartData(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load membership growth data';
      setError(errorMessage);
      console.error('Error fetching membership growth chart:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5F2F8B]" />
            <h3 className="text-lg font-semibold text-gray-800">Membership Growth</h3>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5F2F8B]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5F2F8B]" />
            <h3 className="text-lg font-semibold text-gray-800">Membership Growth</h3>
          </div>
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-red-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchChartData}
            className="px-4 py-2 bg-[#5F2F8B] text-white rounded-lg hover:bg-[#4a1d72] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'New Members',
        data: chartData?.data || [],
        backgroundColor: 'rgba(95, 47, 139, 0.1)',
        borderColor: '#5F2F8B',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
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
          label: (context: any) => `New Members: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#5F2F8B]" />
          <h3 className="text-lg font-semibold text-gray-800">Membership Growth</h3>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as '30d' | '12m')}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#5F2F8B] focus:border-transparent"
          >
            <option value="30d">Last 30 Days</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>
      </div>
      
      <ChartWrapper
        type="line"
        data={data}
        options={options}
        height={280}
      />
    </div>
  );
};

export default MembershipGrowthChart;