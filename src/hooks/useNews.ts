import { useState, useEffect } from 'react';
import { getCachedNewsSync, getNews } from '../services/cmsApi';

export const useNews = () => {
  const [news, setNews] = useState<any[]>(() => getCachedNewsSync());
  const [loading, setLoading] = useState(() => getCachedNewsSync().length === 0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        
        
        const organizedNews = (data || []).sort((a: any, b: any) => {
          //  sort ICPAU articles first
          const aIsIcpau = a.author === 'ICPAU' ? 1 : 0;
          const bIsIcpau = b.author === 'ICPAU' ? 1 : 0;

          // sorting
          if (aIsIcpau !== bIsIcpau) {
            return bIsIcpau - aIsIcpau; 
          }

          const dateA = new Date(a.publishDate || 0).getTime();
          const dateB = new Date(b.publishDate || 0).getTime();
          return dateB - dateA;
        });

        setNews(organizedNews);
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