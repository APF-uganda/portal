/**
 * Custom hook for analytics data management
 */

import { useState, useEffect } from 'react';
import { analyticsApi, ComprehensiveAnalytics, MembershipAnalytics, ApplicationAnalytics } from '../services/analyticsApi';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<ComprehensiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching comprehensive analytics...');
      const data = await analyticsApi.getComprehensiveAnalytics();
      console.log('Analytics data received:', data);
      setAnalytics(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to load analytics data';
      setError(errorMsg);
      console.error('Error fetching analytics:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const refetch = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refetch,
  };
};

export const useMembershipAnalytics = () => {
  const [analytics, setAnalytics] = useState<MembershipAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getMembershipAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load membership analytics');
      console.error('Error fetching membership analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export const useApplicationAnalytics = () => {
  const [analytics, setAnalytics] = useState<ApplicationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getApplicationAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load application analytics');
      console.error('Error fetching application analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};