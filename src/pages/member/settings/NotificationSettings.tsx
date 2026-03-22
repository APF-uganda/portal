import { useState, useEffect } from 'react'
import { Bell, Save, Mail, MessageSquare } from 'lucide-react'
import { useToast } from '../../../hooks/useToast'
import { useProfile } from '../../../hooks/useProfile'
import { getAccessToken } from '../../../utils/authStorage'
import { API_V1_BASE_URL } from '../../../config/api'

interface NotificationPreferences {
  // Profile-based preferences
  email_notifications: boolean
  sms_notifications: boolean
  newsletter_subscription: boolean
  event_notifications: boolean

  // User model forum preferences
  email_notifications_enabled: boolean
  email_new_posts: boolean
  email_new_comments: boolean
  email_post_replies: boolean
  email_digest_frequency: 'none' | 'daily' | 'weekly'
}

export function NotificationSettings() {
  const { toast } = useToast()
  const { loading } = useProfile()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    sms_notifications: false,
    newsletter_subscription: true,
    event_notifications: true,
    email_notifications_enabled: true,
    email_new_posts: true,
    email_new_comments: true,
    email_post_replies: true,
    email_digest_frequency: 'weekly',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const token = getAccessToken()
        const [profileRes, userRes] = await Promise.all([
          fetch(`${API_V1_BASE_URL}/profiles/notification-preferences/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_V1_BASE_URL}/auth/profile/notification-preferences/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setPreferences(prev => ({
            ...prev,
            email_notifications: profileData.email_notifications ?? true,
            sms_notifications: profileData.sms_notifications ?? false,
            newsletter_subscription: profileData.newsletter_subscription ?? true,
            event_notifications: profileData.event_notifications ?? true,
          }))
        }

        if (userRes.ok) {
          const userData = await userRes.json()
          setPreferences(prev => ({
            ...prev,
            email_notifications_enabled: userData.email_notifications_enabled ?? true,
            email_new_posts: userData.email_new_posts ?? true,
            email_new_comments: userData.email_new_comments ?? true,
            email_post_replies: userData.email_post_replies ?? true,
            email_digest_frequency: userData.email_digest_frequency ?? 'weekly',
          }))
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error)
      }
    }
    loadPreferences()
  }, [])

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = getAccessToken()
      const profilePrefs = {
        email_notifications: preferences.email_notifications,
        sms_notifications: preferences.sms_notifications,
        newsletter_subscription: preferences.newsletter_subscription,
        event_notifications: preferences.event_notifications,
      }
      const userPrefs = {
        email_notifications_enabled: preferences.email_notifications_enabled,
        email_new_posts: preferences.email_new_posts,
        email_new_comments: preferences.email_new_comments,
        email_post_replies: preferences.email_post_replies,
        email_digest_frequency: preferences.email_digest_frequency,
      }

      const [profileRes, userRes] = await Promise.all([
        fetch(`${API_V1_BASE_URL}/profiles/notification-preferences/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(profilePrefs)
        }),
        fetch(`${API_V1_BASE_URL}/auth/profile/notification-preferences/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(userPrefs)
        })
      ])

      if (!profileRes.ok || !userRes.ok) throw new Error('Failed to save notification preferences')

      toast({ title: 'Preferences saved', description: 'Your notification preferences have been updated.' })
    } catch (error) {
      console.error('Error saving notification preferences:', error)
      toast({ title: 'Error', description: 'Failed to save notification preferences. Please try again.', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
          <Bell className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        </div>
        <p className="text-sm text-gray-500">Loading preferences...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <Bell className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
      </div>

      <div className="space-y-4">
        {/* General Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-700">General Notifications</h3>
          </div>
          <div className="space-y-2 pl-6">
            <ToggleItem label="Email Notifications" description="Receive general notifications via email" checked={preferences.email_notifications} onChange={() => handleToggle('email_notifications')} />
            <ToggleItem label="SMS Notifications" description="Receive notifications via SMS (requires phone number)" checked={preferences.sms_notifications} onChange={() => handleToggle('sms_notifications')} />
            <ToggleItem label="Newsletter Subscription" description="Receive newsletters and updates about APF" checked={preferences.newsletter_subscription} onChange={() => handleToggle('newsletter_subscription')} />
            <ToggleItem label="Event Notifications" description="Get notified about upcoming events and webinars" checked={preferences.event_notifications} onChange={() => handleToggle('event_notifications')} />
          </div>
        </div>

        {/* Forum Notifications */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-700">Community Forum Notifications</h3>
          </div>
          <div className="space-y-2 pl-6">
            <ToggleItem label="Forum Email Notifications" description="Master toggle for all forum-related email notifications" checked={preferences.email_notifications_enabled} onChange={() => handleToggle('email_notifications_enabled')} />
            <ToggleItem label="New Posts" description="Get notified when new posts are created in the forum" checked={preferences.email_new_posts} onChange={() => handleToggle('email_new_posts')} disabled={!preferences.email_notifications_enabled} />
            <ToggleItem label="New Comments" description="Get notified when someone comments on posts you participate in" checked={preferences.email_new_comments} onChange={() => handleToggle('email_new_comments')} disabled={!preferences.email_notifications_enabled} />
            <ToggleItem label="Post Replies" description="Get notified when someone replies to your posts" checked={preferences.email_post_replies} onChange={() => handleToggle('email_post_replies')} disabled={!preferences.email_notifications_enabled} />

            <div className="py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Forum Digest Frequency</p>
                  <p className="text-xs text-gray-500 mt-0.5">How often to receive forum activity summaries</p>
                </div>
                <select
                  value={preferences.email_digest_frequency}
                  onChange={(e) => setPreferences(prev => ({ ...prev, email_digest_frequency: e.target.value as 'none' | 'daily' | 'weekly' }))}
                  disabled={!preferences.email_notifications_enabled}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface ToggleItemProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

function ToggleItem({ label, description, checked, onChange, disabled = false }: ToggleItemProps) {
  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed ${checked ? 'bg-purple-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
