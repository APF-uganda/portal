import { useState, useEffect, useCallback } from "react";
import { CMS_BASE_URL } from "../config/api";
import api, { getEvents, getHomepage, getNews } from "../services/cmsApi";

// Simple in-memory cache to avoid redundant CMS fetches within the same session
const cache: Record<string, { data: any; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache[key];
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data as T;
  const data = await fetcher();
  cache[key] = { data, ts: Date.now() };
  return data;
}

export const useEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cachedFetch('events', getEvents);
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
      const data = await cachedFetch('news', getNews);
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
      const homeData = await cachedFetch('homepage', getHomepage);
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
/**
 * Hook for fetching a SINGLE News Article by ID
 * ensure content blocks (images/videos) are formatted correctly
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
        
        //  Fetch the specific article with full population
       
        const res = await api.get(`/news-articles/${id}?populate=*`);
        const rawData = res.data.data;

        if (rawData) {
          //  Reuse formatting logic 
          const data = rawData.attributes || rawData;
          const rawImg = data.featuredImage?.data || data.featuredImage;
          const imgObj = Array.isArray(rawImg) ? rawImg[0] : rawImg;
          const imgUrl = imgObj?.attributes?.url || imgObj?.url;

          setArticle({
            id: rawData.id,
            ...data,
            // Ensure Image URL is absolute
            image: imgUrl 
              ? (imgUrl.startsWith('http') ? imgUrl : `${CMS_BASE_URL}${imgUrl}`) 
              : "/images/Hero.jpg",
            // Ensure content stays as the original array of blocks
            content: data.content || data.contentBlocks || []
          });

          // Fetch related articles for the sidebar
          const othersRes = await api.get(`/news-articles?filters[id][$ne]=${rawData.id}&pagination[limit]=3&populate=*`);
          const formattedOthers = othersRes.data.data.map((item: any) => {
             const d = item.attributes || item;
             return { id: item.id, title: d.title, image: d.featuredImage?.url };
          });
          setOtherArticles(formattedOthers);
          
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Detail Fetch Error:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { article, otherArticles, loading, error };
};