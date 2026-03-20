import { useState, useEffect } from 'react';
import api from '../services/cmsApi';
import { CMS_BASE_URL } from '../config/api';

export const useNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatArticle = (item: any) => {
    const data = item.attributes ? item.attributes : item;
    
    // IMAGE LOGIC 
    const rawImg = data.featuredImage?.data || data.featuredImage;
    const imgObj = Array.isArray(rawImg) ? rawImg[0] : rawImg;
    const imgAttr = imgObj?.attributes || imgObj;
    const relativeUrl = imgAttr?.url || imgAttr?.formats?.medium?.url;

    // CONTENT LOGIC
    const articleContent = data.content || data.contentBlocks || [];

    return {
      id: item.id,
      documentId: item.documentId || item.id,
      title: data.title || "Untitled Article",
      content: articleContent, 
      description: data.description || "", 
      category: data.news?.data?.attributes?.name || data.category || "General",
      date: data.publishDate || data.createdAt,
      readTime: data.readTime || "5", 
      isFeatured: !!data.isFeatured, 
      image: relativeUrl 
        ? (relativeUrl.startsWith('http') ? relativeUrl : `${CMS_BASE_URL}${relativeUrl}`) 
        : "/images/Hero.jpg" 
    };
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
       
        const res = await api.get('/news-articles?populate=*&sort=createdAt:desc'); 
        const formattedData = res.data.data.map(formatArticle);
        setNews(formattedData);
      } catch (err) {
        console.error("FAILED to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return { news, loading, formatArticle }; 
};