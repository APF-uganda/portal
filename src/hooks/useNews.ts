import { useEffect, useState } from "react";

import { CMS_BASE_URL } from "../config/api";
import api from "../services/cmsApi";

const DEFAULT_NEWS_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80";
const NEWS_ENDPOINTS = ["/news-articles?populate=*", "/news-items?populate=*"];

interface StrapiEntity {
  id?: number | string;
  documentId?: string;
  attributes?: Record<string, any>;
  [key: string]: any;
}

export interface NewsItem {
  id: number | string;
  documentId?: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  isTopPick: boolean;
  image: string;
}

const toAbsoluteUrl = (url?: string) => {
  if (!url) return DEFAULT_NEWS_IMAGE;
  return url.startsWith("http") ? url : `${CMS_BASE_URL}${url}`;
};

const getImageUrl = (data: Record<string, any>) => {
  return (
    data.image?.url ||
    data.image?.data?.attributes?.url ||
    data.image?.data?.url ||
    data.image?.[0]?.url ||
    data.image?.data?.[0]?.attributes?.url ||
    data.image?.data?.[0]?.url
  );
};

const normalizeNewsItem = (item: StrapiEntity): NewsItem => {
  const data = item?.attributes ?? item ?? {};

  return {
    id: item?.id ?? data?.id ?? "",
    documentId: item?.documentId ?? data?.documentId,
    title: data.title || "Untitled Article",
    summary: data.summary || data.description || data.excerpt || "",
    category: data.category || "General News",
    date: data.publishDate || data.publishedAt || data.createdAt || "",
    readTime: data.readTime ? `${data.readTime} min read` : "5 min read",
    isTopPick: Boolean(data.isTopPick ?? data.isTopic ?? data.isFeatured),
    image: toAbsoluteUrl(getImageUrl(data)),
  };
};

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        let rows: StrapiEntity[] = [];
        let lastError: unknown = null;

        for (const endpoint of NEWS_ENDPOINTS) {
          try {
            const res = await api.get(endpoint);
            const payload = res?.data?.data;

            if (Array.isArray(payload)) {
              rows = payload;
              break;
            }
          } catch (err) {
            lastError = err;
          }
        }

        if (!rows.length && lastError) {
          throw lastError;
        }

        setNews(rows.map(normalizeNewsItem));
        setError(null);
      } catch (err) {
        console.error("FAILED to fetch news:", err);
        setNews([]);
        setError("Failed to fetch news articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error };
};
