import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, User, Clock, CheckCircle } from 'lucide-react';
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notifications.service';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'document' | 'user' | 'payment' | 'announcement' | 'membership' | 'security' | 'info' | 'success' | 'warning' | 'error';
  priority?: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
  metadata?: {
    userId?: string;
    documentType?: string;
    actionUrl?: string;
    [key: string]: any;
  };
}

const AdminNotificationsPage = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'membership'>('all');

  // Load notifications from API
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        // Transform the data to match our interface
        const transformedData: AdminNotification[] = data.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.metadata?.priority || 'medium',
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          metadata: notification.metadata
        }));
        setNotifications(transformedData);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        // Fallback to mock data for demo
        setNotifications([
          {
            id: '1',
            title: 'New Document Uploaded',
            message: 'A member has uploaded a new document for review.',
            type: 'system',
            priority: 'medium',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            metadata: {
              actionUrl: '/admin/manage-users'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'system':
        return notification.type === 'system';
      case 'membership':
        return notification.type === 'membership';
      default:
        return true;
    }
  });

  const handleNotificationClick = async (notification: AdminNotification) => {
    console.log('[Notification Click]', notification);
    console.log('[Action URL]', notification.metadata?.actionUrl);
    
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    
    // Navigate to action URL if available
    if (notification.metadata?.actionUrl) {
      console.log('[Navigating to]', notification.metadata.actionUrl);
      navigate(notification.metadata.actionUrl);
    } else {
      console.log('[No action URL found]');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
      case 'document':
        return <FileText className="w-4 md:w-5 h-4 md:h-5 text-blue-500" />;
      case 'user':
      case 'membership':
        return <User className="w-4 md:w-5 h-4 md:h-5 text-green-500" />;
      default:
        return <Bell className="w-4 md:w-5 h-4 md:h-5 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-[#4A1D72] bg-white';
      case 'medium':
        return 'border-l-[#4A1D72] bg-white ';
      case 'low':
        return 'border-l-[#4A1D72] bg-white ';
      default:
        return 'border-l-[#4A1D72] bg-white';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"} h-screen overflow-hidden flex flex-col w-full min-w-0`}>
        <Header 
          title="Admin Notifications" 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="flex-1 bg-[#F4F2FE] py-3 md:py-6 space-y-4 md:space-y-6 overflow-y-auto">
          <div className="w-full space-y-4 md:space-y-6 px-3 md:px-6">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-slate-800 tracking-tight">
                  Admin Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs md:text-sm px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-slate-500 mt-1 text-sm md:text-base">Stay updated with system activities and user actions.</p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#5E2590] text-white rounded-lg hover:bg-[#4a1d72] transition-colors text-sm md:text-base w-full sm:w-auto justify-center"
                >
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4" />
                  Mark All Read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-[20px] shadow-sm border border-[#4A1D72] p-4 md:p-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All', count: notifications.length },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
                  { key: 'membership', label: 'Membership', count: notifications.filter(n => n.type === 'membership').length },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-[#5E2590] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-[20px] shadow-sm border border-[gray-100] overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-8 md:py-12">
                  <div className="w-5 md:w-6 h-5 md:h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-500 text-sm md:text-base">Loading notifications...</span>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <Bell className="w-10 md:w-12 h-10 md:h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm md:text-base">No notifications found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 md:p-6 border-l-4 transition-colors hover:bg-gray-50 cursor-pointer ${
                        !notification.isRead ? getPriorityColor(notification.priority) : 'border-l-[#4A1D72] bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-sm md:text-base font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                                {notification.message}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(notification.createdAt)}
                                </div>
                                {notification.priority && (
                                  <span className="text-xs px-2 py-1 rounded-full border-2 bg-transparent loading-border border-[#4A1D72] text-[#4A1D72] w-fit">
                                    {notification.priority} priority
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="text-xs px-2 md:px-3 py-1 bg-white text-black rounded hover:bg-gray-200 transition-colors border border-gray-300"
                                >
                                  Mark Read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default AdminNotificationsPage;