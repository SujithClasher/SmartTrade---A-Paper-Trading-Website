export type OrderType = 'market' | 'limit' | 'stop'
export type OrderSide = 'buy' | 'sell'
export type OrderStatus = 'pending' | 'filled' | 'cancelled'

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  open: number
  high: number
  low: number
  volume: number
  marketCap?: number
  timestamp: number
}

export interface StockCandle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Position {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  totalValue: number
  totalCost: number
  unrealizedPL: number
  unrealizedPLPercent: number
  lastUpdated: number
}

export interface Trade {
  id: string
  symbol: string
  type: OrderType
  side: OrderSide
  quantity: number
  price: number
  limitPrice?: number
  stopPrice?: number
  status: OrderStatus
  timestamp: number
  commission: number
  total: number
}

export interface Portfolio {
  cash: number
  totalValue: number
  positions: Position[]
  dayChange: number
  dayChangePercent: number
  totalPL: number
  totalPLPercent: number
}

export interface WatchlistItem {
  symbol: string
  addedAt: number
}

export interface CompanyProfile {
  symbol: string
  name: string
  description?: string
  sector?: string
  industry?: string
  logo?: string
}

export interface ChartDataPoint {
  timestamp: number
  value: number
}

export interface PortfolioHistory {
  timestamp: number
  value: number
}
