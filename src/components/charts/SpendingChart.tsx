import React from 'react'
import { SpendingData } from '../../services/spending.service'

interface SpendingChartProps {
  data: SpendingData[]
  totalSpent: number
  className?: string
}

const SpendingChart: React.FC<SpendingChartProps> = ({ data, totalSpent, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No spending data available</p>
        </div>
      </div>
    )
  }

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(item => item.amount))
  
  // Generate colors for bars
  const colors = [
    'from-purple-600 to-purple-400',
    'from-blue-600 to-blue-400',
    'from-green-600 to-green-400',
    'from-yellow-600 to-yellow-400',
    'from-red-600 to-red-400',
  ]

  return (
    <div className={`w-full ${className}`}>
      {/* Chart Container */}
      <div className="relative h-64 bg-gray-50 rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>UGX {(maxValue).toLocaleString()}</span>
          <span>UGX {(maxValue * 0.75).toLocaleString()}</span>
          <span>UGX {(maxValue * 0.5).toLocaleString()}</span>
          <span>UGX {(maxValue * 0.25).toLocaleString()}</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="ml-16 h-full flex items-end justify-center gap-4">
          {data.map((item, index) => {
            const height = (item.amount / maxValue) * 100
            const colorClass = colors[index % colors.length]
            
            return (
              <div key={item.year} className="flex flex-col items-center group">
                {/* Value label on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                    {item.formattedAmount}
                  </div>
                </div>
                
                {/* Bar */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-12 bg-gradient-to-t ${colorClass} rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer shadow-sm`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${item.year}: ${item.formattedAmount}`}
                  />
                  
                  {/* Year label */}
                  <div className="mt-2 text-xs font-medium text-gray-600">
                    {item.year}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 ml-16 pointer-events-none">
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              className="absolute w-full border-t border-gray-200"
              style={{ bottom: `${ratio * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-xs text-purple-600 font-medium">Total Spent</div>
          <div className="text-lg font-bold text-purple-800">
            UGX {totalSpent.toLocaleString()}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium">Years Tracked</div>
          <div className="text-lg font-bold text-blue-800">
            {data.length} {data.length === 1 ? 'Year' : 'Years'}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {data.map((item, index) => {
          const colorClass = colors[index % colors.length]
          return (
            <div key={item.year} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded bg-gradient-to-r ${colorClass}`} />
              <span className="text-xs text-gray-600">
                {item.year}: {item.formattedAmount}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SpendingChart