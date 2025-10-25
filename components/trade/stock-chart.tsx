'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStockCandles, getMockCandles } from '@/lib/api'
import { TIMEFRAMES } from '@/lib/constants'
import { StockCandle } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface StockChartProps {
  symbol: string
}

export function StockChart({ symbol }: StockChartProps) {
  const [timeframe, setTimeframe] = React.useState('1M')
  const [chartType, setChartType] = React.useState<'line' | 'candle'>('line')
  const [candles, setCandles] = React.useState<StockCandle[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    const fetchCandles = async () => {
      setLoading(true)
      try {
        const tf = TIMEFRAMES[timeframe as keyof typeof TIMEFRAMES]
        const to = Math.floor(Date.now() / 1000)
        const from = to - tf.days * 24 * 60 * 60

        const data = await getStockCandles(symbol, tf.resolution, from, to)
        
        if (mounted) {
          if (data.length > 0) {
            setCandles(data)
          } else {
            // Fallback to mock data
            setCandles(getMockCandles(tf.days))
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching candles:', error)
        if (mounted) {
          const tf = TIMEFRAMES[timeframe as keyof typeof TIMEFRAMES]
          setCandles(getMockCandles(tf.days))
          setLoading(false)
        }
      }
    }

    fetchCandles()

    return () => {
      mounted = false
    }
  }, [symbol, timeframe])

  const chartData = candles.map((candle) => ({
    date: new Date(candle.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      ...(timeframe === '1D' ? { hour: 'numeric' } : {})
    }),
    price: candle.close,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume,
  }))

  const minPrice = Math.min(...chartData.map(d => d.low))
  const maxPrice = Math.max(...chartData.map(d => d.high))
  const priceChange = chartData.length > 0 
    ? chartData[chartData.length - 1].price - chartData[0].price 
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Price Chart</CardTitle>
          <div className="flex gap-2">
            <Tabs value={chartType} onValueChange={(v) => setChartType(v as 'line' | 'candle')}>
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="candle">Candle</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList>
                {Object.keys(TIMEFRAMES).map((key) => (
                  <TabsTrigger key={key} value={key}>
                    {key}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[minPrice * 0.99, maxPrice * 1.01]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-md">
                            <div className="text-sm font-medium mb-1">{payload[0].payload.date}</div>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-medium">{formatCurrency(payload[0].value as number)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={priceChange >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[minPrice * 0.99, maxPrice * 1.01]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-md">
                            <div className="text-sm font-medium mb-2">{data.date}</div>
                            <div className="space-y-1 text-sm">
                              <div><span className="text-muted-foreground">Open: </span>{formatCurrency(data.open)}</div>
                              <div><span className="text-muted-foreground">High: </span>{formatCurrency(data.high)}</div>
                              <div><span className="text-muted-foreground">Low: </span>{formatCurrency(data.low)}</div>
                              <div><span className="text-muted-foreground">Close: </span>{formatCurrency(data.close)}</div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="close" fill="hsl(var(--primary))" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
