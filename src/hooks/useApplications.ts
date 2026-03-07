import { useEffect, useState, useCallback } from "react";
import { Application } from "../types/Application";
import { fetchApplications } from "../services/applicationApi";

interface UseApplicationsReturn {
  applications: Application[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing applications list
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Handles only application data fetching
 * - Open/Closed: Can be extended without modification
 */
export const useApplications = (): UseApplicationsReturn => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchApplications(signal);
      if (!signal?.aborted) {
        setApplications(data);
      }
    } catch (err) {
      if (!signal?.aborted) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load applications';
        setError(errorMessage);
        console.error('Error fetching applications:', err);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    loadApplications(abortController.signal);
    
    return () => {
      abortController.abort();
    };
  }, [loadApplications]);

  return {
    applications,
    loading,
    error,
    refetch: () => loadApplications(),
  };
};