# SmartTrade - Paper Trading Simulator 🇮🇳

A fully functional, production-quality web application for paper trading (simulated stock trading) built with Next.js 14+, TypeScript, and TailwindCSS. Trade real stocks with virtual money (₹10,00,000) in a risk-free environment.

**Currency: Indian Rupees (₹)** | **Real-Time Data** | **Vercel Ready**

![SmartTrade](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-06B6D4?style=flat&logo=tailwindcss)

## Features

- **📊 Real-Time Stock Data**: Live stock quotes and historical data via Finnhub API
- **💰 Virtual Trading**: ₹10,00,000 (10 Lakhs) starting balance to practice trading
- **📈 Multiple Order Types**: Market, Limit, and Stop orders
- **📱 Responsive Design**: Mobile-first, works on all devices
- **🌓 Dark/Light Theme**: Toggle between themes with system preference support
- **📉 Advanced Charts**: Interactive candlestick and line charts with multiple timeframes
- **💼 Portfolio Management**: Track positions, P/L, and performance
- **📝 Trade History**: Complete transaction history with CSV export
- **⭐ Watchlist**: Monitor your favorite stocks
- **🔍 Stock Search**: Quick search with autocomplete
- **💾 Persistent Storage**: All data saved in browser localStorage
- **🕒 Market Hours**: Real-time market status indicator
- **💸 Realistic Simulation**: Includes commission fees (0.1%) and slippage (0.05%)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Charts**: Recharts
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **API**: Finnhub (free tier)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Finnhub API key (free tier available at [finnhub.io](https://finnhub.io/register))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smartTrade
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FINNHUB_API_KEY=your_api_key_here
   ```

   Get your free API key from [Finnhub](https://finnhub.io/register)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
smartTrade/
├── app/                      # Next.js app router pages
│   ├── page.tsx             # Dashboard
│   ├── portfolio/           # Portfolio page
│   ├── history/             # Trade history
│   ├── watchlist/           # Watchlist page
│   └── trade/[symbol]/      # Individual stock trading page
├── components/              # React components
│   ├── ui/                  # shadcn/ui base components
│   ├── dashboard/           # Dashboard components
│   ├── trade/               # Trading components
│   ├── portfolio/           # Portfolio components
│   ├── history/             # History components
│   └── watchlist/           # Watchlist components
├── lib/                     # Utilities and business logic
│   ├── api.ts              # Stock API integration
│   ├── store.ts            # Zustand state management
│   ├── types.ts            # TypeScript type definitions
│   ├── utils.ts            # Utility functions
│   └── constants.ts        # App constants
└── public/                 # Static assets
```

## How to Use

### 1. Dashboard
- View portfolio summary and performance
- See top movers and recent trades
- Quick access to popular stocks

### 2. Trading
- Search for any stock using the search bar
- View real-time price, charts, and company info
- Place Market, Limit, or Stop orders
- Buy or sell shares with instant execution

### 3. Portfolio
- Track all your positions
- View allocation pie chart
- Monitor unrealized P/L
- Refresh prices in real-time

### 4. Trade History
- See all past transactions
- Filter by buy/sell
- Search by symbol
- Export to CSV

### 5. Watchlist
- Add stocks to monitor
- Track price changes
- Quick access to trading

## API Integration

This app uses the Finnhub API for stock data. The free tier includes:
- Real-time stock quotes (60 API calls/minute)
- Historical stock candles
- Company profiles
- Stock search

If API rate limits are reached, the app falls back to mock data for demonstration purposes.

## Deployment

### Deploy to Vercel (Recommended)

#### Step-by-Step Deployment:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_FINNHUB_API_KEY` | Your Finnhub API key | Production, Preview, Development |

   **Get API Key:** Visit [finnhub.io/register](https://finnhub.io/register) (FREE)

4. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `your-project.vercel.app`

5. **Verify API Connection**
   - Open your deployed app
   - Check the badge in navbar (should show "Live Data")
   - If it shows "Demo Mode", verify your API key is set correctly

#### Automatic Deployments
Every push to `main` branch will automatically deploy to Vercel!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Build for Production

```bash
npm run build
npm start
```

## Features in Detail

### Currency Format
All amounts are displayed in **Indian Rupees (₹)** with Indian number formatting (Lakhs/Crores).

Example: ₹10,00,000 (10 Lakhs)

### Order Types

- **Market Order**: Executes immediately at current price (includes 0.05% slippage)
- **Limit Order**: Executes when price reaches your specified limit
- **Stop Order**: Triggers when price reaches your stop price

### Commission Structure

- **Trading Fee**: 0.1% per trade (realistic brokerage simulation)
- **Slippage**: 0.05% on market orders only

### Real-Time Data

When API key is configured:
- ✅ Live stock quotes (updated every 30 seconds)
- ✅ Real historical price data
- ✅ Actual company information
- ✅ Stock search with real results

Without API key:
- ⚠️ Demo mode with simulated data
- ⚠️ All features work, but data is not real

### Data Persistence

All data is stored in browser localStorage:
- Portfolio positions
- Trade history
- Watchlist
- Cash balance

**Note**: Clearing browser data will reset your portfolio.

## Performance

- Lighthouse Score: 90+
- Fully optimized for production
- Code splitting and lazy loading
- Responsive images and assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Important Notes

### API Key Status
The app displays an API status badge in the navbar:
- **🟢 Live Data**: API key configured, real-time data active
- **⚪ Demo Mode**: No API key, using simulated data

Click the badge to see setup instructions if needed.

### Vercel Deployment
The app is **100% compatible** with Vercel's free tier:
- No backend required
- No database needed
- All data stored in browser localStorage
- Environment variables supported
- Auto-deploy on git push

### Currency
All trading is in **Indian Rupees (₹)**. US stock prices are shown as-is from the API (in USD), but your portfolio value and all calculations are in INR for consistency.

## Disclaimer

This is a paper trading simulator for educational purposes only. No real money is involved. Past performance does not guarantee future results. This is not financial advice. Stock prices shown are from US markets.

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include browser console logs if applicable

## Roadmap

Future enhancements:
- [ ] Advanced chart indicators (RSI, MACD, Bollinger Bands)
- [ ] Options trading simulation
- [ ] Social sharing of trades
- [ ] Leaderboards and competitions
- [ ] News integration
- [ ] Portfolio analytics and insights
- [ ] Multiple portfolio support
- [ ] Cryptocurrency trading

---

Built with ❤️ using Next.js and TypeScript
