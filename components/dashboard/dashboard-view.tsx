'use client'

import * as React from 'react'
import { useTradingStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercentage, getMarketStatus } from '@/lib/utils'
import { POPULAR_STOCKS } from '@/lib/constants'
import { getStockQuote, getMockQuote } from '@/lib/api'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, RefreshCw, Wallet, Target, BarChart3 } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import Link from 'next/link'
import { PortfolioChart } from '@/components/dashboard/portfolio-chart'
import { TopMovers } from '@/components/dashboard/top-movers'
import { RecentTrades } from '@/components/dashboard/recent-trades'

export function DashboardView() {
  const { portfolio, calculatePortfolioValue } = useTradingStore()
  const [marketStatus, setMarketStatus] = React.useState(getMarketStatus())
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    calculatePortfolioValue()
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [calculatePortfolioValue])

  const handleRefresh = async () => {
    if (loading) return // Prevent multiple simultaneous refreshes
    
    setLoading(true)
    // Update all position prices sequentially to avoid rate limits
    for (const position of portfolio.positions) {
      try {
        const quote = await getStockQuote(position.symbol)
        if (quote) {
          useTradingStore.getState().updatePositionPrices(position.symbol, quote.price)
        }
      } catch (error) {
        console.error(`Error updating ${position.symbol}:`, error)
      }
    }
    setLoading(false)
  }

  const positionsValue = portfolio.positions.reduce((sum, p) => sum + p.totalValue, 0)
  const cashPercent = portfolio.totalValue > 0 ? (portfolio.cash / portfolio.totalValue) * 100 : 0
  const positionsPercent = portfolio.totalValue > 0 ? (positionsValue / portfolio.totalValue) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your trading portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={marketStatus.isOpen ? 'success' : 'outline'}>
            {marketStatus.message}
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Value"
          value={formatCurrency(portfolio.totalValue)}
          change={`${formatCurrency(portfolio.totalPL)} (${formatPercentage(portfolio.totalPLPercent)})`}
          changeType={portfolio.totalPL >= 0 ? 'positive' : 'negative'}
          icon={BarChart3}
          gradient="from-blue-500/10 to-blue-600/5"
        />
        
        <StatsCard
          title="Available Cash"
          value={formatCurrency(portfolio.cash)}
          description={`${cashPercent.toFixed(1)}% of portfolio`}
          icon={Wallet}
          gradient="from-green-500/10 to-green-600/5"
        />
        
        <StatsCard
          title="Positions Value"
          value={formatCurrency(positionsValue)}
          description={`${positionsPercent.toFixed(1)}% of portfolio`}
          icon={Target}
          gradient="from-purple-500/10 to-purple-600/5"
        />
        
        <StatsCard
          title="Active Positions"
          value={portfolio.positions.length.toString()}
          description="View all positions"
          icon={Activity}
          gradient="from-orange-500/10 to-orange-600/5"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PortfolioChart />
        <TopMovers stocks={POPULAR_STOCKS.slice(0, 6)} />
      </div>

      {/* Recent Trades */}
      <RecentTrades limit={5} />

      {/* Quick Actions */}
      {portfolio.positions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You haven&apos;t made any trades yet. Start by exploring popular stocks or searching for a specific company.
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_STOCKS.slice(0, 6).map((symbol) => (
                <Link key={symbol} href={`/trade/${symbol}`}>
                  <Button variant="outline" size="sm">
                    {symbol}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
