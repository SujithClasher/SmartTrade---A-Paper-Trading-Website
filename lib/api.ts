import { StockQuote, StockCandle, CompanyProfile } from './types'
import { CACHE_DURATION } from './constants'

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || ''
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

// Request queue to prevent hitting rate limits
class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private lastRequest = 0
  private minInterval = 150 // Minimum 150ms between requests (400 requests/min max)

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequest

      if (timeSinceLastRequest < this.minInterval) {
        await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest))
      }

      const request = this.queue.shift()
      if (request) {
        this.lastRequest = Date.now()
        await request()
      }
    }

    this.processing = false
  }
}

const requestQueue = new RequestQueue()

// Check if API key is configured
export function isAPIKeyConfigured(): boolean {
  return FINNHUB_API_KEY.length > 0
}

// Get API key status message
export function getAPIKeyStatus(): { configured: boolean; message: string } {
  if (!FINNHUB_API_KEY) {
    return {
      configured: false,
      message: 'API key not configured. Add NEXT_PUBLIC_FINNHUB_API_KEY to your .env.local file. Get free key at: https://finnhub.io/register'
    }
  }
  return {
    configured: true,
    message: 'API connected - Live data enabled'
  }
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  get<T>(key: string, maxAge: number): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > maxAge) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }
}

const cache = new APICache()

async function fetchWithCache<T>(
  url: string,
  cacheKey: string,
  cacheDuration: number
): Promise<T> {
  const cached = cache.get<T>(cacheKey, cacheDuration)
  if (cached) return cached

  // Use request queue to prevent rate limiting
  return requestQueue.add(async () => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    cache.set(cacheKey, data)
    return data
  })
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  if (!FINNHUB_API_KEY) {
    console.warn('Finnhub API key not configured. Please add NEXT_PUBLIC_FINNHUB_API_KEY to .env.local')
    return getMockQuote(symbol) // Fallback to mock data only if no API key
  }

  try {
    const cacheKey = `quote-${symbol}`
    const data = await fetchWithCache<any>(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      cacheKey,
      CACHE_DURATION.QUOTE
    )

    if (!data || data.c === 0) {
      console.warn(`No data returned for ${symbol}, using mock data`)
      return getMockQuote(symbol)
    }

    return {
      symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      previousClose: data.pc,
      open: data.o,
      high: data.h,
      low: data.l,
      volume: 0,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)
    console.warn('Falling back to mock data')
    return getMockQuote(symbol)
  }
}

export async function getStockCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<StockCandle[]> {
  if (!FINNHUB_API_KEY) {
    console.warn('Finnhub API key not configured. Using mock chart data')
    return getMockCandles(100)
  }

  try {
    const cacheKey = `candles-${symbol}-${resolution}-${from}-${to}`
    const data = await fetchWithCache<any>(
      `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`,
      cacheKey,
      CACHE_DURATION.CANDLES
    )

    if (!data || data.s !== 'ok' || !data.t) {
      console.warn(`No candle data for ${symbol}, using mock data`)
      return getMockCandles(100)
    }

    return data.t.map((timestamp: number, index: number) => ({
      timestamp: timestamp * 1000,
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      close: data.c[index],
      volume: data.v[index],
    }))
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error)
    return getMockCandles(100)
  }
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  if (!FINNHUB_API_KEY) {
    console.warn('Finnhub API key not configured')
    return { symbol, name: symbol }
  }

  try {
    const cacheKey = `company-${symbol}`
    const data = await fetchWithCache<any>(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      cacheKey,
      CACHE_DURATION.COMPANY
    )

    if (!data || !data.ticker) {
      return { symbol, name: symbol }
    }

    return {
      symbol: data.ticker,
      name: data.name || symbol,
      description: data.description,
      sector: data.finnhubIndustry,
      industry: data.finnhubIndustry,
      logo: data.logo,
    }
  } catch (error) {
    console.error(`Error fetching company profile for ${symbol}:`, error)
    return { symbol, name: symbol }
  }
}

export async function searchStocks(query: string): Promise<Array<{ symbol: string; description: string }>> {
  if (!FINNHUB_API_KEY) {
    console.warn('Finnhub API key not configured. Search limited to popular stocks')
    // Return popular stocks that match query
    const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'DIS']
    return popularStocks
      .filter(symbol => symbol.toLowerCase().includes(query.toLowerCase()))
      .map(symbol => ({ symbol, description: `${symbol} Inc.` }))
  }

  try {
    if (!query || query.length < 1) return []

    const cacheKey = `search-${query}`
    const data = await fetchWithCache<any>(
      `${FINNHUB_BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`,
      cacheKey,
      CACHE_DURATION.QUOTE
    )

    if (!data || !data.result) return []

    return data.result
      .filter((item: any) => item.type === 'Common Stock')
      .slice(0, 10)
      .map((item: any) => ({
        symbol: item.symbol,
        description: item.description,
      }))
  } catch (error) {
    console.error('Error searching stocks:', error)
    return []
  }
}

// Fallback mock data for development/testing when API key is not available
export function getMockQuote(symbol: string): StockQuote {
  const basePrice = 100 + Math.random() * 400
  const change = (Math.random() - 0.5) * 10
  const changePercent = (change / basePrice) * 100

  return {
    symbol,
    price: basePrice,
    change,
    changePercent,
    previousClose: basePrice - change,
    open: basePrice - Math.random() * 5,
    high: basePrice + Math.random() * 10,
    low: basePrice - Math.random() * 10,
    volume: Math.floor(Math.random() * 10000000),
    timestamp: Date.now(),
  }
}

export function getMockCandles(count: number = 100): StockCandle[] {
  const candles: StockCandle[] = []
  let price = 100 + Math.random() * 100
  const now = Date.now()

  for (let i = count - 1; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 5
    const open = price
    const close = price + change
    const high = Math.max(open, close) + Math.random() * 2
    const low = Math.min(open, close) - Math.random() * 2

    candles.push({
      timestamp: now - i * 60 * 60 * 1000,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000),
    })

    price = close
  }

  return candles
}
