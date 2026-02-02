import React, { useState } from "react"
import {
  Bell,
  Filter,
  CheckCheck,
  Search,
  CreditCard,
  Server,
  Rocket,
  Star,
  CheckCircle,
  Shield,
  AlertTriangle,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  type: 'membership' | 'payment' | 'system' | 'security'
  isUnread: boolean
  icon: React.ElementType
}

const NotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '2',
      title: 'Payment Reminder: Invoice #2023001',
      description: 'Your monthly subscription payment is due tomorrow. Please update your payment method promptly.',
      time: '09:15 AM',
      type: 'payment',
      isUnread: true,
      icon: CreditCard,
    },
    {
      id: '3',
      title: 'System Maintenance Scheduled',
      description: 'Expected downtime for essential updates on 2023-11-20 at 3 AM UTC. Services will resume shortly.',
      time: '08:00 AM',
      type: 'system',
      isUnread: false,
      icon: Server,
    },
    {
      id: '4',
      title: 'Exciting New Feature Released!',
      description: 'Discover the new analytics dashboard, now available to all users for enhanced insights.',
      time: '07:45 AM',
      type: 'system',
      isUnread: false,
      icon: Rocket,
    },
    {
      id: '5',
      title: 'Welcome to APF Annual Membership!',
      description: 'Your membership has been successfully upgraded. Enjoy your new benefits and exclusive access.',
      time: 'Nov 15, 2:30 PM',
      type: 'membership',
      isUnread: false,
      icon: Star,
    },
    {
      id: '6',
      title: 'Payment Processed: Invoice #2023002',
      description: 'Your recent payment for Invoice #2023002 has been successfully processed. Thank you for your continuing experience.',
      time: 'Nov 14, 11:20 AM',
      type: 'payment',
      isUnread: false,
      icon: CheckCircle,
    },
    {
      id: '7',
      title: 'Security Alert: Unusual Login Attempt',
      description: 'We detected an unusual login attempt from an unrecognized device. Please review your account activity.',
      time: 'Nov 13, 9:45 PM',
      type: 'security',
      isUnread: true,
      icon: Shield,
    },
  ])

  const unreadCount = notifications.filter(n => n.isUnread).length
  const readCount = notifications.filter(n => !n.isUnread).length
  const urgentCount = notifications.filter(n => n.type === 'security' && n.isUnread).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'membership':
        return 'bg-purple-100 text-purple-600'
      case 'payment':
        return 'bg-green-100 text-green-600'
      case 'system':
        return 'bg-blue-100 text-blue-600'
      case 'security':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isUnread: !notification.isUnread }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isUnread: false }))
    )
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return notification.isUnread
    return notification.type === activeFilter
  })

  const todayNotifications = filteredNotifications.slice(0, 4)
  const weekNotifications = filteredNotifications.slice(4)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button 
              onClick={markAllAsRead}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{unreadCount}</h3>
                <p className="text-gray-600">Unread Notifications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{readCount}</h3>
                <p className="text-gray-600">Read Notifications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{urgentCount}</h3>
                <p className="text-gray-600">Urgent Alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Notifications Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Filters */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'payment', label: 'Payments' },
                  { key: 'membership', label: 'Membership' },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={activeFilter === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.key)}
                    className={activeFilter === filter.key ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>

            {/* Today's Notifications */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Today</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayNotifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div
                      key={notification.id}
                      className={`flex p-4 rounded-lg border-l-4 transition-all cursor-pointer hover:bg-gray-50 ${
                        notification.isUnread 
                          ? 'bg-purple-50/50 border-l-purple-600' 
                          : 'border-l-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{notification.title}</div>
                        <div className="text-gray-600 text-sm mb-2 leading-relaxed">{notification.description}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleNotificationRead(notification.id)}
                          className="text-gray-500 hover:text-purple-600 text-xs"
                        >
                          {notification.isUnread ? 'Mark as read' : 'Mark as unread'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* This Week's Notifications */}
            {weekNotifications.length > 0 && (
              <Card className="bg-white shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">This Week</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weekNotifications.map((notification) => {
                    const Icon = notification.icon
                    return (
                      <div
                        key={notification.id}
                        className={`flex p-4 rounded-lg border-l-4 transition-all cursor-pointer hover:bg-gray-50 ${
                          notification.isUnread 
                            ? 'bg-purple-50/50 border-l-purple-600' 
                            : 'border-l-transparent'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">{notification.title}</div>
                          <div className="text-gray-600 text-sm mb-2 leading-relaxed">{notification.description}</div>
                          <div className="text-xs text-gray-500">{notification.time}</div>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleNotificationRead(notification.id)}
                            className="text-gray-500 hover:text-purple-600 text-xs"
                          >
                            {notification.isUnread ? 'Mark as read' : 'Mark as unread'}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notification Summary */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Notification Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simple Chart */}
                <div className="h-32 flex items-end gap-2 mb-4">
                  {[80, 60, 90, 40, 70, 50, 85].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-purple-200 to-purple-400 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                
                {/* Summary Stats */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membership Updates</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Notifications</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">System Alerts</span>
                    <span className="font-semibold">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Alerts</span>
                    <span className="font-semibold">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NotificationsPage