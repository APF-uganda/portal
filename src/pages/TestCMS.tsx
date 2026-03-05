import { useEvents, useNews, useHomepage } from '../hooks/useCMS';

function TestCMS() {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { news, loading: newsLoading, error: newsError } = useNews();
  const { data: homepageData, loading: homeLoading, error: homeError } = useHomepage();

  const renderSection = (
    title: string,
    data: any,
    loading: boolean,
    error: string | null
  ) => {
    const isEmpty = !data || (Array.isArray(data) && data.length === 0);
    const count = Array.isArray(data) ? data.length : (data ? '1 Object' : '0');

    return (
      <div style={{ marginBottom: '30px', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '16px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#7E49B3', margin: 0, fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </h2>
          <span style={{ background: '#F5EFFB', color: '#7E49B3', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
             {count} FOUND
          </span>
        </div>
        
        {loading && <p style={{ color: '#718096', fontSize: '14px' }}>⏳ Loading data...</p>}
        
        {error && (
          <div style={{ padding: '12px', background: '#FFF5F5', color: '#C53030', borderRadius: '8px', border: '1px solid #FEB2B2', fontSize: '13px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {!loading && !error && isEmpty && (
          <div style={{ padding: '12px', background: '#FFFBEB', color: '#92400E', borderRadius: '8px', border: '1px solid #FDE68A', fontSize: '13px' }}>
            No data returned. Check if content is <strong>Published</strong> in Strapi.
          </div>
        )}
        
        {!loading && !error && data && (
          <details style={{ border: '1px solid #edf2f7', borderRadius: '8px' }}>
            <summary style={{ cursor: 'pointer', padding: '10px', background: '#f8fafc', fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>
              Inspect JSON Payload
            </summary>
            <pre style={{ 
              background: '#1a202c', 
              color: '#cbd5e0',
              padding: '16px', 
              fontSize: '11px',
              overflow: 'auto',
              maxHeight: '300px',
              margin: 0
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h1 style={{ color: '#3C096C', marginBottom: '8px', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.04em' }}>
         CMS DIAGNOSTICS
        </h1>
        <p style={{ color: '#718096', fontSize: '15px' }}>
          Verifying Strapi v5 connection and deep-population fields.
        </p>
      </header>

      {renderSection('Homepage Metadata', homepageData, homeLoading, homeError)}
      {renderSection('Events Collection', events, eventsLoading, eventsError)}
      {renderSection('News Collection', news, newsLoading, newsError)}

      <footer style={{ 
        marginTop: '50px', 
        padding: '24px', 
        background: '#3C096C', 
        color: 'white',
        borderRadius: '16px'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          fontSize: '12px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          opacity: 0.7 
        }}>
          Active Strapi Endpoints
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          {['/homepage', '/events', '/news-items'].map(path => (
            <code key={path} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
              {path}
            </code>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default TestCMS;