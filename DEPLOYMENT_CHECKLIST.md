# ✅ Deployment Checklist - SmartTrade

Follow this checklist to deploy your app to Vercel with real-time data.

## Pre-Deployment

### 1. Get Finnhub API Key (2 minutes)

- [ ] Visit [finnhub.io/register](https://finnhub.io/register)
- [ ] Sign up with email
- [ ] Verify email
- [ ] Copy API key from dashboard
- [ ] Save it somewhere safe

💡 **Tip:** Keep this tab open - you'll need the key for Vercel

### 2. Create GitHub Repository (3 minutes)

- [ ] Go to [github.com](https://github.com) and login
- [ ] Click "New repository"
- [ ] Name it `smarttrade` (or any name you prefer)
- [ ] Make it Public or Private (your choice)
- [ ] DON'T initialize with README
- [ ] Click "Create repository"
- [ ] Keep this page open

### 3. Push Code to GitHub (2 minutes)

Open terminal in `c:\smartTrade` and run:

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit - SmartTrade paper trading app"

# Set main branch
git branch -M main

# Add remote (use YOUR repo URL from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Verify:** Refresh GitHub page - you should see all your files

## Deployment to Vercel

### 4. Sign Up for Vercel (1 minute)

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Sign Up"
- [ ] Choose "Continue with GitHub"
- [ ] Authorize Vercel

### 5. Import Project (30 seconds)

- [ ] Click "Add New" → "Project"
- [ ] Find `smarttrade` in your repository list
- [ ] Click "Import"

### 6. Configure Environment Variables (1 minute)

**⚠️ IMPORTANT - Don't skip this step!**

In the deployment configuration screen:

- [ ] Click "Environment Variables" to expand
- [ ] Add variable:
  - **Name:** `NEXT_PUBLIC_FINNHUB_API_KEY`
  - **Value:** [Paste your Finnhub API key]
- [ ] Select ALL THREE environments:
  - [x] Production
  - [x] Preview
  - [x] Development

### 7. Deploy (3 minutes)

- [ ] Click "Deploy" button
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Watch the build logs (optional but cool 😎)

## Post-Deployment

### 8. Verify Deployment (1 minute)

- [ ] Click "Visit" when deployment completes
- [ ] App loads successfully
- [ ] Check navbar for API status badge
- [ ] Badge shows "🟢 Live Data" (not "Demo Mode")
- [ ] Try searching for a stock (e.g., "AAPL")
- [ ] Place a test trade

### 9. Test All Features (5 minutes)

- [ ] **Dashboard**
  - Portfolio shows ₹10,00,000 starting balance
  - Charts load properly
  - Top movers show real stocks

- [ ] **Trading**
  - Search works (try "TSLA", "MSFT")
  - Stock page loads with real price
  - Charts display properly
  - Can place buy/sell orders

- [ ] **Portfolio**
  - Shows positions after trading
  - P/L updates correctly
  - Allocation chart works

- [ ] **History**
  - Shows all trades
  - Can export to CSV
  - Filter works

- [ ] **Watchlist**
  - Can add/remove stocks
  - Prices update

- [ ] **Theme Toggle**
  - Dark/Light mode works
  - Preference saves

### 10. Mobile Testing (Optional)

- [ ] Open on mobile browser
- [ ] Navigation menu works
- [ ] Charts are readable
- [ ] Trading panel functional
- [ ] All pages responsive

## Troubleshooting

### Problem: Badge shows "Demo Mode"

**Solution:**
1. Go to Vercel Dashboard
2. Click your project → Settings → Environment Variables
3. Verify `NEXT_PUBLIC_FINNHUB_API_KEY` exists
4. Check value is correct (no extra spaces)
5. Ensure all 3 environments selected
6. Go to Deployments tab
7. Click ⋯ next to latest deployment
8. Click "Redeploy"

### Problem: Build Failed

**Solution:**
1. Check build logs for errors
2. Most common: Missing dependencies
3. Locally run `npm run build` to test
4. Fix any errors
5. Commit and push again

### Problem: 404 on Pages

**Solution:**
- This shouldn't happen with Next.js
- Verify `vercel.json` exists
- Try redeploying

### Problem: Slow API Responses

**Solution:**
- Finnhub free tier: 60 calls/min
- App has caching built-in
- Normal for first load
- Subsequent loads are faster

## Success Criteria

Your deployment is successful when:

✅ App loads at your Vercel URL  
✅ Badge shows "Live Data"  
✅ Can search and find stocks  
✅ Real prices shown  
✅ Can place trades  
✅ Portfolio updates correctly  
✅ All amounts in ₹ (INR)  
✅ Charts load with real data  
✅ Mobile responsive  

## Next Steps

### Share Your App

Your app is live at: `https://your-project-name.vercel.app`

- [ ] Share with friends
- [ ] Test with others
- [ ] Gather feedback

### Custom Domain (Optional)

- [ ] Go to Vercel → Settings → Domains
- [ ] Add your domain
- [ ] Configure DNS
- [ ] Wait for SSL (automatic)

### Automatic Updates

Every time you push to GitHub, Vercel auto-deploys:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel deploys automatically!
```

## Support

Need help?
- Check `VERCEL_DEPLOYMENT.md` for detailed guide
- Read `README.md` for feature documentation
- Visit [vercel.com/docs](https://vercel.com/docs)

---

## Final Checklist

- [ ] API key obtained
- [ ] Code on GitHub
- [ ] Deployed to Vercel
- [ ] Environment variable set
- [ ] Badge shows "Live Data"
- [ ] All features tested
- [ ] Mobile tested (optional)
- [ ] Shared with others (optional)

**🎉 Congratulations! Your SmartTrade app is live!**

URL: `_______________________________`

API Status: `[ ] Live Data  [ ] Demo Mode`

Deployment Date: `_______________`
