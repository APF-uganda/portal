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
  readTime?: number;
}

const api = axios.create({ 
  baseURL: CMS_API_URL, 
  headers: defaultHeaders,
});

/**
 * UTILITY: Resolves image URLs based on environment
 */
const getImageUrl = (url: string | undefined): string => {
  if (!url) {
    console.log('No image URL provided, using fallback');
    return '/images/Hero.jpg'; // Use existing image as fallback
  }
  
  // If the URL is already absolute (starts with http), return it
  if (url.startsWith('http')) {
    console.log('Using absolute image URL:', url);
    return url;
  }
  
  // Otherwise, prepend the configured CMS base URL
  const fullUrl = `${CMS_BASE_URL}${url}`;
  console.log('Constructed image URL:', fullUrl);
  return fullUrl;
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
  try {
   
    const res = await api.get('/news-articles?populate=*&sort=createdAt:desc');

    if (!res.data || !res.data.data) return [];

    return res.data.data.map((item: any) => {
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
        isFeatured: !!(data.isFeatured || data.isTopic)
      };
    });
  } catch (error) {
    console.error("News Fetch Error:", error);
    return [];
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
  try {
    const res = await api.get('/events', { 
      params: { populate: '*' } 
    });

    return (res.data.data || []).map((item: any) => {
      // Handle both direct and nested attribute structures
      const data = item.attributes || item;
      
      // Better image URL extraction with debugging
      let imageUrl = '';
      if (data.image?.data?.attributes?.url) {
        imageUrl = data.image.data.attributes.url;
      } else if (data.image?.url) {
        imageUrl = data.image.url;
      }
      
      console.log('Event item image processing:', {
        title: data.title,
        rawImageData: data.image,
        extractedUrl: imageUrl,
        finalUrl: getImageUrl(imageUrl)
      });

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
