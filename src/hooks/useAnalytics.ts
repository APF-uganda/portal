import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../services/analyticsApi';


interface AnalyticsState {
  membership: { 
    total_members: number; 
    growth: { labels: string[]; data: number[] } 
  };
  applications: { 
    total_applications: number; 
    status_breakdown: { labels: string[]; data: number[] } 
  };
  system: { 
    active_users_30d: number; 
    daily_activity: { labels: string[]; data: number[] } 
  };
  revenue: {
    total_revenue: number;
    growth_rate: number;
    payment_statistics: { [key: string]: number };
  };
  key_metrics?: {
    total_members: number;
    total_revenue: number;
    pending_payments: number;
    revenue_growth_rate: number;
  };
}

export const useAnalytics = (period: string = '30d') => {
  const [analytics, setAnalytics] = useState<AnalyticsState>({
    membership: { total_members: 0, growth: { labels: [], data: [] } },
    applications: { total_applications: 0, status_breakdown: { labels: [], data: [] } },
    system: { active_users_30d: 0, daily_activity: { labels: [], data: [] } },
    revenue: { total_revenue: 0, growth_rate: 0, payment_statistics: {} },
    key_metrics: { total_members: 0, total_revenue: 0, pending_payments: 0, revenue_growth_rate: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
     
      const results = await Promise.allSettled([
        analyticsApi.getDashboardSummary(period),
        analyticsApi.getApplicationStatusChart(period),
        analyticsApi.getDailyActivityChart('7d')
      ]);

      const [summaryRes, appsRes, systemRes] = results;
      const emptyChart = { labels: [], data: [] };

      const summaryData = summaryRes.status === 'fulfilled'
        ? summaryRes.value
        : {
            membership: { total_members: 0, growth: emptyChart },
            applications: { total_applications: 0, status_breakdown: emptyChart },
            system: { active_users_30d: 0, daily_activity: emptyChart },
            revenue: { total_revenue: 0, growth_rate: 0, payment_statistics: {} },
            key_metrics: { total_members: 0, total_revenue: 0, pending_payments: 0, revenue_growth_rate: 0 },
          };

      const applicationStatusChart = appsRes.status === 'fulfilled'
        ? appsRes.value
        : summaryData?.applications?.status_breakdown || emptyChart;

      const dailyActivityChart = systemRes.status === 'fulfilled'
        ? systemRes.value
        : summaryData?.system?.daily_activity || emptyChart;

      setAnalytics({
        membership: {
          total_members: summaryData?.membership?.total_members || 0,
          growth: summaryData?.membership?.growth || emptyChart,
        },

        applications: {
          total_applications: summaryData?.applications?.total_applications || 0,
          status_breakdown: applicationStatusChart,
        },

        system: {
          active_users_30d: summaryData?.system?.active_users_30d || 0,
          daily_activity: dailyActivityChart,
        },

        revenue: {
          total_revenue: summaryData?.revenue?.total_revenue || 0,
          growth_rate: summaryData?.revenue?.growth_rate || 0,
          payment_statistics: summaryData?.revenue?.payment_statistics || {},
        },

        key_metrics: {
          total_members: summaryData?.key_metrics?.total_members || 0,
          total_revenue: summaryData?.key_metrics?.total_revenue || 0,
          pending_payments: summaryData?.key_metrics?.pending_payments || 0,
          revenue_growth_rate: summaryData?.key_metrics?.revenue_growth_rate || 0,
        },
      });

      if (results.every(r => r.status === 'rejected')) {
        setError("Unable to connect to analytics services.");
      } else {
        setError(null);
      }
    } catch (err: any) {
      console.error("Critical Analytics Hook Error:", err);
      setError("A critical error occurred while fetching analytics.");
    } finally {
      setLoading(false);
    }
  }, [period]); 

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { analytics, loading, error, refresh: fetchAllData };
};
