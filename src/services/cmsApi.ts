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
  content: string;
  date: string;
  image?: any;
}

const api = axios.create({ 
  baseURL: CMS_API_URL, 
  headers: defaultHeaders,
});

/**
 * UTILITY: Resolves image URLs based on environment
 */
const getImageUrl = (url: string | undefined): string => {
  if (!url) return '/images/placeholder.jpg';
  // If the URL is already absolute (starts with http), return it
  if (url.startsWith('http')) return url;
  // Otherwise, prepend the configured CMS base URL
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
export const getNews = async () => {
  const res = await api.get('/news-items', {
    params: {
      populate: '*',
      sort: 'createdAt:desc'
    }
  });

  return res.data.data.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    ...item,
    image: getImageUrl(item.image?.url)
  }));
};

export const createNews = async (payload: any) => {
  return api.post('/news-items', { data: payload });
};

export const updateNews = async (id: number, payload: any) => {
  return api.put(`/news-items/${id}`, { data: payload });
};

export const deleteNews = async (id: number) => {
  return api.delete(`/news-items/${id}`);
};

/**
 * EVENTS
 */
export const getEvents = async (): Promise<Event[]> => {
  try {
    const res = await api.get('/events', { 
      params: { populate: '*' } 
    });

    return (res.data.data || []).map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      description: item.description,
      date: item.date,
      time: item.time,
      location: item.location,
      registrationLink: item.registrationLink,
      cpdPoints: item.cpdPoints,
      isFeatured: item.isFeatured,
      
      isPaid: item.isPaid,
      memberPrice: item.memberPrice,
      nonMemberPrice: item.nonMemberPrice,
      image: getImageUrl(item.image?.url),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
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
