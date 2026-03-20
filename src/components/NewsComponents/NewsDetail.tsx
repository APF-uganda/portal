import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useNewsArticle } from '../../hooks/useCMS';
import { CMS_BASE_URL } from '../../config/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, loading, error } = useNewsArticle(id);
  const FALLBACK_IMAGE = "/images/Hero.jpg";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

  // Helper to format video URLs correctly for the iframe
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

  if (error || (!loading && !article)) {
    return (
      <div className="min-h-screen bg-[#f7f3ff]">
        <Navbar forceSolid />
        <main className="px-6 pt-28 pb-16 sm:pt-32">
          <div className="max-w-6xl mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center font-montserrat">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Article Not Found</h2>
            <button onClick={() => navigate('/news')} className="flex items-center gap-2 bg-[#5F1C9F] text-white px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-transform active:scale-95">
              <ArrowLeft size={16} strokeWidth={3} /> Return to News
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
        <Navbar forceSolid />
        <main className="px-6 pt-28 pb-16 sm:pt-32">
          <div className="max-w-6xl mx-auto min-h-[50vh]" />
        </main>
        <Footer />
      </div>
    );
  }

  const mainContent = article.content || article.contentBlocks || [];
  const displayImage = article.image || FALLBACK_IMAGE;
  const displayDate = formatDate(article.publishDate || article.date || article.createdAt);

  return (
    <div className="min-h-screen bg-[#f7f3ff]">
      <Navbar forceSolid />

      <div className="fixed top-16 left-0 right-0 z-40 bg-[#f7f3ff]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-2 text-sm text-slate-600 flex items-center min-w-0">
          <Link to="/" className="text-slate-700 hover:underline shrink-0">
            Home
          </Link>
          <span className="mx-2 shrink-0">/</span>
          <Link to="/news" className="text-slate-700 hover:underline shrink-0">
            News
          </Link>
          <span className="mx-2 shrink-0">/</span>
          <span className="text-slate-900 truncate">{article.title}</span>
        </div>
      </div>

      <main className="px-6 pt-28 pb-16 sm:pt-32">
        <div className="max-w-6xl mx-auto">
          <section className="border border-slate-200 bg-white rounded-sm p-5 sm:p-8 font-montserrat animate-fade-in-up overflow-x-hidden">
            {/* <button
              onClick={() => navigate('/news')}
              className="mb-8 inline-flex items-center gap-2 text-gray-900 hover:text-[#5F1C9F] font-bold text-[10px] uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={3} />
              Back to News
            </button> */}

            <header className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-[2.5px] bg-[#5F1C9F] rounded-full"></span>
                <span className="text-[#5F1C9F] font-bold text-[10px] uppercase tracking-[0.4em]">
                  {article.displayCategory || article.category || 'Featured'}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-10 uppercase">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-4 gap-x-8 mb-12 py-6 border-y border-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Calendar size={14} className="text-[#5F1C9F]" /> {displayDate}
                </span>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Clock size={14} className="text-[#5F1C9F]" /> {article.readTime || '5'} MIN READ
                </span>
              </div>
            </header>

            <div className="max-w-4xl mx-auto mb-12 md:mb-20">
              <div className="aspect-[16/9] md:aspect-[21/10] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
                <img
                  src={displayImage}
                  alt={article.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <article className="max-w-3xl mx-auto">
              <div className="text-gray-700 leading-relaxed font-medium text-lg md:text-xl">
                {Array.isArray(mainContent) && mainContent.length > 0 ? (
                  mainContent.map((block: any, i: number) => {

                    //  TEXT BLOCKS (Handles both 'value' and 'children' formats)
                    if (block.type === 'paragraph' || block.type === 'text') {
                      const textValue = block.value || block.children?.map((c: any) => c.text).join('') || "";

                      // Check if this is an image marker (new format)
                      if (textValue.includes('__IMAGE__')) {
                        const imageUrl = textValue.replace(/__IMAGE__/g, '');
                        const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;

                        return (
                          <div key={i} className="my-12 group">
                            <img
                              src={fullUrl}
                              className="w-full rounded-[2rem] shadow-md border border-gray-50 group-hover:shadow-xl transition-shadow duration-500"
                              alt="Article Image"
                            />
                          </div>
                        );
                      }

                      // Check if this is a video marker (new format)
                      if (textValue.includes('__VIDEO__')) {
                        const videoUrl = textValue.replace(/__VIDEO__/g, '');

                        return (
                          <div key={i} className="my-12 aspect-video rounded-[2rem] overflow-hidden shadow-lg bg-gray-900">
                            <iframe
                              src={getEmbedUrl(videoUrl)}
                              className="w-full h-full border-none"
                              allowFullScreen
                              title="Article Video"
                            ></iframe>
                          </div>
                        );
                      }

                      // Check if this is an old format image marker
                      if (textValue.includes('[Image:') && textValue.includes(']')) {
                        const match = textValue.match(/\[Image:\s*(.*?)\]/);
                        if (match && match[1]) {
                          const imageUrl = match[1].trim();
                          const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;

                          return (
                            <div key={i} className="my-12 group">
                              <img
                                src={fullUrl}
                                className="w-full rounded-[2rem] shadow-md border border-gray-50 group-hover:shadow-xl transition-shadow duration-500"
                                alt="Article Image"
                              />
                            </div>
                          );
                        }
                      }

                      // Check if this is a video URL (YouTube/Vimeo patterns)
                      if (textValue.includes('youtube.com') || textValue.includes('youtu.be') || textValue.includes('vimeo.com')) {
                        // Extract URL from text if it's mixed with other text
                        const urlMatch = textValue.match(/(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)[\w-]+)/);
                        if (urlMatch) {
                          const videoUrl = urlMatch[1];
                          return (
                            <div key={i} className="my-12 aspect-video rounded-[2rem] overflow-hidden shadow-lg bg-gray-900">
                              <iframe
                                src={getEmbedUrl(videoUrl)}
                                className="w-full h-full border-none"
                                allowFullScreen
                                title="Article Video"
                              ></iframe>
                            </div>
                          );
                        }
                      }

                      // Regular text paragraph
                      return <p key={i} className="mb-8">{textValue}</p>;
                    }

                    //  HEADINGS
                    if (block.type === 'heading') {
                      const headingText = block.value || block.children?.map((c: any) => c.text).join('') || "";
                      return (
                        <h3 key={i} className="font-bold text-gray-900 text-2xl md:text-3xl mt-12 mb-6 uppercase tracking-tight">
                          {headingText}
                        </h3>
                      );
                    }

                    //  IN-CONTENT IMAGES
                    if (block.type === 'image') {
                      const imageUrl = block.image?.url || block.url || block.value;
                      if (!imageUrl) return null;

                      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;

                      return (
                        <div key={i} className="my-12 group">
                          <img
                            src={fullUrl}
                            className="w-full rounded-[2rem] shadow-md border border-gray-50 group-hover:shadow-xl transition-shadow duration-500"
                            alt={block.image?.alternativeText || "Article Image"}
                          />
                          {(block.caption || block.image?.caption) && (
                            <p className="mt-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                              {block.caption || block.image?.caption}
                            </p>
                          )}
                        </div>
                      );
                    }

                    // VIDEO BLOCKS
                    if (block.type === 'video') {
                      const videoUrl = block.url || block.value;
                      if (!videoUrl) return null;

                      return (
                        <div key={i} className="my-12 aspect-video rounded-[2rem] overflow-hidden shadow-lg bg-gray-900">
                          <iframe
                            src={getEmbedUrl(videoUrl)}
                            className="w-full h-full border-none"
                            allowFullScreen
                            title="Article Video"
                          ></iframe>
                        </div>
                      );
                    }

                    return null;
                  })
                ) : (
                  <p className="text-xl font-medium leading-relaxed text-gray-600 italic">
                    {article.description || "No further details available for this article."}
                  </p>
                )}
              </div>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
