/**
 * Custom hooks for CMS data
 */

import { useState, useEffect } from 'react';
import * as cmsApi from '../services/cmsApi';

/**
 * Hook to fetch events from CMS
 */
export const useEvents = (filters?: { isFeatured?: boolean; status?: string }) => {
  const [events, setEvents] = useState<cmsApi.Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getEvents(filters);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters?.isFeatured, filters?.status]);

  return { events, loading, error };
};

/**
 * Hook to fetch news articles from CMS
 */
export const useNewsArticles = (filters?: {
  isFeatured?: boolean;
  isTopPick?: boolean;
  category?: string;
}) => {
  const [articles, setArticles] = useState<cmsApi.NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getNewsArticles(filters);
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filters?.isFeatured, filters?.isTopPick, filters?.category]);

  return { articles, loading, error };
};

/**
 * Hook to fetch leadership from CMS
 */
export const useLeadership = () => {
  const [leaders, setLeaders] = useState<cmsApi.Leadership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getLeadership();
        setLeaders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leadership');
      } finally {
        setLoading(false);
      }
    };

    fetchLeadership();
  }, []);

  return { leaders, loading, error };
};

/**
 * Hook to fetch benefits from CMS
 */
export const useBenefits = () => {
  const [benefits, setBenefits] = useState<cmsApi.Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getBenefits();
        setBenefits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch benefits');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  return { benefits, loading, error };
};

/**
 * Hook to fetch FAQs from CMS
 */
export const useFAQs = (category?: string) => {
  const [faqs, setFaqs] = useState<cmsApi.FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getFAQs(category);
        setFaqs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [category]);

  return { faqs, loading, error };
};

/**
 * Hook to fetch partners from CMS
 */
export const usePartners = () => {
  const [partners, setPartners] = useState<cmsApi.Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getPartners();
        setPartners(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch partners');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return { partners, loading, error };
};

/**
 * Hook to fetch timeline events from CMS
 */
export const useTimelineEvents = () => {
  const [events, setEvents] = useState<cmsApi.TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getTimelineEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch timeline events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

/**
 * Hook to fetch homepage content from CMS
 */
export const useHomepage = () => {
  const [homepage, setHomepage] = useState<cmsApi.Homepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getHomepage();
        setHomepage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch homepage');
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  return { homepage, loading, error };
};

/**
 * Hook to fetch about page content from CMS
 */
export const useAboutPage = () => {
  const [aboutPage, setAboutPage] = useState<cmsApi.AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getAboutPage();
        setAboutPage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch about page');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  return { aboutPage, loading, error };
};

/**
 * Hook to fetch membership page content from CMS
 */
export const useMembershipPage = () => {
  const [membershipPage, setMembershipPage] = useState<cmsApi.MembershipPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembershipPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getMembershipPage();
        setMembershipPage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch membership page');
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPage();
  }, []);

  return { membershipPage, loading, error };
};

/**
 * Hook to fetch contact info from CMS
 */
export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<cmsApi.ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getContactInfo();
        setContactInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contact info');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return { contactInfo, loading, error };
};

/**
 * Hook to fetch site settings from CMS
 */
export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<cmsApi.SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getSiteSettings();
        setSiteSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  return { siteSettings, loading, error };
};
