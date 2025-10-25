'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStockQuote, getCompanyProfile, getMockQuote } from '@/lib/api'
import { formatCurrency, formatPercentage, getMarketStatus } from '@/lib/utils'
import { StockQuote, CompanyProfile } from '@/lib/types'
import { TrendingUp, TrendingDown, Loader2, Star, ArrowLeft } from 'lucide-react'
import { useTradingStore } from '@/lib/store'
import { StockChart } from '@/components/trade/stock-chart'
import { TradingPanel } from '@/components/trade/trading-panel'
import { CompanyInfo } from '@/components/trade/company-info'
import { useRouter } from 'next/navigation'

interface TradeViewProps {
  symbol: string
}

export function TradeView({ symbol }: TradeViewProps) {
  const router = useRouter()
  const { watchlist, addToWatchlist, removeFromWatchlist } = useTradingStore()
  const [quote, setQuote] = React.useState<StockQuote | null>(null)
  const [company, setCompany] = React.useState<CompanyProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [marketStatus, setMarketStatus] = React.useState(getMarketStatus())

  const isInWatchlist = watchlist.some((w) => w.symbol === symbol)

  React.useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch quote first (most important)
        const quoteData = await getStockQuote(symbol)
        if (mounted) {
          setQuote(quoteData || getMockQuote(symbol))
          setLoading(false) // Show quote immediately
        }

        // Fetch company profile after quote (less important)
        const companyData = await getCompanyProfile(symbol)
        if (mounted) {
          setCompany(companyData)
        }
      } catch (error) {
        console.error('Error fetching stock data:', error)
        if (mounted) {
          setQuote(getMockQuote(symbol))
          setLoading(false)
        }
      }
    }

    fetchData()

    // Refresh quote every 2 minutes (reduced frequency)
    const interval = setInterval(async () => {
      if (!mounted) return
      const quoteData = await getStockQuote(symbol)
      if (quoteData && mounted) setQuote(quoteData)
    }, 120000) // 2 minutes instead of 30 seconds

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [symbol])

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(symbol)
    } else {
      addToWatchlist(symbol)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Stock Not Found</h2>
              <p className="text-muted-foreground mb-4">
                Unable to find data for {symbol}
              </p>
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{symbol}</h1>
                <Badge variant={marketStatus.isOpen ? 'success' : 'outline'}>
                  {marketStatus.message}
                </Badge>
              </div>
              {company && (
                <p className="text-lg text-muted-foreground">{company.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <div className="text-4xl font-bold">{formatCurrency(quote.price)}</div>
            <div className={`flex items-center gap-1 text-lg ${quote.change >= 0 ? 'text-success' : 'text-danger'}`}>
              {quote.change >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span>{formatCurrency(Math.abs(quote.change))}</span>
              <span>({formatPercentage(quote.changePercent)})</span>
            </div>
          </div>
        </div>

        <Button
          variant={isInWatchlist ? 'secondary' : 'outline'}
          onClick={handleWatchlistToggle}
        >
          <Star className={`h-4 w-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
          {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StockChart symbol={symbol} />
          {company && <CompanyInfo company={company} />}
        </div>

        <div>
          <TradingPanel symbol={symbol} currentPrice={quote.price} />
        </div>
      </div>
    </div>
  )
}
