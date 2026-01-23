# Frontend Deployment Guide for Render

## Prerequisites
- Frontend code pushed to GitHub repository
- Backend already deployed at: `https://apf-api.onrender.com`

## Deployment Steps

### Option 1: Using Blueprint (render.yaml) - Recommended

1. **Go to Render Dashboard**
   - Navigate to: https://dashboard.render.com

2. **Create New Static Site via Blueprint**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository (portal folder)
   - Render will detect `render.yaml` automatically
   - Click "Apply"

3. **Set Environment Variable**
   After creation, go to your service → Environment:
   - Key: `VITE_API_URL`
   - Value: `https://apf-api.onrender.com`
   - Save

4. **Trigger Deploy**
   - Service will auto-deploy
   - Wait 2-3 minutes for build to complete

### Option 2: Manual Setup

1. **Go to Render Dashboard**
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your portal repository
   - Click "Connect"

3. **Configure Service**
   Fill in these fields:

   **Name:**
   ```
   apf-portal
   ```

   **Branch:**
   ```
   main
   ```

   **Root Directory:**
   ```
   (leave empty if portal is at root, or enter "portal" if in subfolder)
   ```

   **Build Command:**
   ```
   npm install && npm run build
   ```

   **Publish Directory:**
   ```
   dist
   ```

   **Auto-Deploy:**
   ```
   Yes
   ```

4. **Add Environment Variable**
   - Click "Advanced" or go to Environment tab after creation
   - Add Environment Variable:
     - Key: `VITE_API_URL`
     - Value: `https://apf-api.onrender.com`

5. **Create Static Site**
   - Click "Create Static Site"
   - Wait for deployment (2-3 minutes)

## Post-Deployment

### 1. Get Your Frontend URL
After deployment, you'll get a URL like:
```
https://apf-portal.onrender.com
```
or
```
https://apf-uganda.onrender.com
```

### 2. Update Backend CORS
Go back to your backend service and update `CORS_ALLOWED_ORIGINS`:

**Backend Service → Environment → Edit CORS_ALLOWED_ORIGINS:**
```
https://your-frontend-url.onrender.com
```

### 3. Test Your Application

Visit your frontend URL and test:
- ✅ Pages load correctly
- ✅ Navigation works
- ✅ Contact form submits to backend
- ✅ No CORS errors in browser console

## Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

### API Calls Fail
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend `CORS_ALLOWED_ORIGINS` includes frontend URL

### 404 on Page Refresh
- Verify `routes` section in render.yaml includes rewrite rule
- Should have: `source: /*` → `destination: /index.html`

### Environment Variable Not Working
- Vite requires `VITE_` prefix for env vars
- Rebuild after changing environment variables
- Check that variable is accessed as `import.meta.env.VITE_API_URL`

## Custom Domain (Optional)

To use a custom domain:
1. Go to your static site → Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed
4. Update backend CORS to include custom domain

## Free Tier Notes

- ✅ Static sites are completely free on Render
- ✅ Unlimited bandwidth
- ✅ Global CDN included
- ✅ Automatic SSL certificates
- ✅ No spin-down (unlike free web services)

## Useful Commands

### Local Testing with Production Build
```bash
npm run build
npm run preview
```

### Check Environment Variables
```bash
# In your code
console.log(import.meta.env.VITE_API_URL)
```

## Support

For issues:
- Check Render logs in dashboard
- Review browser console for errors
- Verify environment variables are set
- Test backend API endpoints directly
