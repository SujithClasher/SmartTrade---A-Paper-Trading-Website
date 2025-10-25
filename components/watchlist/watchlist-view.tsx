'use client'

import * as React from 'react'
import { useTradingStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStockQuote, getMockQuote } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { StockQuote } from '@/lib/types'
import { TrendingUp, TrendingDown, X, Star, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { POPULAR_STOCKS } from '@/lib/constants'

export function WatchlistView() {
  const { watchlist, removeFromWatchlist, addToWatchlist } = useTradingStore()
  const [quotes, setQuotes] = React.useState<Record<string, StockQuote>>({})
  const [loading, setLoading] = React.useState(true)

  const fetchQuotes = React.useCallback(async () => {
    if (watchlist.length === 0) {
      setLoading(false)
      return
    }

    setLoading(true)
    const newQuotes: Record<string, StockQuote> = {}

    // Fetch quotes one at a time to avoid rate limits
    for (const item of watchlist) {
      try {
        const quote = await getStockQuote(item.symbol)
        newQuotes[item.symbol] = quote || getMockQuote(item.symbol)
        // Update state progressively
        setQuotes({...newQuotes})
      } catch {
        newQuotes[item.symbol] = getMockQuote(item.symbol)
        setQuotes({...newQuotes})
      }
    }

    setLoading(false)
  }, [watchlist])

  React.useEffect(() => {
    if (watchlist.length > 0) {
      fetchQuotes()
    } else {
      setLoading(false)
    }
  }, [watchlist.length, fetchQuotes])

  const handleRemove = (symbol: string) => {
    removeFromWatchlist(symbol)
  }

  const handleAddPopular = (symbol: string) => {
    addToWatchlist(symbol)
  }

  const popularNotInWatchlist = POPULAR_STOCKS.filter(
    (symbol) => !watchlist.some((w) => w.symbol === symbol)
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Watchlist</h1>
          <p className="text-muted-foreground mt-1">
            Track your favorite stocks
          </p>
        </div>
        {watchlist.length > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={fetchQuotes}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      {/* Watchlist */}
      {watchlist.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Watchlist ({watchlist.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {watchlist.map((item) => {
                const quote = quotes[item.symbol]
                return (
                  <div
                    key={item.symbol}
                    className="relative p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => handleRemove(item.symbol)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <Link href={`/trade/${item.symbol}`}>
                      <div className="space-y-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="font-semibold text-lg">{item.symbol}</span>
                        </div>

                        {quote ? (
                          <>
                            <div className="text-2xl font-bold">
                              {formatCurrency(quote.price)}
                            </div>
                            <div className="flex items-center gap-2">
                              {quote.changePercent >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-success" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-danger" />
                              )}
                              <div className={`text-sm ${quote.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                {formatCurrency(Math.abs(quote.change))} ({formatPercentage(quote.changePercent)})
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground">Loading...</div>
                        )}
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Stocks in Watchlist</h2>
              <p className="text-muted-foreground mb-4">
                Add stocks to track their performance
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Stocks */}
      {popularNotInWatchlist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularNotInWatchlist.slice(0, 10).map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  onClick={() => handleAddPopular(symbol)}
                  className="gap-2"
                >
                  <Star className="h-4 w-4" />
                  {symbol}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
