'use client'

import * as React from 'react'
import { useTradingStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { format } from 'date-fns'
import { Download, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function HistoryView() {
  const { trades } = useTradingStore()
  const [filter, setFilter] = React.useState<'all' | 'buy' | 'sell'>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredTrades = trades.filter((trade) => {
    const matchesFilter = filter === 'all' || trade.side === filter
    const matchesSearch = trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalBuyValue = trades.filter(t => t.side === 'buy').reduce((sum, t) => sum + t.total, 0)
  const totalSellValue = trades.filter(t => t.side === 'sell').reduce((sum, t) => sum + t.total, 0)
  const totalCommissions = trades.reduce((sum, t) => sum + t.commission, 0)

  const exportToCSV = () => {
    const headers = ['Date', 'Symbol', 'Side', 'Type', 'Quantity', 'Price', 'Commission', 'Total']
    const rows = trades.map((trade) => [
      format(new Date(trade.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      trade.symbol,
      trade.side.toUpperCase(),
      trade.type,
      trade.quantity,
      trade.price.toFixed(2),
      trade.commission.toFixed(2),
      trade.total.toFixed(2),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `smarttrade-history-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trading History</h1>
          <p className="text-muted-foreground mt-1">
            View all your past transactions
          </p>
        </div>
        <Button variant="outline" onClick={exportToCSV} disabled={trades.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bought
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalBuyValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{formatCurrency(totalSellValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commissions Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'buy' | 'sell')}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTrades.length > 0 ? (
            <div className="space-y-2">
              {filteredTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {trade.side === 'buy' ? (
                      <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-success" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center">
                        <ArrowDownRight className="h-5 w-5 text-danger" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{trade.symbol}</span>
                        <Badge variant={trade.side === 'buy' ? 'success' : 'danger'}>
                          {trade.side.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {trade.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(trade.quantity)} shares @ {formatCurrency(trade.price)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(trade.total)}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(trade.timestamp), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Commission: {formatCurrency(trade.commission)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {trades.length === 0 ? (
                <>No trades yet. Start trading to see your history here.</>
              ) : (
                <>No trades match your filters.</>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
