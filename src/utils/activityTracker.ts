/**
 * Local Activity Tracker
 * Provides immediate UI feedback for user actions until backend activity feed is fully implemented
 */

interface LocalActivity {
  id: string;
  action: string;
  message: string;
  timestamp: string;
}

const ACTIVITY_KEY = 'local_activities';
const MAX_ACTIVITIES = 10;

/**
 * Add a local activity entry
 */
export const addLocalActivity = (action: string, message: string): void => {
  try {
    const activities = getLocalActivities();
    
    const newActivity: LocalActivity = {
      id: `local_${Date.now()}`,
      action,
      message,
      timestamp: new Date().toISOString(),
    };
    
    // Add to beginning and limit to MAX_ACTIVITIES
    const updatedActivities = [newActivity, ...activities].slice(0, MAX_ACTIVITIES);
    
    sessionStorage.setItem(ACTIVITY_KEY, JSON.stringify(updatedActivities));
  } catch (error) {
    console.error('Failed to add local activity:', error);
  }
};

/**
 * Get local activities
 */
export const getLocalActivities = (): LocalActivity[] => {
  try {
    const stored = sessionStorage.getItem(ACTIVITY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get local activities:', error);
    return [];
  }
};

/**
 * Clear local activities (call when backend activities are loaded)
 */
export const clearLocalActivities = (): void => {
  try {
    sessionStorage.removeItem(ACTIVITY_KEY);
  } catch (error) {
    console.error('Failed to clear local activities:', error);
  }
};

/**
 * Merge local activities with backend activities
 */
export const mergeActivities = (backendActivities: any[]): any[] => {
  const localActivities = getLocalActivities();
  
  // Convert local activities to match backend format
  const formattedLocal = localActivities.map(activity => ({
    id: activity.id,
    action: activity.action,
    field_changed: '',
    timestamp: activity.timestamp,
    message: activity.message,
  }));
  
  // Merge and sort by timestamp
  const merged = [...formattedLocal, ...backendActivities];
  return merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};