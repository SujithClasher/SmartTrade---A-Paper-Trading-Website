'use client'

import * as React from 'react'
import { useTradingStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils'
import { getStockQuote } from '@/lib/api'
import { TrendingUp, TrendingDown, RefreshCw, PieChart as PieChartIcon } from 'lucide-react'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['hsl(142, 76%, 36%)', 'hsl(221, 83%, 53%)', 'hsl(262, 83%, 58%)', 'hsl(32, 98%, 56%)', 'hsl(340, 82%, 52%)', 'hsl(158, 64%, 52%)']

export function PortfolioView() {
  const { portfolio, updatePositionPrices, calculatePortfolioValue } = useTradingStore()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    calculatePortfolioValue()
  }, [calculatePortfolioValue])

  const handleRefresh = async () => {
    if (loading) return // Prevent multiple simultaneous refreshes
    
    setLoading(true)
    let updated = 0
    
    // Update positions one at a time to avoid overwhelming API
    for (const position of portfolio.positions) {
      try {
        const quote = await getStockQuote(position.symbol)
        if (quote) {
          updatePositionPrices(position.symbol, quote.price)
          updated++
        }
      } catch (error) {
        console.error(`Error updating ${position.symbol}:`, error)
      }
    }
    
    console.log(`Updated ${updated} of ${portfolio.positions.length} positions`)
    setLoading(false)
  }

  const pieChartData = portfolio.positions.map((position, index) => ({
    name: position.symbol,
    value: position.totalValue,
    color: COLORS[index % COLORS.length],
  }))

  const totalPositionsValue = portfolio.positions.reduce((sum, p) => sum + p.totalValue, 0)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your investments
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cash Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.cash)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Positions Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPositionsValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P/L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolio.totalPL >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(portfolio.totalPL)}
            </div>
            <div className={`text-sm ${portfolio.totalPL >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatPercentage(portfolio.totalPLPercent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Positions */}
      {portfolio.positions.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Positions Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolio.positions.map((position) => (
                    <Link key={position.symbol} href={`/trade/${position.symbol}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{position.symbol}</span>
                            {position.unrealizedPL >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-success" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-danger" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatNumber(position.quantity, 0)} shares @ {formatCurrency(position.averagePrice)}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Current: </span>
                            <span className="font-medium">{formatCurrency(position.currentPrice)}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-semibold">{formatCurrency(position.totalValue)}</div>
                          <Badge variant={position.unrealizedPL >= 0 ? 'success' : 'danger'}>
                            {formatCurrency(position.unrealizedPL)}
                          </Badge>
                          <div className={`text-sm ${position.unrealizedPL >= 0 ? 'text-success' : 'text-danger'}`}>
                            {formatPercentage(position.unrealizedPLPercent)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="text-sm font-medium">{payload[0].name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(payload[0].value as number)}
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieChartData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <PieChartIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Positions Yet</h2>
              <p className="text-muted-foreground mb-4">
                Start trading to build your portfolio
              </p>
              <Link href="/">
                <Button>Explore Stocks</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
