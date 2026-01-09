# Deployment Guide for APF Portal

## Prerequisites
- GitHub/GitLab account with this repository
- Render account (free tier available at render.com)

## Deployment Steps

### 1. Prepare Repository
- Ensure all changes are committed and pushed to your Git repository
- The `render.yaml` file is already configured for automatic deployment

### 2. Deploy on Render

1. **Login to Render**
   - Go to https://render.com
   - Sign up or login with your GitHub/GitLab account

2. **Create New Static Site**
   - Click "New +" button in the dashboard
   - Select "Static Site"
   - Connect your repository
   - Render will auto-detect the configuration from `render.yaml`

3. **Configure Build Settings** (if not auto-detected)
   - **Name**: apf-portal (or your preferred name)
   - **Branch**: main (or your default branch)
   - **Root Directory**: portal (if in monorepo) or leave blank
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist

4. **Environment Variables** (Optional - for future backend integration)
   - Add `VITE_API_URL` with your backend URL when ready
   - Example: `https://your-backend.onrender.com`

5. **Deploy**
   - Click "Create Static Site"
   - Wait 3-5 minutes for the build to complete
   - Your site will be live at: `https://apf-portal.onrender.com`

### 3. Post-Deployment

- **Test the site**: Visit your Render URL and verify everything works
- **Custom Domain** (Optional): 
  - Go to Settings → Custom Domain in Render dashboard
  - Add your domain and configure DNS records

### 4. Automatic Deployments

- Render automatically redeploys when you push to your connected branch
- You can disable auto-deploy in Settings if needed

## Build Verification

Before deploying, test the build locally:

```bash
npm install
npm run build
npm run preview
```

Visit http://localhost:4173 to preview the production build.

## Troubleshooting

**Build fails:**
- Check that all dependencies are in package.json
- Verify TypeScript compiles without errors: `npm run build`

**404 errors on routes:**
- The render.yaml includes rewrite rules for SPA routing
- Ensure the routes configuration is present

**Assets not loading:**
- Check that asset paths are relative (not absolute)
- Verify dist folder contains all necessary files

## Free Tier Limitations

- 100 GB bandwidth per month
- Global CDN included
- Custom domains supported
- No sleep/wake delays (unlike web services)

## Support

For issues, check:
- Render documentation: https://render.com/docs/static-sites
- Build logs in Render dashboard
- Vite documentation: https://vitejs.dev/guide/static-deploy.html
