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
          //  Handles both nested attributes and direct properties
          const getAuthor = (item: any) => {
            const author = item.attributes?.author || item.author;
            return typeof author === 'string' ? author.trim().toUpperCase() : '';
          };

          const authorA = getAuthor(a);
          const authorB = getAuthor(b);

          const aIsIcpau = authorA === 'ICPAU' ? 1 : 0;
          const bIsIcpau = authorB === 'ICPAU' ? 1 : 0;

          // Primary Sort ICPAU  
          if (aIsIcpau !== bIsIcpau) {
            return bIsIcpau - aIsIcpau; 
          }

          //  Date descending 
          const getDate = (item: any) => {
             const d = item.attributes?.publishDate || item.publishDate || 0;
             return new Date(d).getTime();
          };

          return getDate(b) - getDate(a);
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