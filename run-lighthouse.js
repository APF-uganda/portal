import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import { config } from 'dotenv';
import http from 'http';

config();

async function checkUrlAccessible(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'HEAD',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function runLighthouse() {
  const url = process.argv[2] || process.env.VITE_APP_URL || 'http://localhost:5173';
  
  console.log(`🔍 Running Lighthouse audit on: ${url}`);
  console.log('⏳ Checking if server is accessible...');
  
  const isAccessible = await checkUrlAccessible(url);
  
  if (!isAccessible) {
    console.error('\n❌ Error: Cannot connect to', url);
    console.error('\n💡 Make sure your development server is running:');
    console.error('   1. Open a new terminal');
    console.error('   2. Run: npm run dev');
    console.error('   3. Wait for "Local: http://localhost:5173"');
    console.error('   4. Then run this audit again\n');
    process.exit(1);
  }
  
  console.log('✅ Server is accessible');
  console.log('⏳ Running audit (this may take a minute)...\n');

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });

  const options = {
    logLevel: 'error',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    }
  };

  try {
    const runnerResult = await lighthouse(url, options);
    const { lhr } = runnerResult;
    
    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100)
    };

    console.log('\n📊 Lighthouse Audit Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 Performance:     ${scores.performance}/100 ${getEmoji(scores.performance)}`);
    console.log(`♿ Accessibility:   ${scores.accessibility}/100 ${getEmoji(scores.accessibility)}`);
    console.log(`✅ Best Practices:  ${scores.bestPractices}/100 ${getEmoji(scores.bestPractices)}`);
    console.log(`🔍 SEO:             ${scores.seo}/100 ${getEmoji(scores.seo)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const reportHtml = runnerResult.report;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `lighthouse-report-${timestamp}.html`;
    fs.writeFileSync(filename, reportHtml);
    console.log(`📄 Full report saved: ${filename}`);

    const summary = {
      timestamp: new Date().toISOString(),
      url,
      scores,
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint'].displayValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint'].displayValue,
        totalBlockingTime: lhr.audits['total-blocking-time'].displayValue,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].displayValue,
        speedIndex: lhr.audits['speed-index'].displayValue
      }
    };
    fs.writeFileSync('lighthouse-summary.json', JSON.stringify(summary, null, 2));
    console.log(`📊 Summary saved: lighthouse-summary.json\n`);

    if (scores.performance < 90) {
      console.log('💡 Performance Tips:');
      const perfAudits = Object.values(lhr.audits).filter(
        audit => audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode === 'numeric'
      );
      perfAudits.slice(0, 3).forEach(audit => {
        console.log(`   - ${audit.title}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error running Lighthouse:', error.message);
  } finally {
    await chrome.kill();
  }
}

function getEmoji(score) {
  if (score >= 90) return '🟢';
  if (score >= 50) return '🟡';
  return '🔴';
}

runLighthouse().catch(console.error);
