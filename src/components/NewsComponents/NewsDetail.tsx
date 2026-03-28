import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNews, useNewsArticle, prefetchNewsArticle } from '../../hooks/useCMS';
import { CMS_BASE_URL } from '../../config/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import HeroSection from './HeroSection';
import NewsletterSection from './NewsletterSection';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, loading, error } = useNewsArticle(id);
  const { news } = useNews();
  const FALLBACK_IMAGE = "/images/Hero.jpg";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const getArticleId = (item: any) => item?.documentId || item?.id || item?.slug;

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return 'Date unavailable';
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return dateValue;

    return parsedDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatReadTime = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const text = String(value).trim();
    if (!text) return '';
    if (/min/i.test(text) || /read/i.test(text)) return text;
    if (/^\d+(\.\d+)?$/.test(text)) return `${text} min read`;
    return text;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('youtube.com/watch?v=')) return url.replace("watch?v=", "embed/");
    if (url.includes('youtu.be/')) {
      const id = url.split('/').pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const latestNews = useMemo(() => {
    return [...news].sort((a, b) => {
      const dateA = new Date(a?.publishDate || a?.date || a?.createdAt || 0).getTime();
      const dateB = new Date(b?.publishDate || b?.date || b?.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [news]);

  const renderMainContent = (contentBlocks: any[]) => {
    if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
      return (
        <p className="text-sm md:text-base leading-relaxed text-[#1F1F1F]">
          {article?.description || "No further details available for this article."}
        </p>
      );
    }

    return contentBlocks.map((block: any, i: number) => {
      if (block.type === 'paragraph' || block.type === 'text') {
        const textValue = block.value || block.children?.map((c: any) => c.text).join('') || "";

        if (textValue.includes('__IMAGE__')) {
          const imageUrl = textValue.replace(/__IMAGE__/g, '');
          const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;
          return (
            <div key={i} className="my-8">
              <img src={fullUrl} className="w-full object-cover" alt="Article" />
            </div>
          );
        }

        if (textValue.includes('__VIDEO__')) {
          const videoUrl = textValue.replace(/__VIDEO__/g, '');
          return (
            <div key={i} className="my-8 aspect-video overflow-hidden bg-gray-900">
              <iframe
                src={getEmbedUrl(videoUrl)}
                className="w-full h-full border-none"
                allowFullScreen
                title="Article Video"
              />
            </div>
          );
        }

        return (
          <p key={i} className="mb-6 text-sm md:text-base leading-relaxed text-[#1F1F1F]">
            {textValue}
          </p>
        );
      }

      if (block.type === 'heading') {
        const headingText = block.value || block.children?.map((c: any) => c.text).join('') || "";
        return (
          <h3 key={i} className="text-[#111] text-xl md:text-2xl mt-10 mb-4">
            {headingText}
          </h3>
        );
      }

      if (block.type === 'image') {
        const imageUrl = block.image?.url || block.url || block.value;
        if (!imageUrl) return null;

        const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;
        return (
          <div key={i} className="my-8">
            <img
              src={fullUrl}
              className="w-full object-cover"
              alt={block.image?.alternativeText || "Article Image"}
            />
          </div>
        );
      }

      if (block.type === 'video') {
        const videoUrl = block.url || block.value;
        if (!videoUrl) return null;
        return (
          <div key={i} className="my-8 aspect-video overflow-hidden bg-gray-900">
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="w-full h-full border-none"
              allowFullScreen
              title="Article Video"
            />
          </div>
        );
      }

      return null;
    });
  };

  if (error || (!loading && !article)) {
    return (
      <div className="min-h-screen bg-[#f7f3ff]">
        <Navbar />
        <main className="px-6 pt-28 pb-16">
          <div className="max-w-6xl mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Article Not Found</h2>
            <button
              onClick={() => navigate('/news')}
              className="bg-[#5F1C9F] text-white px-6 py-3 font-semibold"
            >
              Return to News
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f7f3ff]">
        <Navbar />
        <main className="px-6 pt-28 pb-16">
          <div className="max-w-6xl mx-auto min-h-[50vh]" />
        </main>
        <Footer />
      </div>
    );
  }

  const mainContent = article.content || article.contentBlocks || [];
  const displayImage = article.image || FALLBACK_IMAGE;
  const displayDate = formatDate(article.publishDate || article.date || article.createdAt);
  const currentArticleId = getArticleId(article);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection title={article?.title || 'News and Insights'} />
      <section
        className="bg-[#f7f3ff] py-6 md:py-10 px-4 md:px-6"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6 items-start">
          <article className="bg-white">
            <img
              src={displayImage}
              alt={article.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="w-full h-[260px] sm:h-[360px] lg:h-[520px] object-cover"
            />

            <div className="px-6 md:px-8 pt-6 pb-8">
              <p className="text-gray-500 text-sm md:text-base leading-tight mb-5">
                {displayDate}
                {formatReadTime(article?.readTime) ? ` | ${formatReadTime(article?.readTime)}` : ''}
              </p>
              <div className="text-[#1F1F1F]">
                {renderMainContent(mainContent)}
              </div>
            </div>
          </article>

          <aside className="bg-white p-5 md:p-6 self-start">
            <h3 className="text-2xl font-bold text-[#060606] uppercase mb-6">
              Latest News
            </h3>

            <div className="space-y-6 max-h-[820px] overflow-y-auto pr-1">
              {latestNews.slice(0, 10).map((item) => {
                const itemId = getArticleId(item);
                const isActive = itemId === currentArticleId;
                return (
                  <button
                    key={itemId || item.title}
                    type="button"
                    onClick={() => itemId && navigate(`/news/${itemId}`)}
                    onMouseEnter={() => void prefetchNewsArticle(itemId)}
                    className={`w-full text-left transition-colors ${
                      isActive
                        ? 'opacity-100 bg-white/60 border-l-4 border-[#5F1C9F] pl-2'
                        : 'opacity-95 hover:opacity-100'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="w-[86px] h-[86px] object-cover flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-[1.04rem] leading-7 font-semibold text-[#090909] hover:text-[#5F1C9F] transition-colors line-clamp-4">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-[1.02rem] text-[#7A828C]">
                          {formatDate(item.publishDate || item.date || item.createdAt)}
                          {formatReadTime(item?.readTime) ? ` | ${formatReadTime(item?.readTime)}` : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default NewsDetail;
