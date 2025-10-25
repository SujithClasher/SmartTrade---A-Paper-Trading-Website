import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Portfolio, Trade, Position, WatchlistItem, OrderType, OrderSide } from './types'
import { INITIAL_CASH, COMMISSION_RATE, SLIPPAGE_RATE } from './constants'

interface TradingStore {
  portfolio: Portfolio
  trades: Trade[]
  watchlist: WatchlistItem[]
  
  // Actions
  executeTrade: (
    symbol: string,
    side: OrderSide,
    quantity: number,
    price: number,
    type: OrderType,
    limitPrice?: number,
    stopPrice?: number
  ) => string | null
  updatePositionPrices: (symbol: string, currentPrice: number) => void
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  resetPortfolio: () => void
  calculatePortfolioValue: () => void
}

const initialPortfolio: Portfolio = {
  cash: INITIAL_CASH,
  totalValue: INITIAL_CASH,
  positions: [],
  dayChange: 0,
  dayChangePercent: 0,
  totalPL: 0,
  totalPLPercent: 0,
}

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      portfolio: initialPortfolio,
      trades: [],
      watchlist: [],

      executeTrade: (symbol, side, quantity, price, type, limitPrice, stopPrice) => {
        const state = get()
        const commission = price * quantity * COMMISSION_RATE
        const slippage = type === 'market' ? price * quantity * SLIPPAGE_RATE : 0
        const effectivePrice = side === 'buy' 
          ? price * (1 + (type === 'market' ? SLIPPAGE_RATE : 0))
          : price * (1 - (type === 'market' ? SLIPPAGE_RATE : 0))
        
        const total = effectivePrice * quantity + commission

        if (side === 'buy') {
          // Check if enough cash
          if (state.portfolio.cash < total) {
            return null
          }

          // Create new trade
          const trade: Trade = {
            id: `${Date.now()}-${Math.random()}`,
            symbol,
            type,
            side,
            quantity,
            price: effectivePrice,
            limitPrice,
            stopPrice,
            status: 'filled',
            timestamp: Date.now(),
            commission,
            total,
          }

          // Update or create position
          const existingPosition = state.portfolio.positions.find(p => p.symbol === symbol)
          let newPositions: Position[]

          if (existingPosition) {
            const newQuantity = existingPosition.quantity + quantity
            const newTotalCost = existingPosition.totalCost + total
            const newAveragePrice = newTotalCost / newQuantity

            newPositions = state.portfolio.positions.map(p =>
              p.symbol === symbol
                ? {
                    ...p,
                    quantity: newQuantity,
                    averagePrice: newAveragePrice,
                    totalCost: newTotalCost,
                    currentPrice: effectivePrice,
                    totalValue: effectivePrice * newQuantity,
                    unrealizedPL: (effectivePrice - newAveragePrice) * newQuantity,
                    unrealizedPLPercent: ((effectivePrice - newAveragePrice) / newAveragePrice) * 100,
                    lastUpdated: Date.now(),
                  }
                : p
            )
          } else {
            const newPosition: Position = {
              symbol,
              quantity,
              averagePrice: effectivePrice,
              currentPrice: effectivePrice,
              totalValue: effectivePrice * quantity,
              totalCost: total,
              unrealizedPL: 0,
              unrealizedPLPercent: 0,
              lastUpdated: Date.now(),
            }
            newPositions = [...state.portfolio.positions, newPosition]
          }

          set({
            portfolio: {
              ...state.portfolio,
              cash: state.portfolio.cash - total,
              positions: newPositions,
            },
            trades: [trade, ...state.trades],
          })

          get().calculatePortfolioValue()
          return trade.id
        } else {
          // Sell logic
          const position = state.portfolio.positions.find(p => p.symbol === symbol)
          if (!position || position.quantity < quantity) {
            return null
          }

          const trade: Trade = {
            id: `${Date.now()}-${Math.random()}`,
            symbol,
            type,
            side,
            quantity,
            price: effectivePrice,
            limitPrice,
            stopPrice,
            status: 'filled',
            timestamp: Date.now(),
            commission,
            total: effectivePrice * quantity - commission,
          }

          const newQuantity = position.quantity - quantity
          let newPositions: Position[]

          if (newQuantity === 0) {
            newPositions = state.portfolio.positions.filter(p => p.symbol !== symbol)
          } else {
            newPositions = state.portfolio.positions.map(p =>
              p.symbol === symbol
                ? {
                    ...p,
                    quantity: newQuantity,
                    totalValue: effectivePrice * newQuantity,
                    totalCost: p.averagePrice * newQuantity,
                    unrealizedPL: (effectivePrice - p.averagePrice) * newQuantity,
                    unrealizedPLPercent: ((effectivePrice - p.averagePrice) / p.averagePrice) * 100,
                    lastUpdated: Date.now(),
                  }
                : p
            )
          }

          set({
            portfolio: {
              ...state.portfolio,
              cash: state.portfolio.cash + (effectivePrice * quantity - commission),
              positions: newPositions,
            },
            trades: [trade, ...state.trades],
          })

          get().calculatePortfolioValue()
          return trade.id
        }
      },

      updatePositionPrices: (symbol, currentPrice) => {
        const state = get()
        const newPositions = state.portfolio.positions.map(p =>
          p.symbol === symbol
            ? {
                ...p,
                currentPrice,
                totalValue: currentPrice * p.quantity,
                unrealizedPL: (currentPrice - p.averagePrice) * p.quantity,
                unrealizedPLPercent: ((currentPrice - p.averagePrice) / p.averagePrice) * 100,
                lastUpdated: Date.now(),
              }
            : p
        )

        set({
          portfolio: {
            ...state.portfolio,
            positions: newPositions,
          },
        })

        get().calculatePortfolioValue()
      },

      calculatePortfolioValue: () => {
        const state = get()
        const positionsValue = state.portfolio.positions.reduce(
          (sum, p) => sum + p.totalValue,
          0
        )
        const totalValue = state.portfolio.cash + positionsValue
        const totalPL = state.portfolio.positions.reduce((sum, p) => sum + p.unrealizedPL, 0)
        const totalInvested = state.portfolio.positions.reduce((sum, p) => sum + p.totalCost, 0)
        const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0

        set({
          portfolio: {
            ...state.portfolio,
            totalValue,
            totalPL,
            totalPLPercent,
          },
        })
      },

      addToWatchlist: (symbol) => {
        const state = get()
        if (!state.watchlist.find(w => w.symbol === symbol)) {
          set({
            watchlist: [...state.watchlist, { symbol, addedAt: Date.now() }],
          })
        }
      },

      removeFromWatchlist: (symbol) => {
        const state = get()
        set({
          watchlist: state.watchlist.filter(w => w.symbol !== symbol),
        })
      },

      resetPortfolio: () => {
        set({
          portfolio: initialPortfolio,
          trades: [],
        })
      },
    }),
    {
      name: 'smarttrade-storage',
    }
  )
)
