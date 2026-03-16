import { useState, useEffect } from 'react';
import api from '../services/cmsApi';
import { CMS_BASE_URL } from '../config/api';

export const useNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
       
        const res = await api.get('/news-articles?populate[featuredImage]=*&populate[content]=*&populate[image]=*'); 

        const formattedData = res.data.data.map((item: any) => {
         
          const data = item.attributes ? item.attributes : item;
         
         
          const imgObj = data.featuredImage?.data?.attributes || data.featuredImage || data.image?.data?.attributes || data.image;
          
          const relativeUrl = imgObj?.url || (Array.isArray(imgObj) ? imgObj[0]?.url : null);

          return {
            id: item.id,
            documentId: item.documentId,
            title: data.title || "Untitled Article",
            
            
            content: data.content || data.body || [], 
            
            // Summary for list views
            summary: data.description || data.summary || "", 
            description: data.description || "", 
            
            category: data.category || "General News",
            date: data.publishDate || data.createdAt,
            
           
            readTime: data.readTime || "5", 
            
            isTopPick: !!data.isTopic || !!data.isFeatured || !!data.isTopPick, 
           
            // Final Image Path Construction
            image: relativeUrl 
              ? (relativeUrl.startsWith('http') ? relativeUrl : `${CMS_BASE_URL}${relativeUrl}`) 
              : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
          };
        });

        console.log("SUCCESS! Fully Populated News:", formattedData); 
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