# Lighthouse Audit - Usage Guide

## What You Need

✅ **Already Installed:**
- `lighthouse` - The audit tool
- `chrome-launcher` - To run Chrome headlessly
- Custom script: `run-lighthouse.js`

## How to Run Audits

### 1. Local Development Server

First, start your dev server in one terminal:
```bash
npm run dev
```

Then in another terminal, run the audit:
```bash
npm run lighthouse:local
```

### 2. Production Build (Preview)

Build and preview your production code:
```bash
npm run build
npm run preview
```

Then audit the preview server:
```bash
npm run lighthouse:preview
```

### 3. Live Production Site

Audit your deployed production site:
```bash
npm run lighthouse https://your-production-domain.com
```

Or directly:
```bash
node run-lighthouse.js https://your-production-domain.com
```

## Understanding the Results

After running, you'll see:

```
📊 Lighthouse Audit Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Performance:     85/100 🟡
♿ Accessibility:   92/100 🟢
✅ Best Practices:  88/100 🟡
🔍 SEO:             95/100 🟢
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Score Meanings:
- 🟢 **90-100**: Good - No action needed
- 🟡 **50-89**: Needs improvement
- 🔴 **0-49**: Poor - Urgent attention required

## Output Files

The script generates:

1. **lighthouse-report-[timestamp].html** - Full detailed report (open in browser)
2. **lighthouse-summary.json** - Quick summary with scores and key metrics

## Key Metrics Explained

### Performance Metrics:
- **First Contentful Paint (FCP)**: When first content appears (target: < 1.8s)
- **Largest Contentful Paint (LCP)**: When main content loads (target: < 2.5s)
- **Total Blocking Time (TBT)**: How long page is unresponsive (target: < 200ms)
- **Cumulative Layout Shift (CLS)**: Visual stability (target: < 0.1)
- **Speed Index**: How quickly content is visually displayed (target: < 3.4s)

## Common Issues & Fixes

### Low Performance Score

**Issue**: Large images
```bash
# Fix: Optimize images before uploading
# Use WebP format, compress to < 100KB
```

**Issue**: Unused JavaScript
```bash
# Fix: Already using React.lazy() for code splitting
# Review and remove unused dependencies
```

**Issue**: Render-blocking resources
```bash
# Fix: Ensure fonts use font-display: swap
# Critical CSS should be inlined
```

### Low Accessibility Score

**Issue**: Missing alt text on images
```jsx
// Fix: Always add alt attributes
<img src="photo.jpg" alt="Description of image" />
```

**Issue**: Low color contrast
```css
/* Fix: Ensure text has sufficient contrast */
/* Use tools like WebAIM Contrast Checker */
```

### Low SEO Score

**Issue**: Missing meta descriptions
```jsx
// Fix: Already implemented with SEO component
<SEO 
  title="Page Title"
  description="Page description"
  keywords="relevant, keywords"
/>
```

## Best Practices

1. **Run audits regularly** - Before each deployment
2. **Test both mobile and desktop** - Modify lighthouse.config.js
3. **Compare over time** - Track improvements using lighthouse-summary.json
4. **Fix critical issues first** - Focus on red/yellow scores
5. **Test on production-like environment** - Use `npm run preview` for accurate results

## Troubleshooting

### "Chrome not found" error
Make sure Chrome or Chromium is installed on your system.

### Port already in use
Change the port in the command:
```bash
node run-lighthouse.js http://localhost:3000
```

### Audit takes too long
This is normal - audits can take 1-2 minutes. The script runs multiple passes for accuracy.

## Next Steps After Audit

1. Open the HTML report in your browser
2. Review failed audits (red/yellow items)
3. Click on each audit for detailed recommendations
4. Implement fixes
5. Re-run audit to verify improvements
6. Document results in progress.md

## CI/CD Integration

For automated testing in CI/CD pipelines, you can use the JSON output:

```bash
node run-lighthouse.js https://staging.your-site.com
# Check lighthouse-summary.json for scores
# Fail build if scores below threshold
```
