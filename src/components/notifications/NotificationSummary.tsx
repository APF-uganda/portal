import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { NotificationStats } from '../../services/notifications.service'

interface NotificationSummaryProps {
  stats: NotificationStats
  loading: boolean
}

const NotificationSummary: React.FC<NotificationSummaryProps> = ({ stats, loading }) => {
  // Generate weekly activity data based on stats
  const generateWeeklyData = () => {
    const baseActivity = Math.max(stats.total / 7, 1)
    return [
      Math.floor(baseActivity * 0.8),
      Math.floor(baseActivity * 0.6),
      Math.floor(baseActivity * 1.2),
      Math.floor(baseActivity * 0.4),
      Math.floor(baseActivity * 1.0),
      Math.floor(baseActivity * 0.7),
      Math.floor(baseActivity * 1.1),
    ]
  }

  const weeklyData = generateWeeklyData()
  const maxWeeklyValue = Math.max(...weeklyData, 1)

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Notification Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Weekly Activity Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Activity</h4>
          <div className="h-32 flex items-end gap-2 mb-2">
            {weeklyData.map((value, index) => {
              const height = (value / maxWeeklyValue) * 100
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-purple-200 to-purple-400 rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}: ${value} notifications`}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">By Category</h4>
          {loading ? (
            <>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Announcements</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.byType.announcement || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Membership Updates</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.byType.membership || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Payment Notifications</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.byType.payment || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-600 text-sm">System Alerts</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.byType.system || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Security Alerts</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.byType.security || 0}</span>
              </div>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-gray-200 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {loading ? '...' : stats.total}
              </div>
              <div className="text-xs text-purple-600">Total</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600">
                {loading ? '...' : stats.urgent}
              </div>
              <div className="text-xs text-red-600">Urgent</div>
            </div>
          </div>
        </div>

        {/* Read/Unread Progress */}
        <div className="pt-4 border-t border-gray-200 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Reading Progress</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Read</span>
              <span className="font-medium">{loading ? '...' : `${stats.read}/${stats.total}`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: stats.total > 0 ? `${(stats.read / stats.total) * 100}%` : '0%'
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 text-center">
              {stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0}% completed
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationSummary