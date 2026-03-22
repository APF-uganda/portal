import { useEffect, useMemo, useState } from 'react';
import { useNews } from '../hooks/useNews';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';
import HeroSection from '../components/NewsComponents/HeroSection';
import NewsletterSection from '../components/NewsComponents/NewsletterSection';
import TopPickSection from '../components/NewsComponents/TopPickSection';
import { prefetchNewsArticle } from '../hooks/useCMS';
import { CMS_BASE_URL } from '../config/api';

function NewsPage() {
  const { news } = useNews();
  const [selectedArticleId, setSelectedArticleId] = useState<string | number | null>(null);
  const FALLBACK_IMAGE = '/images/Hero.jpg';

  const getArticleId = (item: any) => item?.documentId || item?.id || item?.slug;
  const getArticleDate = (item: any) =>
    new Date(item?.publishDate || item?.date || item?.createdAt || 0).getTime();

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('youtube.com/watch?v=')) return url.replace("watch?v=", "embed/");
    if (url.includes('youtu.be/')) {
      const videoId = url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const renderMainContent = (contentBlocks: any[], fallbackText: string) => {
    if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
      return (
        <p className="text-sm md:text-base leading-relaxed text-[#1F1F1F]">
          {fallbackText || "No further details available for this article."}
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
          <h3 key={i} className="font-black text-[#111] text-xl md:text-2xl mt-10 mb-4">
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

  const formatDate = (item: any) => {
    const rawDate = item?.publishDate || item?.date || item?.createdAt;
    if (!rawDate) return '';
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const sortedNews = useMemo(
    () => [...news].sort((a, b) => getArticleDate(b) - getArticleDate(a)),
    [news]
  );

  useEffect(() => {
    if (sortedNews.length === 0) {
      setSelectedArticleId(null);
      return;
    }

    const exists = sortedNews.some((item) => getArticleId(item) === selectedArticleId);
    if (!selectedArticleId || !exists) {
      setSelectedArticleId(getArticleId(sortedNews[0]));
    }
  }, [sortedNews, selectedArticleId]);

  const selectedArticle =
    sortedNews.find((item) => getArticleId(item) === selectedArticleId) || sortedNews[0] || null;
  const topPickArticle =
    sortedNews.find((item) => item?.isTopPick || item?.isFeatured || item?.isTopic) || sortedNews[0] || null;

  const latestNewsList = sortedNews;

  const handleSelectArticle = (item: any) => {
    const targetId = getArticleId(item);
    if (!targetId) return;
    setSelectedArticleId(targetId);
    void prefetchNewsArticle(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="News & Insights"
        description="Stay updated with the latest news, announcements, and insights from the Accountancy Practitioners Forum. Read articles on accounting trends, regulations, and professional updates."
        keywords="accounting news, APF updates, professional insights, accounting trends, announcements"
      />
      <Navbar />
      <HeroSection title={selectedArticle?.title || 'News and Insights'} />
      {/* <TopPickSection article={topPickArticle} /> */}
      <section
        className="bg-[#f7f3ff] pt-10 md:pt-12 pb-6 md:pb-4 px-4 md:px-6"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6 items-start">
          <article className="bg-white">
            {selectedArticle ? (
              <>
                <img
                  src={selectedArticle.image || FALLBACK_IMAGE}
                  alt={selectedArticle.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-[260px] sm:h-[360px] lg:h-[520px] object-cover"
                />
                <div className="px-6 md:px-8 pt-6 pb-8">
                  <p className="text-gray-500 text-base md:text-lg leading-tight mb-3">
                    {formatDate(selectedArticle)}
                    {formatReadTime(selectedArticle?.readTime)
                      ? ` | ${formatReadTime(selectedArticle?.readTime)}`
                      : ''}
                  </p>
                  <div className="text-[#1F1F1F]">
                    {renderMainContent(selectedArticle?.content || [], selectedArticle?.description || selectedArticle?.summary || '')}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500 text-lg">
                No news available at the moment.
              </div>
            )}
          </article>

          <aside className="bg-white p-5 md:p-6 self-start">
            <h3 className="text-2xl font-bold text-[#060606] uppercase mb-6">
              Latest News
            </h3>

            <div className="space-y-6 max-h-[820px] overflow-y-auto pr-1">
              {latestNewsList.slice(0, 10).map((item) => {
                const itemId = getArticleId(item);
                const isActive = itemId === selectedArticleId;
                return (
                  <button
                    key={itemId || item.title}
                    type="button"
                    onClick={() => handleSelectArticle(item)}
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
                          {formatDate(item)}
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
}

export default NewsPage;
