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
         
          // IMAGE LOGIC
          const rawImg = data.featuredImage?.data || data.featuredImage || data.image?.data || data.image;
          const imgObj = Array.isArray(rawImg) ? rawImg[0] : rawImg;
          const imgAttr = imgObj?.attributes || imgObj;
          
          const relativeUrl = imgAttr?.url || imgAttr?.formats?.medium?.url;

          //  CONTENT LOGIC
          const articleContent = data.contentBlocks || data.content || data.body || [];

          return {
            id: item.id,
            documentId: item.documentId,
            title: data.title || "Untitled Article",
            content: articleContent, 
            summary: data.description || data.summary || "", 
            category: data.category || "General News",
            date: data.publishDate || data.createdAt,
            readTime: data.readTime || "5", 
            isTopPick: !!data.isFeatured || !!data.isTopPick, 
            image: relativeUrl 
              ? (relativeUrl.startsWith('http') ? relativeUrl : `${CMS_BASE_URL}${relativeUrl}`) 
              : "/images/Hero.jpg" 
          };
        });

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