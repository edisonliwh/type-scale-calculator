# How to Update Vercel with Changes

## Automatic Deployment (Default)

If your Vercel project is connected to your GitHub repository, **deployments happen automatically** when you push to the connected branch (usually `main`).

### What Happens:
1. ✅ You push to GitHub: `git push`
2. ✅ Vercel detects the push via webhook
3. ✅ Vercel automatically starts building your project
4. ✅ Vercel deploys the new version
5. ✅ Your site is updated (usually takes 1-3 minutes)

### Check Deployment Status:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project: `type-scale-calculator`
3. You'll see the deployment status and build logs

## Manual Deployment

If automatic deployment isn't working or you want to trigger it manually:

### Option 1: Via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment
   - Or click "Create Deployment" → Select branch → Deploy

### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Push an Empty Commit (Trigger Webhook)
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

## Verify Your Changes Are Live

1. **Check Deployment Status:**
   - Go to Vercel dashboard
   - Look for the latest deployment
   - Status should be "Ready" (green checkmark)

2. **Visit Your Site:**
   - Click on the deployment
   - Click "Visit" to see your live site
   - Or visit your custom domain

3. **Check Build Logs:**
   - If deployment fails, check the build logs
   - Common issues:
     - Build errors
     - Missing environment variables
     - Dependency issues

## Troubleshooting

### Deployment Not Triggering Automatically

1. **Check GitHub Integration:**
   - Vercel Dashboard → Project Settings → Git
   - Verify repository is connected
   - Check if correct branch is selected

2. **Check Webhook:**
   - GitHub → Repository Settings → Webhooks
   - Look for Vercel webhook
   - Should show recent deliveries

3. **Reconnect Repository:**
   - Vercel Dashboard → Project Settings → Git
   - Disconnect and reconnect repository

### Build Failing

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click failed deployment
   - Review error messages

2. **Common Fixes:**
   - Update dependencies: `npm install`
   - Fix TypeScript errors
   - Check `package.json` scripts
   - Verify Node.js version in Vercel settings

### Changes Not Showing

1. **Clear Browser Cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

2. **Check Deployment:**
   - Make sure latest deployment is "Ready"
   - Verify you're looking at production URL

3. **Check Branch:**
   - Ensure you pushed to the correct branch
   - Vercel might be watching a different branch

## Quick Checklist

- [ ] Changes pushed to GitHub: `git push`
- [ ] Vercel project connected to GitHub repo
- [ ] Deployment appears in Vercel dashboard
- [ ] Build completes successfully
- [ ] Changes visible on live site

## For Your Current Changes

Since you just pushed to GitHub:
1. ✅ Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. ✅ Check if a new deployment started automatically
3. ✅ Wait 1-3 minutes for build to complete
4. ✅ Visit your site to see the updates:
   - GitHub icon button in top right
   - Updated divider colors
   - Standardized field spacing

If no deployment started automatically, use one of the manual methods above.

