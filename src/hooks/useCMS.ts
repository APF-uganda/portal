import { useState, useEffect, useCallback } from 'react';
import * as cmsApi from '../services/cmsApi';

/**
 * Hook to fetch the Homepage 
 */
export const useHomepage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await cmsApi.getHomepage();
      setData(result);
    } catch (err) {
      setError('Failed to fetch homepage');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};

/**
 * Hook to fetch News Items
 */
export const useNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cmsApi.getNews();
      setNews(data);
    } catch (err) {
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  return { news, loading, error, refresh: fetchNews };
};

/**
 * Hook to fetch Events
 */
export const useEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const rawData = await cmsApi.getEvents();
      
      // Personalization: Including all fields from Strapi and flattening attributes
      const flattened = rawData.map((item: any) => ({
        id: item.id,
        ...item.attributes, // Spreads all fields: title, date, location, cpdPoints, etc.
        image: item.attributes.image?.data?.attributes?.url 
          ? `http://localhost:1337${item.attributes.image.data.attributes.url}` 
          : '/images/placeholder.jpg'
      }));

      setEvents(flattened);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return { events, loading, error, refresh: fetchEvents };
};