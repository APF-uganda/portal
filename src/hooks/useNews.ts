import { useState, useEffect } from 'react';
import api from '../services/cmsApi';
import { CMS_BASE_URL } from '../config/api';

export const useNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
       
        const res = await api.get('/news-articles?populate=*'); 

        const formattedData = res.data.data.map((item: any) => {
          const data = item.attributes ? item.attributes : item;
         
          const relativeUrl = 
            data.image?.url || 
            data.image?.data?.attributes?.url || 
            data.image?.[0]?.url;

          return {
            id: item.id,
            documentId: item.documentId,
            title: data.title || "Untitled Article",
            
           
            summary: data.description || data.summary || "", 
            content: data.content || data.body || null, 
            description: data.description || "", 
           

            category: data.category || "General News",
            date: data.publishDate || data.createdAt,
            readTime: data.readTime ? `${data.readTime} min read` : "5 min read",
            isTopPick: !!data.isTopic || !!data.isFeatured, 
           
            image: relativeUrl 
              ? (relativeUrl.startsWith('http') ? relativeUrl : `${CMS_BASE_URL}${relativeUrl}`) 
              : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
          };
        });

        console.log("SUCCESS! Formatted News with Content:", formattedData); 
        setNews(formattedData);
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