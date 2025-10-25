export const INITIAL_CASH = 1000000 // ₹10,00,000 (10 lakhs)
export const COMMISSION_RATE = 0.001 // 0.1% commission per trade
export const SLIPPAGE_RATE = 0.0005 // 0.05% slippage for market orders

export const POPULAR_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
  'META', 'NVDA', 'AMD', 'NFLX', 'DIS',
  'SPY', 'QQQ', 'VOO', 'VTI', 'ARKK'
]

export const TIMEFRAMES = {
  '1D': { label: '1 Day', resolution: '5', days: 1 },
  '5D': { label: '5 Days', resolution: '30', days: 5 },
  '1M': { label: '1 Month', resolution: '60', days: 30 },
  '3M': { label: '3 Months', resolution: 'D', days: 90 },
  '6M': { label: '6 Months', resolution: 'D', days: 180 },
  '1Y': { label: '1 Year', resolution: 'D', days: 365 },
  '5Y': { label: '5 Years', resolution: 'W', days: 1825 },
}

export const CACHE_DURATION = {
  QUOTE: 2 * 60 * 1000, // 2 minutes (increased for better performance)
  CANDLES: 10 * 60 * 1000, // 10 minutes (increased for better performance)
  COMPANY: 24 * 60 * 60 * 1000, // 24 hours
  SEARCH: 5 * 60 * 1000, // 5 minutes
}
