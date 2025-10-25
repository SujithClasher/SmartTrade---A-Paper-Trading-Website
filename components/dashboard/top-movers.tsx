'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStockQuote, getMockQuote } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { StockQuote } from '@/lib/types'

interface TopMoversProps {
  stocks: string[]
}

export function TopMovers({ stocks }: TopMoversProps) {
  const [quotes, setQuotes] = React.useState<StockQuote[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    const fetchQuotes = async () => {
      setLoading(true)
      const quotesData: StockQuote[] = []

      // Limit to first 6 stocks to reduce API calls
      const limitedStocks = stocks.slice(0, 6)

      // Fetch quotes with controlled concurrency
      for (const symbol of limitedStocks) {
        if (!mounted) break

        try {
          const quote = await getStockQuote(symbol)
          if (quote && mounted) {
            quotesData.push(quote)
          } else if (mounted) {
            quotesData.push(getMockQuote(symbol))
          }
        } catch {
          if (mounted) {
            quotesData.push(getMockQuote(symbol))
          }
        }

        // Update state progressively for better UX
        if (mounted) {
          setQuotes([...quotesData])
        }
      }

      // Sort by absolute change percent
      if (mounted) {
        quotesData.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        setQuotes(quotesData)
        setLoading(false)
      }
    }

    fetchQuotes()

    return () => {
      mounted = false
    }
  }, [stocks])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Movers</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quotes.map((quote) => (
            <Link key={quote.symbol} href={`/trade/${quote.symbol}`}>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  {quote.changePercent >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-danger" />
                  )}
                  <div>
                    <div className="font-medium">{quote.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(quote.price)}
                    </div>
                  </div>
                </div>
                <Badge variant={quote.changePercent >= 0 ? 'success' : 'danger'}>
                  {formatPercentage(quote.changePercent)}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
