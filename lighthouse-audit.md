# Lighthouse Audit Guide for APF Portal

## Quick Start

### Running Lighthouse Audits

```bash
# Audit local development server (default: http://localhost:5173)
npm run lighthouse:local

# Audit preview/build server
npm run lighthouse:preview

# Audit production site (replace with your actual URL)
npm run lighthouse https://your-production-url.com

# Or use the generic command with any URL
node run-lighthouse.js https://your-site.com
```

## What Lighthouse Does

Lighthouse is an automated tool by Google that audits web pages for:
- **Performance**: How fast your site loads and becomes interactive
- **Accessibility**: How usable your site is for people with disabilities
- **Best Practices**: Security, modern web standards, and code quality
- **SEO**: Search engine optimization and discoverability

## Installation (Already Done ✅)

```bash
npm install --save-dev lighthouse chrome-launcher
```

## How to Run Lighthouse Audit

### Option 1: Chrome DevTools (Recommended for Development)
1. Open the portal in Google Chrome
2. Press F12 to open DevTools
3. Click on the "Lighthouse" tab
4. Select categories to audit:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
5. Choose device: Mobile or Desktop
6. Click "Analyze page load"

### Option 2: Chrome Extension
1. Install "Lighthouse" extension from Chrome Web Store
2. Navigate to your portal
3. Click the Lighthouse icon
4. Run audit

### Option 3: Command Line (CI/CD)
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit on local dev server
lighthouse http://localhost:5173 --output html --output-path ./lighthouse-report.html

# Run audit on production
lighthouse https://your-production-url.com --output html --output-path ./lighthouse-report.html
```

## Key Metrics to Monitor

### Performance
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1
- Speed Index: < 3.4s

### Accessibility
- Target: 90+ score
- Check for proper ARIA labels
- Color contrast ratios
- Keyboard navigation
- Screen reader compatibility

### Best Practices
- Target: 90+ score
- HTTPS usage
- No browser errors in console
- Proper image aspect ratios
- Secure dependencies

### SEO
- Target: 95+ score
- ✅ Meta descriptions (now implemented)
- ✅ Title tags (now implemented)
- Mobile-friendly viewport
- Crawlable links
- Valid structured data

## Optimization Recommendations

### Images
- Use WebP format where possible
- Implement lazy loading for below-the-fold images
- Add proper width/height attributes
- Compress images (target: < 100KB per image)

### JavaScript
- Code splitting (already using React.lazy)
- Remove unused dependencies
- Minification (handled by Vite build)

### CSS
- Remove unused CSS
- Critical CSS inlining
- Minimize render-blocking resources

### Fonts
- Use font-display: swap
- Preload critical fonts
- Consider system fonts for faster loading

### Caching
- Implement service worker for offline support
- Set proper cache headers
- Use CDN for static assets

## Current Implementation Status

✅ SEO meta tags implemented
✅ React lazy loading for routes
✅ Vite build optimization
✅ Responsive design
⏳ Image optimization needed
⏳ Lighthouse audit to be conducted
⏳ Performance baseline to be established

## Next Steps

1. Run initial Lighthouse audit to establish baseline
2. Identify top 3 performance bottlenecks
3. Implement image optimization
4. Add lazy loading for images
5. Re-run audit to measure improvements
6. Document results in progress.md
