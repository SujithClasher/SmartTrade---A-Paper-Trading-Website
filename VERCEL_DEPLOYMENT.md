# 🚀 Vercel Deployment Guide

This guide will help you deploy SmartTrade to Vercel in under 5 minutes.

## Prerequisites

- GitHub account
- Finnhub API key (free from [finnhub.io/register](https://finnhub.io/register))

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. In your local terminal:

```bash
cd c:\smartTrade

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SmartTrade Paper Trading App"

# Set main branch
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/smarttrade.git

# Push
git push -u origin main
```

## Step 2: Deploy to Vercel

### 2.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Project

1. Click "Add New" → "Project"
2. Find your `smarttrade` repository
3. Click "Import"

### 2.3 Configure Project

**Framework Preset:** Next.js (auto-detected)  
**Build Command:** `npm run build` (auto-set)  
**Output Directory:** `.next` (auto-set)

### 2.4 Add Environment Variable

⚠️ **CRITICAL STEP** - Don't skip this!

1. Expand "Environment Variables" section
2. Add the following:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FINNHUB_API_KEY` | Your Finnhub API key |

3. Select all three environments:
   - [x] Production
   - [x] Preview  
   - [x] Development

### 2.5 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes ⏳
3. ✅ Done!

## Step 3: Verify Deployment

1. Click "Visit" when deployment completes
2. Check the API status badge in navbar:
   - **🟢 "Live Data"** = Success! Real-time data working
   - **⚪ "Demo Mode"** = API key not set properly

### If you see "Demo Mode":

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Verify `NEXT_PUBLIC_FINNHUB_API_KEY` is set
5. Click "Redeploy" from Deployments tab

## Step 4: Get Your App URL

Your app is now live at:
```
https://your-project-name.vercel.app
```

Share this URL with anyone!

## Automatic Deployments

Every time you push to GitHub, Vercel automatically redeploys:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys! 🎉
```

## Optional: Add Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `smarttrade.yourdomain.com`)
4. Follow DNS configuration instructions
5. Done! Your app is on your domain

## Common Issues

### Build Failed

**Error:** "Module not found"  
**Solution:** Make sure all dependencies are in `package.json`

```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### API Not Working

**Error:** Shows "Demo Mode" instead of "Live Data"  
**Solution:** 
1. Check environment variable is set correctly
2. Make sure you selected all 3 environments
3. Redeploy from Vercel dashboard

### 404 on Routes

**Error:** Pages show 404 error  
**Solution:** This shouldn't happen with Next.js App Router, but if it does:
1. Check `vercel.json` exists
2. Redeploy

## Environment Variables Update

To update your API key or add new variables:

1. Vercel Dashboard → Project → Settings
2. Environment Variables
3. Edit or add new variable
4. Redeploy (Deployments → ⋯ → Redeploy)

## Performance Tips

Your app is already optimized for Vercel:
- ✅ Static generation where possible
- ✅ Automatic code splitting
- ✅ Edge network delivery
- ✅ Image optimization
- ✅ Caching enabled

## Monitoring

View your app's analytics in Vercel Dashboard:
- **Visitors:** See traffic stats
- **Performance:** Load times and metrics
- **Logs:** Runtime logs and errors
- **Deployments:** History of all deploys

## Cost

**100% FREE** for this project!

Vercel free tier includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Unlimited team members

This app uses minimal resources, so you'll never hit limits.

## Support

Need help?
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- Check this project's README.md

---

## Quick Reference Commands

```bash
# Initial deployment
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

# Updates after initial deploy
git add .
git commit -m "Your changes"
git push
```

**That's it! Your SmartTrade app is live on Vercel! 🎉**

Share your app: `https://your-project.vercel.app`
