import { useState, useEffect, useCallback } from "react";

import api, { getEvents, getHomepage, getNews } from "../services/cmsApi";


export const useEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error("Fetch Events Error:", err);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return { events, loading, error, refresh: fetchEvents };
};

/**
 * Hook for fetching all News Items
 */
export const useNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNews();
      setNews(data || []); 
    } catch (err) {
      console.error("Fetch News Error:", err);
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  return { news, loading, error, refresh: fetchNews };
};

/**
 * Hook for fetching Homepage 
 */
export const useHomepage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHome = useCallback(async () => {
    try {
      setLoading(true);
      const homeData = await getHomepage();
      setData(homeData);
    } catch (err) {
      console.error("Home Fetch Error:", err);
      setError("Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHome(); }, [fetchHome]);

  return { data, loading, error, refresh: fetchHome };
};