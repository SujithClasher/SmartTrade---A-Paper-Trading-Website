'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTradingStore } from '@/lib/store'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface RecentTradesProps {
  limit?: number
}

export function RecentTrades({ limit = 10 }: RecentTradesProps) {
  const { trades } = useTradingStore()
  const recentTrades = trades.slice(0, limit)

  if (recentTrades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No trades yet. Start trading to see your history here.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Trades</CardTitle>
        {trades.length > limit && (
          <Link href="/history">
            <Button variant="link" className="px-0">
              View all →
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentTrades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                {trade.side === 'buy' ? (
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-danger/10 flex items-center justify-center">
                    <ArrowDownRight className="h-4 w-4 text-danger" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{trade.symbol}</span>
                    <Badge variant={trade.side === 'buy' ? 'success' : 'danger'} className="text-xs">
                      {trade.side.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatNumber(trade.quantity)} shares @ {formatCurrency(trade.price)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(trade.total)}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(trade.timestamp), 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
