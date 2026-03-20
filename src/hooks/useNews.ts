import { useState, useEffect } from 'react';
import { getCachedNewsSync, getNews } from '../services/cmsApi';

export const useNews = () => {
  const [news, setNews] = useState<any[]>(() => getCachedNewsSync());
  const [loading, setLoading] = useState(() => getCachedNewsSync().length === 0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNews(data || []);
      } catch (err) {
        console.error("FAILED to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return { news, loading };
};
