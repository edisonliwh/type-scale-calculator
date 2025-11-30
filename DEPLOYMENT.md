# Deployment Guide

## Option 1: Vercel (Recommended for Next.js)

Vercel is made by the Next.js team and provides the best integration.

### Steps:

1. **Sign up for Vercel** (if you haven't already):
   - Go to https://vercel.com
   - Sign up with your GitHub account

2. **Import your repository**:
   - Click "Add New Project"
   - Select your GitHub repository: `edisonliwh/type-scale-calculator`
   - Vercel will auto-detect it's a Next.js project

3. **Configure the project** (usually auto-configured):
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at: `https://type-scale-calculator-*.vercel.app`
   - You can add a custom domain later

5. **Automatic deployments**:
   - Every push to `main` branch will automatically deploy
   - Pull requests get preview deployments

## Option 2: Netlify

1. **Sign up for Netlify**: https://www.netlify.com
2. **Connect your GitHub repository**
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Deploy**

## Option 3: GitHub Pages (More Complex)

Next.js requires static export for GitHub Pages:

1. Update `next.config.js` to enable static export
2. Install `gh-pages`: `npm install --save-dev gh-pages`
3. Add deploy script to `package.json`
4. Configure GitHub Pages in repository settings

## Quick Vercel CLI Deployment

Alternatively, you can use the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

