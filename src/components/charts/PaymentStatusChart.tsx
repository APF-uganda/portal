/**
 * Payment Status Distribution Chart Component
 */

import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';
import { analyticsApi, ChartData } from '../../services/analyticsApi';
import { CreditCard, CheckCircle, Clock, XCircle, Calendar } from 'lucide-react';

interface PaymentStatusChartProps {
  className?: string;
}

type PeriodType = '7d' | '30d' | '90d';

const PaymentStatusChart: React.FC<PaymentStatusChartProps> = ({ className = '' }) => {
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
      // Mock payment status data - replace with actual API call when available
      const mockData: ChartData = {
        labels: ['Completed', 'Pending', 'Rejected'],
        data: period === '7d' 
          ? [45, 12, 3]
          : period === '30d'
          ? [180, 35, 8]
          : [520, 95, 22]
      };
      setChartData(mockData);
    } catch (err) {
      setError('Failed to load payment status data');
      console.error('Error fetching payment status chart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 md:w-5 h-4 md:h-5 text-[#5F2F8B]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Payment Status</h3>
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
          <CreditCard className="w-4 md:w-5 h-4 md:h-5 text-[#5F2F8B]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Payment Status</h3>
        </div>
        <div className="h-48 md:h-64 flex items-center justify-center text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Color mapping for different payment statuses
  const getStatusColors = (labels: string[]) => {
    return labels.map(label => {
      switch (label.toLowerCase()) {
        case 'completed':
          return '#10B981'; // Emerald
        case 'pending':
          return '#F59E0B'; // Amber
        case 'rejected':
          return '#EF4444'; // Red
        default:
          return '#8B5CF6'; // Purple
      }
    });
  };

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Payments',
        data: chartData?.data || [],
        backgroundColor: getStatusColors(chartData?.labels || []),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const totalPayments = chartData?.data.reduce((a, b) => a + b, 0) || 0;
  const completedPayments = chartData?.data[0] || 0;
  const successRate = totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : '0';

  return (
    <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 md:w-5 h-4 md:h-5 text-[#5F2F8B]" />
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Payment Status</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-600" />
              <span>Success: {successRate}%</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="w-3 md:w-4 h-3 md:h-4" />
              <span>Total: {totalPayments}</span>
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
            </select>
          </div>
        </div>
      </div>
      
      <div className="h-48 md:h-64">
        <ChartWrapper
          type="doughnut"
          data={data}
          options={options}
        />
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {chartData?.labels.map((label, index) => {
          const value = chartData.data[index];
          const percentage = totalPayments > 0 ? ((value / totalPayments) * 100).toFixed(1) : '0';
          
          const getIcon = (status: string) => {
            switch (status.toLowerCase()) {
              case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
              case 'pending':
                return <Clock className="w-4 h-4 text-amber-600" />;
              case 'rejected':
                return <XCircle className="w-4 h-4 text-red-600" />;
              default:
                return <CreditCard className="w-4 h-4 text-gray-600" />;
            }
          };

          return (
            <div key={label} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                {getIcon(label)}
                <span className="text-xs font-medium text-gray-600">{label}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentStatusChart;