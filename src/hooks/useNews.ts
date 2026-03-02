import { useState, useEffect } from 'react';
import api from '../services/cmsApi';

export const useNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        
        const res = await api.get('/news-articles?populate=*'); 
        const formattedData = res.data.data.map((item: any) => ({
          id: item.id,
          ...item.attributes,
        
          image: item.attributes.image?.data?.attributes?.url || null
        }));
        setNews(formattedData);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return { news, loading };
};