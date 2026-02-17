/**
 * CMS API Service
 * Handles all requests to Strapi CMS for public content
 */

import { CMS_API_URL } from '../config/api';
import {
  adaptStrapiCollection,
  adaptStrapiSingle,
  extractMediaUrl,
  extractRelation,
  buildStrapiQuery,
} from './strapiAdapter';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  content?: string;
  date: string;
  time: string;
  location: string;
  image: string;
  registrationLink?: string;
  cpdPoints?: number;
  category?: string;
  isFeatured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  featuredImage: string;
  category: string;
  author?: string;
  publishDate: string;
  readTime: number;
  isTopPick: boolean;
  isFeatured: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Leadership {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio?: string;
  email?: string;
  linkedIn?: string;
  order: number;
  isActive: boolean;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  image: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

export interface Homepage {
  hero: {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
    overlayOpacity: number;
  };
  stats: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  chairMessage: {
    name: string;
    role: string;
    photo: string;
    message: string;
    fullMessage?: string;
  };
  connectingProfessionals?: {
    title?: string;
    content: string;
    image?: string;
    imagePosition: string;
  };
}

export interface AboutPage {
  hero: {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
  };
  history: string;
  vision: string;
  mission: string;
  objectives: Array<{
    text: string;
    icon?: string;
  }>;
}

export interface MembershipPage {
  hero: {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
  };
  introText?: string;
  processSteps: Array<{
    stepNumber?: number;
    title: string;
    description: string;
    icon?: string;
  }>;
  requirements?: string;
  callToAction: {
    title: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage?: string;
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  mapEmbedUrl?: string;
  officeHours?: string;
  socialMedia: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
}

export interface SiteSettings {
  siteName: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  footerText?: string;
  copyrightText?: string;
  socialMedia: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const transformEvent = (item: any): Event => {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    content: item.content,
    date: item.date,
    time: item.time,
    location: item.location,
    image: extractMediaUrl(item.image),
    registrationLink: item.registrationLink,
    cpdPoints: item.cpdPoints,
    category: item.category,
    isFeatured: item.isFeatured || false,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt,
  };
};

const transformNewsArticle = (item: any): NewsArticle => {
  const category = extractRelation(item.category);
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    content: item.content,
    featuredImage: extractMediaUrl(item.featuredImage),
    category: category?.name || '',
    author: item.author,
    publishDate: item.publishDate,
    readTime: item.readTime,
    isTopPick: item.isTopPick || false,
    isFeatured: item.isFeatured || false,
    tags: item.tags?.map((tag: any) => tag.name) || [],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt,
  };
};

const transformLeadership = (item: any): Leadership => {
  return {
    id: item.id,
    name: item.name,
    role: item.role,
    photo: extractMediaUrl(item.photo),
    bio: item.bio,
    email: item.email,
    linkedIn: item.linkedIn,
    order: item.order || 0,
    isActive: item.isActive !== false,
  };
};

const transformBenefit = (item: any): Benefit => {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    image: extractMediaUrl(item.image),
    icon: item.icon,
    order: item.order || 0,
    isActive: item.isActive !== false,
  };
};

const transformFAQ = (item: any): FAQ => {
  return {
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
    order: item.order || 0,
    isActive: item.isActive !== false,
  };
};

const transformPartner = (item: any): Partner => {
  return {
    id: item.id,
    name: item.name,
    logo: extractMediaUrl(item.logo),
    website: item.website,
    description: item.description,
    order: item.order || 0,
    isActive: item.isActive !== false,
  };
};

const transformTimelineEvent = (item: any): TimelineEvent => {
  return {
    id: item.id,
    year: item.year,
    title: item.title,
    description: item.description,
    image: extractMediaUrl(item.image),
    order: item.order || 0,
  };
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch all events
 */
export const getEvents = async (filters?: {
  isFeatured?: boolean;
  status?: string;
}): Promise<Event[]> => {
  try {
    const queryFilters: any = {};
    if (filters?.isFeatured !== undefined) {
      queryFilters['isFeatured[$eq]'] = filters.isFeatured;
    }
    if (filters?.status) {
      queryFilters['status[$eq]'] = filters.status;
    }

    const query = buildStrapiQuery({
      populate: '*',
      filters: queryFilters,
      sort: 'date:asc',
    });

    const response = await fetch(`${CMS_API_URL}/events${query}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    
    const data = await response.json();
    const events = adaptStrapiCollection(data);
    return events.map(transformEvent);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Fetch single event by slug
 */
export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  try {
    const query = buildStrapiQuery({
      populate: '*',
      filters: { 'slug[$eq]': slug },
    });

    const response = await fetch(`${CMS_API_URL}/events${query}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    
    const data = await response.json();
    const events = adaptStrapiCollection(data);
    return events.length > 0 ? transformEvent(events[0]) : null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

/**
 * Fetch all news articles
 */
export const getNewsArticles = async (filters?: {
  isFeatured?: boolean;
  isTopPick?: boolean;
  category?: string;
}): Promise<NewsArticle[]> => {
  try {
    const queryFilters: any = {};
    if (filters?.isFeatured !== undefined) {
      queryFilters['isFeatured[$eq]'] = filters.isFeatured;
    }
    if (filters?.isTopPick !== undefined) {
      queryFilters['isTopPick[$eq]'] = filters.isTopPick;
    }
    if (filters?.category) {
      queryFilters['category][slug][$eq]'] = filters.category;
    }

    const query = buildStrapiQuery({
      populate: ['featuredImage', 'category', 'tags'],
      filters: queryFilters,
      sort: 'publishDate:desc',
    });

    const response = await fetch(`${CMS_API_URL}/news-articles${query}`);
    if (!response.ok) throw new Error('Failed to fetch news articles');
    
    const data = await response.json();
    const articles = adaptStrapiCollection(data);
    return articles.map(transformNewsArticle);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
};

/**
 * Fetch single news article by slug
 */
export const getNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
  try {
    const query = buildStrapiQuery({
      populate: ['featuredImage', 'category', 'tags'],
      filters: { 'slug[$eq]': slug },
    });

    const response = await fetch(`${CMS_API_URL}/news-articles${query}`);
    if (!response.ok) throw new Error('Failed to fetch news article');
    
    const data = await response.json();
    const articles = adaptStrapiCollection(data);
    return articles.length > 0 ? transformNewsArticle(articles[0]) : null;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
};

/**
 * Fetch all leadership members
 */
export const getLeadership = async (): Promise<Leadership[]> => {
  try {
    const query = buildStrapiQuery({
      populate: '*',
      filters: { 'isActive[$eq]': true },
      sort: 'order:asc',
    });

    const response = await fetch(`${CMS_API_URL}/leaderships${query}`);
    if (!response.ok) throw new Error('Failed to fetch leadership');
    
    const data = await response.json();
    const leaders = adaptStrapiCollection(data);
    return leaders.map(transformLeadership);
  } catch (error) {
    console.error('Error fetching leadership:', error);
    return [];
  }
};

/**
 * Fetch all benefits
 */
export const getBenefits = async (): Promise<Benefit[]> => {
  try {
    const query = buildStrapiQuery({
      populate: '*',
      filters: { 'isActive[$eq]': true },
      sort: 'order:asc',
    });

    const response = await fetch(`${CMS_API_URL}/benefits${query}`);
    if (!response.ok) throw new Error('Failed to fetch benefits');
    
    const data = await response.json();
    const benefits = adaptStrapiCollection(data);
    return benefits.map(transformBenefit);
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return [];
  }
};

/**
 * Fetch all FAQs
 */
export const getFAQs = async (category?: string): Promise<FAQ[]> => {
  try {
    const queryFilters: any = { 'isActive[$eq]': true };
    if (category) {
      queryFilters['category[$eq]'] = category;
    }

    const query = buildStrapiQuery({
      filters: queryFilters,
      sort: 'order:asc',
    });

    const response = await fetch(`${CMS_API_URL}/faqs${query}`);
    if (!response.ok) throw new Error('Failed to fetch FAQs');
    
    const data = await response.json();
    return adaptStrapiCollection<FAQ>(data).map(transformFAQ);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
};

/**
 * Fetch all partners
 */
export const getPartners = async (): Promise<Partner[]> => {
  try {
    const query = buildStrapiQuery({
      populate: '*',
      filters: { 'isActive[$eq]': true },
      sort: 'order:asc',
    });

    const response = await fetch(`${CMS_API_URL}/partners${query}`);
    if (!response.ok) throw new Error('Failed to fetch partners');
    
    const data = await response.json();
    const partners = adaptStrapiCollection(data);
    return partners.map(transformPartner);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
};

/**
 * Fetch all timeline events
 */
export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  try {
    const query = buildStrapiQuery({
      populate: '*',
      sort: 'order:asc',
    });

    const response = await fetch(`${CMS_API_URL}/timeline-events${query}`);
    if (!response.ok) throw new Error('Failed to fetch timeline events');
    
    const data = await response.json();
    const events = adaptStrapiCollection(data);
    return events.map(transformTimelineEvent);
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    return [];
  }
};

/**
 * Fetch homepage content
 */
export const getHomepage = async (): Promise<Homepage | null> => {
  try {
    const query = buildStrapiQuery({
      populate: {
        hero: { populate: '*' },
        stats: { populate: '*' },
        chairMessage: { populate: '*' },
        connectingProfessionals: { populate: '*' },
      },
    });

    const response = await fetch(`${CMS_API_URL}/homepage${query}`);
    if (!response.ok) throw new Error('Failed to fetch homepage');
    
    const data = await response.json();
    const homepage = adaptStrapiSingle(data);
    
    if (!homepage) return null;

    // Transform nested components
    return {
      hero: {
        ...homepage.hero,
        backgroundImage: extractMediaUrl(homepage.hero?.backgroundImage),
      },
      stats: homepage.stats || [],
      chairMessage: {
        ...homepage.chairMessage,
        photo: extractMediaUrl(homepage.chairMessage?.photo),
      },
      connectingProfessionals: homepage.connectingProfessionals ? {
        ...homepage.connectingProfessionals,
        image: extractMediaUrl(homepage.connectingProfessionals?.image),
      } : undefined,
    };
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
};

/**
 * Fetch about page content
 */
export const getAboutPage = async (): Promise<AboutPage | null> => {
  try {
    const query = buildStrapiQuery({
      populate: {
        hero: { populate: '*' },
        objectives: { populate: '*' },
      },
    });

    const response = await fetch(`${CMS_API_URL}/about-page${query}`);
    if (!response.ok) throw new Error('Failed to fetch about page');
    
    const data = await response.json();
    const aboutPage = adaptStrapiSingle(data);
    
    if (!aboutPage) return null;

    return {
      hero: {
        ...aboutPage.hero,
        backgroundImage: extractMediaUrl(aboutPage.hero?.backgroundImage),
      },
      history: aboutPage.history || '',
      vision: aboutPage.vision || '',
      mission: aboutPage.mission || '',
      objectives: aboutPage.objectives || [],
    };
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
};

/**
 * Fetch membership page content
 */
export const getMembershipPage = async (): Promise<MembershipPage | null> => {
  try {
    const query = buildStrapiQuery({
      populate: {
        hero: { populate: '*' },
        processSteps: { populate: '*' },
        callToAction: { populate: '*' },
      },
    });

    const response = await fetch(`${CMS_API_URL}/membership-page${query}`);
    if (!response.ok) throw new Error('Failed to fetch membership page');
    
    const data = await response.json();
    const membershipPage = adaptStrapiSingle(data);
    
    if (!membershipPage) return null;

    return {
      hero: {
        ...membershipPage.hero,
        backgroundImage: extractMediaUrl(membershipPage.hero?.backgroundImage),
      },
      introText: membershipPage.introText,
      processSteps: membershipPage.processSteps || [],
      requirements: membershipPage.requirements,
      callToAction: {
        ...membershipPage.callToAction,
        backgroundImage: extractMediaUrl(membershipPage.callToAction?.backgroundImage),
      },
    };
  } catch (error) {
    console.error('Error fetching membership page:', error);
    return null;
  }
};

/**
 * Fetch contact info
 */
export const getContactInfo = async (): Promise<ContactInfo | null> => {
  try {
    const query = buildStrapiQuery({
      populate: '*',
    });

    const response = await fetch(`${CMS_API_URL}/contact-info${query}`);
    if (!response.ok) throw new Error('Failed to fetch contact info');
    
    const data = await response.json();
    return adaptStrapiSingle<ContactInfo>(data);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
};

/**
 * Fetch site settings
 */
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const query = buildStrapiQuery({
      populate: '*',
    });

    const response = await fetch(`${CMS_API_URL}/site-setting${query}`);
    if (!response.ok) throw new Error('Failed to fetch site settings');
    
    const data = await response.json();
    const settings = adaptStrapiSingle(data);
    
    if (!settings) return null;

    return {
      ...settings,
      logo: extractMediaUrl(settings.logo),
      favicon: extractMediaUrl(settings.favicon),
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
};
