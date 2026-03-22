import { useState, useEffect } from 'react'
import { Lock, Save } from 'lucide-react'
import { useToast } from '../../../hooks/useToast'
import { useProfile } from '../../../hooks/useProfile'
import { PrivacySettings } from '../../../services/profileApi'

export function PrivacySecuritySettings() {
  const { toast } = useToast()
  const { profile, loading, updatePrivacy } = useProfile()
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'members_only',
    show_email: false,
    show_phone: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setSettings({
        profile_visibility: profile.profile_visibility ?? 'members_only',
        show_email: profile.show_email ?? false,
        show_phone: profile.show_phone ?? false,
      })
    }
  }, [profile])

  const handleToggle = (key: 'show_email' | 'show_phone') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const success = await updatePrivacy(settings)
    setIsSaving(false)

    if (success) {
      toast({ title: 'Privacy settings saved', description: 'Your privacy preferences have been updated.' })
    } else {
      toast({ title: 'Error', description: 'Failed to save privacy settings. Please try again.', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
          <Lock className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
        </div>
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <Lock className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
      </div>

      <div className="space-y-3">
        {/* Profile Visibility */}
        <div className="py-2.5 border-b border-gray-50">
          <p className="text-sm font-medium text-gray-900 mb-1.5">Profile Visibility</p>
          <p className="text-xs text-gray-500 mb-2">Control who can view your profile</p>
          <select
            value={settings.profile_visibility}
            onChange={(e) => setSettings(prev => ({ ...prev, profile_visibility: e.target.value }))}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="public">Public — anyone can view</option>
            <option value="members_only">Members Only</option>
            <option value="private">Private — only you</option>
          </select>
        </div>

        {/* Show Email */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Show Email on Profile</p>
            <p className="text-xs text-gray-500 mt-0.5">Allow other members to see your email address</p>
          </div>
          <button
            onClick={() => handleToggle('show_email')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              settings.show_email ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.show_email ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Show Phone */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Show Phone on Profile</p>
            <p className="text-xs text-gray-500 mt-0.5">Allow other members to see your phone number</p>
          </div>
          <button
            onClick={() => handleToggle('show_phone')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              settings.show_phone ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.show_phone ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* 2FA — coming soon */}
        <div className="flex items-center justify-between py-2.5 opacity-60">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Coming Soon</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
          </div>
          <button disabled className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-not-allowed">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
          </button>
        </div>

        <div className="pt-3 border-t border-gray-100 mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            For password changes, visit your{' '}
            <a href="/profile" className="underline hover:text-blue-900">Profile page</a> and go to the Security tab.
          </p>
        </div>
      </div>
    </div>
  )
}
