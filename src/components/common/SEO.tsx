import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: string;
}

const SEO = ({
  title = 'APF Service Portal',
  description = 'Accountancy Practitioners Forum - Connecting accounting professionals across Uganda',
  keywords = 'accountancy, accounting professionals, Uganda, APF, membership, CPD',
  ogImage = '/images/Hero.jpg',
  canonicalUrl,
  type = 'website',
}: SEOProps) => {
  const fullTitle = title === 'APF Service Portal' ? title : `${title} | APF Service Portal`;
  const siteUrl = window.location.origin;
  const currentUrl = canonicalUrl || window.location.href;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  );
};

export default SEO;
