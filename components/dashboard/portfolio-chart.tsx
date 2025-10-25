'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useTradingStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'

export function PortfolioChart() {
  const { portfolio, trades } = useTradingStore()
  const [timeframe, setTimeframe] = React.useState('1M')

  // Generate mock historical data based on trades
  const generateChartData = () => {
    const now = Date.now()
    const days = timeframe === '1D' ? 1 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 90
    const data = []

    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * 24 * 60 * 60 * 1000
      // Simple simulation: start from initial value and work towards current value
      const progress = (days - i) / days
      const value = 1000000 + (portfolio.totalValue - 1000000) * progress + (Math.random() - 0.5) * 10000
      
      data.push({
        date: new Date(timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        value: Math.max(0, value),
      })
    }

    return data
  }

  const chartData = generateChartData()
  const changeColor = portfolio.totalPL >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Value</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <div className="text-sm font-medium">{payload[0].payload.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(payload[0].value as number)}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={changeColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
