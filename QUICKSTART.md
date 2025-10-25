# SmartTrade - Quick Start Guide 🇮🇳

## ✅ Setup Complete!

Your SmartTrade paper trading simulator is ready to use. The development server is running at:
**http://localhost:3000**

**Currency:** All amounts in Indian Rupees (₹)  
**Starting Balance:** ₹10,00,000 (10 Lakhs)

---

## 🚀 What You Can Do Right Now

### Without API Key (Mock Data Mode)
The app works out of the box with simulated data. You can:
- ✅ Browse the dashboard
- ✅ Place trades (buy/sell)
- ✅ View portfolio
- ✅ Track watchlist
- ✅ See trade history
- ✅ Export to CSV

### With Real Data (Recommended)

1. **Get a FREE Finnhub API Key**
   - Visit: https://finnhub.io/register
   - Sign up (takes 30 seconds)
   - Copy your API key

2. **Add API Key to Project**
   - Open `.env.local` file
   - Replace the placeholder:
     ```
     NEXT_PUBLIC_FINNHUB_API_KEY=your_actual_key_here
     ```
   - Save the file
   - Restart the dev server: `Ctrl+C` then `npm run dev`

3. **Enjoy Real-Time Stock Data!**
   - Live stock quotes
   - Historical charts
   - Company information
   - Stock search

---

## 📱 App Features Overview

### 1. **Dashboard** (`/`)
- Portfolio summary with total value, cash, positions
- Portfolio performance chart
- Top movers section
- Recent trades
- Quick links to popular stocks

### 2. **Trade Page** (`/trade/[symbol]`)
- Real-time stock price and company info
- Interactive price charts (line & candlestick)
- Trading panel with 3 order types:
  - **Market Order**: Execute immediately
  - **Limit Order**: Set your price
  - **Stop Order**: Set stop-loss price
- Buy/Sell with instant confirmation

### 3. **Portfolio** (`/portfolio`)
- All your positions at a glance
- Unrealized P/L tracking
- Allocation pie chart
- Position details (avg price, current price, quantity)

### 4. **Trade History** (`/history`)
- Complete transaction log
- Filter by buy/sell
- Search by symbol
- Export to CSV for analysis

### 5. **Watchlist** (`/watchlist`)
- Track favorite stocks
- Real-time price updates
- Quick access to trading
- Add/remove stocks easily

---

## 💡 How to Use

### Making Your First Trade

1. **Find a Stock**
   - Click search icon in navbar OR
   - Click a popular stock on dashboard OR
   - Type in search bar (e.g., "AAPL", "TSLA")

2. **Analyze**
   - View current price and charts
   - Check company information
   - Review market status (open/closed)

3. **Place Order**
   - Choose Buy or Sell
   - Select order type (Market/Limit/Stop)
   - Enter quantity
   - Review estimated total
   - Click Buy/Sell button
   - Confirm in dialog

4. **Track Performance**
   - View position in Portfolio
   - Monitor P/L in real-time
   - Check trade in History

---

## 🎨 UI Features

- **Dark/Light Mode**: Toggle in navbar (follows system preference)
- **Mobile Responsive**: Works on all devices
- **Real-Time Updates**: Prices refresh automatically
- **Market Hours Indicator**: Shows if market is open/closed
- **Smooth Animations**: Professional trading platform feel

---

## 💾 Data Persistence

All your data is saved in browser localStorage:
- Portfolio positions
- Cash balance
- Trade history
- Watchlist

**Note**: Data persists across sessions but will be lost if you:
- Clear browser data
- Use incognito/private mode
- Switch browsers

**Reset Portfolio**: To start fresh, clear browser localStorage or use a different browser.

---

## 📊 Trading Mechanics

### Starting Balance
- ₹10,00,000 (10 Lakhs) in virtual cash
- All amounts displayed in Indian Rupees with Indian number formatting

### Fees & Costs
- **Commission**: 0.1% per trade
- **Slippage**: 0.05% on market orders only

### Order Types Explained

**Market Order**
- Executes immediately at current price
- Includes small slippage simulation
- Best for: Quick entry/exit

**Limit Order**  
- Only executes at your specified price or better
- No slippage
- Best for: Getting specific price points

**Stop Order**
- Triggers when price hits your stop price
- Converts to market order when triggered
- Best for: Stop-loss protection

---

## 🔍 Tips & Tricks

1. **Use the Watchlist**: Track stocks before buying
2. **Check Charts**: Review multiple timeframes (1D-5Y)
3. **Diversify**: Don't put all cash in one stock
4. **Monitor P/L**: Track performance in portfolio
5. **Export History**: Analyze your trading patterns via CSV
6. **Learn Order Types**: Practice with limit and stop orders

---

## 🛠️ Troubleshooting

**Stock data not loading?**
- Check if API key is set in `.env.local`
- Verify API key is valid at finnhub.io
- Check rate limits (60 calls/min on free tier)
- App falls back to mock data if API fails

**Trade not executing?**
- Ensure you have enough cash (for buys)
- Check you own enough shares (for sells)
- Verify quantity is valid

**Data disappeared?**
- Check if browser data was cleared
- Try different browser if needed
- Data is stored locally, not in cloud

---

## 🚀 Deploy to Vercel (Recommended)

### Why Vercel?
- ✅ **100% FREE** for this project
- ✅ **Auto-deploy** on every git push
- ✅ **Lightning fast** global CDN
- ✅ **No configuration** needed
- ✅ **HTTPS** included

### Step-by-Step Deployment:

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SmartTrade app"
   git branch -M main
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/smarttrade.git
   git push -u origin main
   ```

2. **Sign Up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (takes 30 seconds)

3. **Import Project**
   - Click "Add New Project"
   - Select your `smarttrade` repository
   - Click "Import"

4. **Add Environment Variable**
   
   **IMPORTANT:** Add this before deploying:
   
   - In the deployment screen, expand "Environment Variables"
   - Add:
     - **Name:** `NEXT_PUBLIC_FINNHUB_API_KEY`
     - **Value:** Your Finnhub API key
     - **Environment:** Production, Preview, Development (select all)
   
   Don't have an API key? Get one free at [finnhub.io/register](https://finnhub.io/register)

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✨ Your app is LIVE!

6. **Access Your App**
   - Vercel provides URL: `your-project-name.vercel.app`
   - Share with friends!
   - Every git push auto-deploys

### Check API Status
After deployment, look for the badge in navbar:
- **🟢 Live Data** = API connected ✅
- **⚪ Demo Mode** = API key missing (click badge for help)

### Custom Domain (Optional)
Add your own domain in Vercel dashboard → Settings → Domains

---

## 📚 Learn More

- **Next.js Docs**: https://nextjs.org/docs
- **Finnhub API**: https://finnhub.io/docs/api
- **TailwindCSS**: https://tailwindcss.com/docs

---

## 🎯 What's Next?

Try these activities:
1. Trade your first stock
2. Build a diversified portfolio
3. Track performance over time
4. Experiment with different order types
5. Use charts to make decisions
6. Export and analyze your trading history

---

**Happy Trading! 📈**

Remember: This is a simulation for learning purposes. Practice risk-free!
