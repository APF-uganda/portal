import React, { useState, useEffect } from 'react';
import { useEvents, useNews } from '../../hooks/useCMS';
import { CMS_API_URL, CMS_BASE_URL } from '../../config/api';

const ApiDebug: React.FC = () => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { news, loading: newsLoading, error: newsError } = useNews();
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    // Test direct API call
    const testApi = async () => {
      try {
        const response = await fetch(`${CMS_API_URL}/events?populate=*`);
        const data = await response.json();
        setApiTest({ events: data, status: response.status });
      } catch (err) {
        setApiTest({ error: err, status: 'failed' });
      }
    };
    testApi();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      width: '400px', 
      height: '100vh', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '20px', 
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h3>API Debug Panel</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Configuration:</h4>
        <p><strong>CMS_BASE_URL:</strong> {CMS_BASE_URL}</p>
        <p><strong>CMS_API_URL:</strong> {CMS_API_URL}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Events Hook:</h4>
        <p><strong>Loading:</strong> {eventsLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {eventsError || 'None'}</p>
        <p><strong>Count:</strong> {events.length}</p>
        <p><strong>Featured:</strong> {events.filter(e => e.isFeatured).length}</p>
        {events.length > 0 && (
          <details>
            <summary>First Event</summary>
            <pre>{JSON.stringify({
              ...events[0],
              imageUrl: events[0].image,
              hasImage: !!events[0].image
            }, null, 2)}</pre>
          </details>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>News Hook:</h4>
        <p><strong>Loading:</strong> {newsLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {newsError || 'None'}</p>
        <p><strong>Count:</strong> {news.length}</p>
        {news.length > 0 && (
          <details>
            <summary>First News</summary>
            <pre>{JSON.stringify({
              ...news[0],
              imageUrl: news[0].image,
              hasImage: !!news[0].image
            }, null, 2)}</pre>
          </details>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Direct API Test:</h4>
        {apiTest && (
          <details>
            <summary>Raw API Response</summary>
            <pre>{JSON.stringify(apiTest, null, 2)}</pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ApiDebug;