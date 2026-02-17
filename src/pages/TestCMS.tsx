/**
 * CMS Integration Test Page
 * Use this page to test Strapi CMS integration
 * Access at: http://localhost:5173/test-cms
 */

import { useEvents, useNewsArticles, useLeadership, useBenefits, useFAQs, usePartners } from '../hooks/useCMS';

function TestCMS() {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { articles, loading: articlesLoading, error: articlesError } = useNewsArticles();
  const { leaders, loading: leadersLoading, error: leadersError } = useLeadership();
  const { benefits, loading: benefitsLoading, error: benefitsError } = useBenefits();
  const { faqs, loading: faqsLoading, error: faqsError } = useFAQs();
  const { partners, loading: partnersLoading, error: partnersError } = usePartners();

  const renderSection = (
    title: string,
    data: any[],
    loading: boolean,
    error: string | null
  ) => (
    <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ color: '#7E49B3', marginBottom: '10px' }}>
        {title} ({data.length})
      </h2>
      
      {loading && <p style={{ color: '#666' }}>Loading...</p>}
      
      {error && (
        <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}
      
      {!loading && !error && data.length === 0 && (
        <div style={{ padding: '10px', background: '#ffc', color: '#660', borderRadius: '4px' }}>
          No data found. Add content in Strapi admin panel.
        </div>
      )}
      
      {!loading && !error && data.length > 0 && (
        <details>
          <summary style={{ cursor: 'pointer', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
            View Data (Click to expand)
          </summary>
          <pre style={{ 
            background: '#f9f9f9', 
            padding: '15px', 
            borderRadius: '4px', 
            overflow: 'auto',
            fontSize: '12px',
            marginTop: '10px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#3C096C', marginBottom: '10px' }}>
          🧪 CMS Integration Test
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          This page tests the connection between React frontend and Strapi CMS.
        </p>
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#e9d5ff', 
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>Instructions:</strong>
          <ol style={{ marginTop: '10px', marginBottom: '0' }}>
            <li>Ensure Strapi is running at <code>http://localhost:1337</code></li>
            <li>Add sample content in Strapi admin panel</li>
            <li>Ensure public permissions are enabled (Settings → Roles → Public)</li>
            <li>Refresh this page to see the data</li>
          </ol>
        </div>
      </div>

      {renderSection('Events', events, eventsLoading, eventsError)}
      {renderSection('News Articles', articles, articlesLoading, articlesError)}
      {renderSection('Leadership', leaders, leadersLoading, leadersError)}
      {renderSection('Benefits', benefits, benefitsLoading, benefitsError)}
      {renderSection('FAQs', faqs, faqsLoading, faqsError)}
      {renderSection('Partners', partners, partnersLoading, partnersError)}

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#f0f0f0', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3 style={{ marginTop: 0 }}>API Endpoints Being Tested:</h3>
        <ul style={{ marginBottom: 0 }}>
          <li><code>GET /api/events?populate=*</code></li>
          <li><code>GET /api/news-articles?populate=*</code></li>
          <li><code>GET /api/leaderships?populate=*</code></li>
          <li><code>GET /api/benefits?populate=*</code></li>
          <li><code>GET /api/faqs</code></li>
          <li><code>GET /api/partners?populate=*</code></li>
        </ul>
      </div>
    </div>
  );
}

export default TestCMS;
