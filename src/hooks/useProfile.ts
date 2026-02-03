/**
 * Custom hook for profile management
 * Follows React best practices and provides a clean API for profile operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  ProfileUpdateData,
  PrivacySettings,
  NotificationPreferences,
  ProfileCompletionStatus,
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  removeProfilePicture,
  updatePrivacySettings,
  updateNotificationPreferences,
  getProfileCompletionStatus,
  validateProfilePicture,
  generateInitials
} from '../services/profileApi';

interface UseProfileReturn {
  // Profile data
  profile: UserProfile | null;
  completionStatus: ProfileCompletionStatus | null;
  
  // Loading states
  loading: boolean;
  updating: boolean;
  uploadingPicture: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  loadProfile: () => Promise<void>;
  refetchProfile: () => Promise<void>; // Alias for loadProfile
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  uploadPicture: (file: File) => Promise<boolean>;
  removePicture: () => Promise<boolean>;
  deletePicture: () => Promise<boolean>; // Alias for removePicture
  updatePrivacy: (settings: PrivacySettings) => Promise<boolean>;
  updateNotifications: (preferences: NotificationPreferences) => Promise<boolean>;
  updatePassword: (data: { current_password: string; new_password: string; confirm_password: string }) => Promise<boolean>;
  loadCompletionStatus: () => Promise<void>;
  clearError: () => void;
  
  // Additional loading states
  changingPassword: boolean;
  
  // Computed values
  displayName: string;
  initials: string;
  profilePictureUrl: string | null;
  isProfileComplete: boolean;
}

const PROFILE_STORAGE_KEY = 'user_profile';

const loadProfileFromStorage = (): UserProfile | null => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as UserProfile;
  } catch (error) {
    console.warn('Failed to parse stored profile data:', error);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return null;
  }
};

const saveProfileToStorage = (profile: UserProfile | null) => {
  if (!profile) {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return;
  }

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const useProfile = (): UseProfileReturn => {
  // State
  const [profile, setProfile] = useState<UserProfile | null>(loadProfileFromStorage);
  const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus | null>(null);
  const [loading, setLoading] = useState(!profile);
  const [updating, setUpdating] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profileData = await fetchUserProfile();
      setProfile(profileData);
      saveProfileToStorage(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load completion status
  const loadCompletionStatus = useCallback(async () => {
    try {
      const status = await getProfileCompletionStatus();
      setCompletionStatus(status);
    } catch (err) {
      console.error('Error loading completion status:', err);
      // Don't set error for completion status as it's not critical
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);
      
      const updatedProfile = await updateUserProfile(data);
      setProfile(updatedProfile);
      saveProfileToStorage(updatedProfile);
      
      // Reload completion status after update
      await loadCompletionStatus();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [loadCompletionStatus]);

  // Upload profile picture
  const uploadPicture = useCallback(async (file: File): Promise<boolean> => {
    try {
      // Validate file first
      const validationError = validateProfilePicture(file);
      if (validationError) {
        setError(validationError);
        return false;
      }

      setUploadingPicture(true);
      setError(null);
      
      const result = await uploadProfilePicture(file);
      
      // Update profile with new picture URL
      if (profile) {
        const nextProfile = {
          ...profile,
          profile_picture_url: result.profile_picture_url,
          initials: result.initials
        };
        setProfile(nextProfile);
        saveProfileToStorage(nextProfile);
      }
      
      // Reload completion status
      await loadCompletionStatus();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload picture';
      setError(errorMessage);
      console.error('Error uploading picture:', err);
      return false;
    } finally {
      setUploadingPicture(false);
    }
  }, [profile, loadCompletionStatus]);

  // Remove profile picture
  const removePicture = useCallback(async (): Promise<boolean> => {
    try {
      setUploadingPicture(true);
      setError(null);
      
      const result = await removeProfilePicture();
      
      // Update profile to remove picture
      if (profile) {
        const nextProfile = {
          ...profile,
          profile_picture_url: null,
          initials: result.initials
        };
        setProfile(nextProfile);
        saveProfileToStorage(nextProfile);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove picture';
      setError(errorMessage);
      console.error('Error removing picture:', err);
      return false;
    } finally {
      setUploadingPicture(false);
    }
  }, [profile]);

  // Update privacy settings
  const updatePrivacy = useCallback(async (settings: PrivacySettings): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);
      
      await updatePrivacySettings(settings);
      
      // Update local profile state
      if (profile) {
        const nextProfile = {
          ...profile,
          ...settings
        };
        setProfile(nextProfile);
        saveProfileToStorage(nextProfile);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update privacy settings';
      setError(errorMessage);
      console.error('Error updating privacy settings:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [profile]);

  // Update notification preferences
  const updateNotifications = useCallback(async (preferences: NotificationPreferences): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);
      
      await updateNotificationPreferences(preferences);
      
      // Update local profile state
      if (profile) {
        const nextProfile = {
          ...profile,
          ...preferences
        };
        setProfile(nextProfile);
        saveProfileToStorage(nextProfile);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notification preferences';
      setError(errorMessage);
      console.error('Error updating notification preferences:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [profile]);

  // Update password
  const updatePassword = useCallback(async (_data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<boolean> => {
    try {
      setChangingPassword(true);
      setError(null);
      
      // TODO: Implement password change API call
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      console.error('Error changing password:', err);
      return false;
    } finally {
      setChangingPassword(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Load completion status when profile is loaded
  useEffect(() => {
    if (profile) {
      loadCompletionStatus();
    }
  }, [profile, loadCompletionStatus]);

  // Computed values
  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'User';
  const initials = profile?.initials || generateInitials(
    profile?.first_name || '',
    profile?.last_name || '',
    profile?.email
  );
  const profilePictureUrl = profile?.profile_picture_url || null;
  const isProfileComplete = profile?.is_profile_complete || false;

  return {
    // Profile data
    profile,
    completionStatus,
    
    // Loading states
    loading,
    updating,
    uploadingPicture,
    changingPassword,
    
    // Error states
    error,
    
    // Actions
    loadProfile,
    refetchProfile: loadProfile, // Alias
    updateProfile,
    uploadPicture,
    removePicture,
    deletePicture: removePicture, // Alias
    updatePrivacy,
    updateNotifications,
    updatePassword,
    loadCompletionStatus,
    clearError,
    
    // Computed values
    displayName,
    initials,
    profilePictureUrl,
    isProfileComplete,
  };
};
