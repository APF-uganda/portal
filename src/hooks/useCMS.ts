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
/**
 * Hook for fetching a SINGLE News Article by ID
 */
export const useNewsArticle = (id: string | undefined) => {
  const [article, setArticle] = useState<any>(null);
  const [otherArticles, setOtherArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
       
        const allNews = await getNews();
        
      
        const found = allNews.find((item: any) => 
          (item.documentId === id || item.id?.toString() === id)
        );

        if (found) {
          setArticle(found);
          
          setOtherArticles(allNews.filter((item: any) => 
            (item.documentId !== id && item.id?.toString() !== id)
          ).slice(0, 3));
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { article, otherArticles, loading, error };
};