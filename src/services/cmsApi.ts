import axios from 'axios';
import { CMS_API_URL, CMS_BASE_URL } from '../config/api';

const ADMIN_TOKEN = (import.meta.env.VITE_CMS_ADMIN_TOKEN || '').trim();
const defaultHeaders = ADMIN_TOKEN
  ? { Authorization: `Bearer ${ADMIN_TOKEN}` }
  : undefined;

export interface Event {
  id: number;
  documentId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  cpdPoints: number;
  registrationLink: string;
  isFeatured: boolean;
  // NEW PAYMENT FIELDS
  isPaid: boolean;
  memberPrice: number;
  nonMemberPrice: number;
  image?: any;
}

export interface NewsArticle {
  id: number;
  documentId: string;
  title: string;
  content: any[]; 
  date: string;
  image?: string;
  description?: string;
  category?: string;
  readTime?: number | string;
  isFeatured?: boolean;
  isTopPick?: boolean;
}

const api = axios.create({ 
  baseURL: CMS_API_URL, 
  headers: defaultHeaders,
});


const getImageUrl = (url: string | undefined): string => {
  if (!url) {
    return '/images/Hero.jpg'; 
  }
  
 
  if (url.startsWith('http')) {
    return url;
  }
  

  return `${CMS_BASE_URL}${url}`;
};

/**
 * HOMEPAGE
 */
export const getHomepage = async () => {
  const res = await api.get('/homepage', {
    params: {
      populate: {
        hero: { populate: '*' },
        stats: { populate: '*' },
        chairMessage: { populate: '*' },
        connectingProfessionals: { populate: '*' },
        partnerlogo: { populate: '*' }
      }
    }
  }); 

  return res.data.data; 
};

export const updateHomepage = async (payload: any) => {
  return api.put('/homepage', { data: payload });
};

/**
 * NEWS
 */
const NEWS_CACHE_KEY = 'apf.news.cache.v1';
const NEWS_CACHE_TTL_MS = 5 * 60 * 1000;

type NewsCacheEntry = {
  timestamp: number;
  data: NewsArticle[];
};

let newsMemoryCache: NewsCacheEntry | null = null;
let newsInFlightPromise: Promise<NewsArticle[]> | null = null;
const EVENTS_CACHE_KEY = 'apf.events.cache.v1';
const EVENTS_CACHE_TTL_MS = 15 * 60 * 1000;

type EventsCacheEntry = {
  timestamp: number;
  data: Event[];
};

let eventsMemoryCache: EventsCacheEntry | null = null;
let eventsInFlightPromise: Promise<Event[]> | null = null;

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const readNewsCache = (): NewsArticle[] | null => {
  const now = Date.now();

  if (newsMemoryCache && now - newsMemoryCache.timestamp < NEWS_CACHE_TTL_MS) {
    return newsMemoryCache.data;
  }

  if (!canUseStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(NEWS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as NewsCacheEntry;
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
    if (now - parsed.timestamp >= NEWS_CACHE_TTL_MS) return null;

    newsMemoryCache = parsed;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeNewsCache = (data: NewsArticle[]) => {
  const payload: NewsCacheEntry = { timestamp: Date.now(), data };
  newsMemoryCache = payload;

  if (!canUseStorage()) return;

  try {
    window.sessionStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    
  }
};

const readEventsCache = (): Event[] | null => {
  const now = Date.now();

  if (eventsMemoryCache && now - eventsMemoryCache.timestamp < EVENTS_CACHE_TTL_MS) {
    return eventsMemoryCache.data;
  }

  if (!canUseStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(EVENTS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as EventsCacheEntry;
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
    if (now - parsed.timestamp >= EVENTS_CACHE_TTL_MS) return null;

    eventsMemoryCache = parsed;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeEventsCache = (data: Event[]) => {
  const payload: EventsCacheEntry = { timestamp: Date.now(), data };
  eventsMemoryCache = payload;

  if (!canUseStorage()) return;

  try {
    window.sessionStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(payload));
  } catch {

  }
};

export const getCachedNewsSync = (): NewsArticle[] => {
  return readNewsCache() || [];
};

export const getCachedEventsSync = (): Event[] => {
  return readEventsCache() || [];
};

const NEWS_QUERY_CANDIDATES = [

  'sort[0]=publishDate:desc&sort[1]=createdAt:desc&populate=featuredImage',

  'sort[0]=createdAt:desc&populate=featuredImage',

  'populate=deep&sort=createdAt:desc',
];

const EVENTS_QUERY_CANDIDATES = [
 
  'sort[0]=date:asc&pagination[pageSize]=100&fields[0]=title&fields[1]=description&fields[2]=date&fields[3]=time&fields[4]=location&fields[5]=registrationLink&fields[6]=cpdPoints&fields[7]=isFeatured&fields[8]=isPaid&fields[9]=memberPrice&fields[10]=nonMemberPrice&populate[image][fields][0]=url',
  
  'sort[0]=date:asc&pagination[pageSize]=100&populate=image',
  
  'populate=deep&pagination[pageSize]=100&sort=date:asc',
  'populate=deep&pagination[pageSize]=100',
];

const fetchNewsResponse = async () => {
  for (const query of NEWS_QUERY_CANDIDATES) {
    try {
      return await api.get(`/news-articles?${query}`);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 400) continue;
      throw error;
    }
  }

  throw new Error('Unable to fetch news with available query strategies');
};

const fetchEventsResponse = async () => {
  for (const query of EVENTS_QUERY_CANDIDATES) {
    try {
      return await api.get(`/events?${query}`);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 400) continue;
      throw error;
    }
  }

  throw new Error('Unable to fetch events with available query strategies');
};

export const getNews = async () => {
  const cached = readNewsCache();
  if (cached) return cached;

  if (newsInFlightPromise) return newsInFlightPromise;

  const request = (async () => {
    const res = await fetchNewsResponse();

    if (!res.data || !res.data.data) return [];

    const mappedNews: NewsArticle[] = res.data.data.map((item: any, index: number) => {
      const data = item.attributes || item;

      const rawImg = data.featuredImage?.data || data.featuredImage || data.image?.data || data.image;
      let imageUrl = '';
      if (rawImg) {
        const imgObj = Array.isArray(rawImg) ? rawImg[0] : rawImg;
        imageUrl = imgObj?.attributes?.url || imgObj?.url || '';
      }

      const articleContent = data.content || data.contentBlocks || [];

      return {
        id: item.id,
        documentId: item.documentId || item.id?.toString(),
        title: data.title || 'Untitled',
        content: articleContent,
        description: data.description || '',
        image: getImageUrl(imageUrl),
        category: data.news?.data?.attributes?.name || data.category || 'News',
        readTime: data.readTime || 5,
        date: data.publishDate || data.createdAt,
        isFeatured: !!(data.isFeatured || data.isTopic),
        isTopPick: index === 0 || !!(data.isTopPick || data.isFeatured || data.isTopic)
      };
    });

    writeNewsCache(mappedNews);
    return mappedNews;
  })();

  newsInFlightPromise = request;

  try {
    return await request;
  } catch (error) {
    console.error("News Fetch Error:", error);
    return [];
  } finally {
    if (newsInFlightPromise === request) {
      newsInFlightPromise = null;
    }
  }
};

export const createNews = async (payload: any) => {
  return api.post('/news-articles', { data: payload });
};

export const updateNews = async (id: number, payload: any) => {
  return api.put(`/news-articles/${id}`, { data: payload });
};

export const deleteNews = async (id: number) => {
  return api.delete(`/news-articles/${id}`);
};

/**
 * EVENTS
 */
export const getEvents = async (): Promise<Event[]> => {
  const cached = readEventsCache();
  if (cached) return cached;

  if (eventsInFlightPromise) return eventsInFlightPromise;

  const request = (async () => {
    const res = await fetchEventsResponse();

    const mappedEvents: Event[] = (res.data.data || []).map((item: any) => {
      // Handle both direct and nested attribute structures
      const data = item.attributes || item;

     
      let imageUrl = '';
      if (data.image?.data?.attributes?.url) {
        imageUrl = data.image.data.attributes.url;
      } else if (data.image?.url) {
        imageUrl = data.image.url;
      }

      return {
        id: item.id,
        documentId: item.documentId,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        time: data.time || '',
        location: data.location || '',
        registrationLink: data.registrationLink || '',
        cpdPoints: data.cpdPoints || 0,
        isFeatured: data.isFeatured || false,
        isPaid: data.isPaid || false,
        memberPrice: data.memberPrice || 0,
        
        nonMemberPrice: data.nonMemberPrice || 0,
        image: getImageUrl(imageUrl),
      };
    });

    writeEventsCache(mappedEvents);
    return mappedEvents;
  })();

  eventsInFlightPromise = request;

  try {
    return await request;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  } finally {
    if (eventsInFlightPromise === request) {
      eventsInFlightPromise = null;
    }
  }
};

export const createEvent = async (payload: any) => {
 
  const response = await api.post('/events', { 
    data: {
      ...payload,
      date: payload.date ? new Date(payload.date).toISOString() : null
    } 
  });
  return response.data.data; 
};

export default api;