
import { useState, useEffect } from 'react';
import { ActionButton } from './ui'; 
import { UserProfile, NotificationPreferences } from '../../services/profileApi';

interface ToggleProps {
  label: string;
  sub: string;
  active: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ label, sub, active, onChange, disabled = false }: ToggleProps) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
    <button
      onClick={() => !disabled && onChange(!active)}
      disabled={disabled}
      className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        active ? 'bg-[#5C32A3]' : 'bg-gray-200'
      }`}
    >
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`}></div>
    </button>
  </div>
);

interface NotificationPrefsProps {
  profile: UserProfile | null;
  onUpdate: (preferences: NotificationPreferences) => Promise<boolean>;
  updating?: boolean;
}

export const NotificationPrefs: React.FC<NotificationPrefsProps> = ({ 
  profile, 
  onUpdate, 
  updating = false 
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: false,
    sms_notifications: false,
    newsletter_subscription: false,
    event_notifications: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Update preferences when profile changes
  useEffect(() => {
    if (profile) {
      const newPreferences = {
        email_notifications: profile.email_notifications || false,
        sms_notifications: profile.sms_notifications || false,
        newsletter_subscription: profile.newsletter_subscription || false,
        event_notifications: profile.event_notifications || false,
      };
      setPreferences(newPreferences);
      setHasChanges(false);
    }
  }, [profile]);

  const handleToggleChange = (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    // Check if there are changes
    if (profile) {
      const originalPreferences = {
        email_notifications: profile.email_notifications || false,
        sms_notifications: profile.sms_notifications || false,
        newsletter_subscription: profile.newsletter_subscription || false,
        event_notifications: profile.event_notifications || false,
      };
      
      const hasChanges = Object.keys(newPreferences).some(
        key => newPreferences[key as keyof NotificationPreferences] !== originalPreferences[key as keyof NotificationPreferences]
      );
      setHasChanges(hasChanges);
    }
  };

  const handleSubmit = async () => {
    if (!hasChanges || updating) return;

    const success = await onUpdate(preferences);
    if (success) {
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    if (profile) {
      setPreferences({
        email_notifications: profile.email_notifications || false,
        sms_notifications: profile.sms_notifications || false,
        newsletter_subscription: profile.newsletter_subscription || false,
        event_notifications: profile.event_notifications || false,
      });
      setHasChanges(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100 mt-4 md:mt-6">
      <div className="border-l-4 border-[#5C32A3] pl-3 md:pl-4 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Notification Preferences</h2>
        <p className="text-xs md:text-sm text-gray-400">Choose how and when you receive updates.</p>
      </div>

      <div className="space-y-2 mb-6 md:mb-8">
        <Toggle 
          label="Email Notifications" 
          sub="Receive important updates and announcements via email." 
          active={preferences.email_notifications}
          onChange={(value) => handleToggleChange('email_notifications', value)}
          disabled={updating}
        />
        <Toggle 
          label="SMS Notifications" 
          sub="Get critical alerts and reminders directly to your mobile." 
          active={preferences.sms_notifications}
          onChange={(value) => handleToggleChange('sms_notifications', value)}
          disabled={updating}
        />
        <Toggle 
          label="Newsletter Subscription" 
          sub="Stay updated with our monthly newsletter and industry insights." 
          active={preferences.newsletter_subscription}
          onChange={(value) => handleToggleChange('newsletter_subscription', value)}
          disabled={updating}
        />
        <Toggle 
          label="Event Notifications" 
          sub="Get notified about upcoming events, webinars, and training sessions." 
          active={preferences.event_notifications}
          onChange={(value) => handleToggleChange('event_notifications', value)}
          disabled={updating}
        />
      </div>

      <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
        <p className="text-xs font-bold text-[#5C32A3] mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-wider">
          📧 Email Delivery Settings
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Delivery Frequency</p>
              <p className="text-xs text-gray-500">How often you receive email notifications</p>
            </div>
            <select 
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#5C32A3] disabled:opacity-50"
              disabled={!preferences.email_notifications || updating}
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Quiet Hours</p>
              <p className="text-xs text-gray-500">No notifications during these hours</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="time" 
                defaultValue="22:00"
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#5C32A3] disabled:opacity-50"
                disabled={!preferences.email_notifications || updating}
              />
              <span className="text-xs text-gray-500">to</span>
              <input 
                type="time" 
                defaultValue="08:00"
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#5C32A3] disabled:opacity-50"
                disabled={!preferences.email_notifications || updating}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
        <ActionButton 
          text={updating ? "Saving..." : "Update Preferences"} 
          disabled={!hasChanges || updating}
          onClick={handleSubmit}
        />
        {hasChanges && (
          <button
            onClick={handleReset}
            disabled={updating}
            className="px-4 md:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            Reset Changes
          </button>
        )}
      </div>
    </section>
  );
};