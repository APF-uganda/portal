/**
 * Notifications service - handles all notification-related API calls
 * Notifications are announcements sent by admins to members
 * 
 * Backend endpoint: GET /api/v1/notifications/announcements/
 */

import { announcementsApi, Announcement } from './announcementsApi'

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'membership'
  | 'payment'
  | 'system'
  | 'security'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string // ISO 8601 format
  metadata?: {
    category?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    actionUrl?: string
    [key: string]: any
  }
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
  urgent: number
  byType: {
    membership: number
    payment: number
    system: number
    security: number
  }
}

/**
 * Get all notifications (announcements) for the current user
 * @param _filter - Optional filter (all, unread, read, type)
 * @returns Promise with array of notifications
 */
export const getNotifications = async (_filter?: string): Promise<Notification[]> => {
  try {
    // Fetch announcements from backend
    const announcements = await announcementsApi.getAll({
      status: 'sent' // Only show sent announcements to members
    });

    // Transform announcements to notifications format
    return announcements.map((announcement: Announcement) => ({
      id: announcement.id.toString(),
      title: announcement.title,
      message: announcement.content,
      type: mapPriorityToType(announcement.priority),
      isRead: false, // TODO: Track read status when backend supports it
      createdAt: announcement.sent_at || announcement.created_at,
      metadata: {
        priority: announcement.priority,
        channel: announcement.channel,
        audience: announcement.audience
      }
    }));
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
}

/**
 * Map announcement priority to notification type
 */
function mapPriorityToType(priority: string): NotificationType {
  switch (priority) {
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'info';
    default:
      return 'info';
  }
}

/**
 * Get notification statistics
 * @returns Promise with notification stats
 */
export const getNotificationStats = async (): Promise<NotificationStats> => {
  try {
    const announcements = await announcementsApi.getAll({
      status: 'sent'
    });

    const total = announcements.length;
    const urgent = announcements.filter((a: Announcement) => a.priority === 'high').length;

    return {
      total,
      unread: total, // TODO: Calculate actual unread when backend supports it
      read: 0,
      urgent,
      byType: {
        membership: 0,
        payment: 0,
        system: total,
        security: 0
      }
    };
  } catch (error) {
    console.error('Failed to fetch notification stats:', error);
    return {
      total: 0,
      unread: 0,
      read: 0,
      urgent: 0,
      byType: {
        membership: 0,
        payment: 0,
        system: 0,
        security: 0
      }
    };
  }
}

/**
 * Mark a notification as read
 * @param _notificationId - ID of notification to mark as read
 * @returns Promise with success status
 */
export const markNotificationAsRead = async (_notificationId: string): Promise<boolean> => {
  // TODO: Implement when backend supports read tracking
  return true
}

/**
 * Mark all notifications as read
 * @returns Promise with success status
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  // TODO: Implement when backend supports read tracking
  return true
}

/**
 * Delete a notification
 * @param _notificationId - ID of notification to delete
 * @returns Promise with success status
 */
export const deleteNotification = async (_notificationId: string): Promise<boolean> => {
  // TODO: Implement when backend supports deletion
  return true
}
