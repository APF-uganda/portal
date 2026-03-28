import { useState, useEffect, useCallback } from "react";
import { CMS_BASE_URL } from "../config/api";
import api, { getCachedEventsSync, getCachedNewsSync, getEvents, getHomepage, getNews } from "../services/cmsApi";

const NEWS_ARTICLE_CACHE_PREFIX = 'apf.news.article.cache.';
const NEWS_ARTICLE_CACHE_TTL_MS = 10 * 60 * 1000;

type CachedArticle = {
  timestamp: number;
  data: any;
};

const articleMemoryCache = new Map<string, CachedArticle>();
const articleInFlightRequests = new Map<string, Promise<any | null>>();

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const readCachedArticle = (id: string) => {
  const now = Date.now();
  const memoryCached = articleMemoryCache.get(id);

  if (memoryCached && now - memoryCached.timestamp < NEWS_ARTICLE_CACHE_TTL_MS) {
    return memoryCached.data;
  }

  if (!canUseStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(`${NEWS_ARTICLE_CACHE_PREFIX}${id}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedArticle;
    if (!parsed?.timestamp || parsed?.data == null) return null;
    if (now - parsed.timestamp >= NEWS_ARTICLE_CACHE_TTL_MS) return null;

    articleMemoryCache.set(id, parsed);
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCachedArticle = (id: string, data: any) => {
  const payload: CachedArticle = { timestamp: Date.now(), data };
  articleMemoryCache.set(id, payload);

  if (!canUseStorage()) return;

  try {
    window.sessionStorage.setItem(`${NEWS_ARTICLE_CACHE_PREFIX}${id}`, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or browser privacy-mode errors.
  }
};

const fetchNewsArticleResponse = async (id: string) => {
  const encodedId = encodeURIComponent(id);
  const queryCandidates = [
    `/news-articles/${encodedId}?populate=featuredImage`,
    `/news-articles/${encodedId}?populate=deep`,
  ];

  for (const path of queryCandidates) {
    try {
      return await api.get(path);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 400) continue;
      throw error;
    }
  }

  throw new Error('Unable to fetch article with available query strategies');
};

const fetchNewsArticleById = async (id: string) => {
  const existingRequest = articleInFlightRequests.get(id);
  if (existingRequest) return existingRequest;

  const request = (async () => {
    const res = await fetchNewsArticleResponse(id);
    const rawData = res.data.data;
    if (!rawData) return null;

    const data = rawData.attributes || rawData;
    const rawImg = data.featuredImage?.data || data.featuredImage;
    const imgObj = Array.isArray(rawImg) ? rawImg[0] : rawImg;
    const imgUrl = imgObj?.attributes?.url || imgObj?.url;

    return {
      id: rawData.id,
      ...data,
      image: imgUrl
        ? (imgUrl.startsWith('http') ? imgUrl : `${CMS_BASE_URL}${imgUrl}`)
        : "/images/Hero.jpg",
      content: data.content || data.contentBlocks || []
    };
  })();

  articleInFlightRequests.set(id, request);

  try {
    return await request;
  } finally {
    articleInFlightRequests.delete(id);
  }
};

export const prefetchNewsArticle = async (targetId: string | number | undefined | null) => {
  if (!targetId) return;

  const id = String(targetId);
  if (!id || id.startsWith('fallback-')) return;

  const cachedArticle = readCachedArticle(id);
  if (cachedArticle) return;

  try {
    const article = await fetchNewsArticleById(id);
    if (article) {
      writeCachedArticle(id, article);
    }
  } catch {
    // Silent prefetch failure; detail page will handle errors explicitly.
  }
};

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
  const [events, setEvents] = useState<any[]>(() => getCachedEventsSync());
  const [loading, setLoading] = useState(() => getCachedEventsSync().length === 0);
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
  const [news, setNews] = useState<any[]>(() => getCachedNewsSync());
  const [loading, setLoading] = useState(() => getCachedNewsSync().length === 0);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    if (id.startsWith('fallback-')) {
      setArticle(null);
      setError('Article not found');
      setLoading(false);
      return;
    }

    const cachedArticle = readCachedArticle(id);
    if (cachedArticle) {
      setArticle(cachedArticle);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const formattedArticle = await fetchNewsArticleById(id);
        if (formattedArticle) {
          if (cancelled) return;
          setArticle(formattedArticle);
          writeCachedArticle(id, formattedArticle);
        } else {
          if (cancelled) return;
          setError("Article not found");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Detail Fetch Error:", err);
        setError("Failed to load article");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { article, loading, error };
};
