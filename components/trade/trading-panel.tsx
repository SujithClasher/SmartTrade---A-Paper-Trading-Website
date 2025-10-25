'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useTradingStore } from '@/lib/store'
import { OrderType, OrderSide } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface TradingPanelProps {
  symbol: string
  currentPrice: number
}

export function TradingPanel({ symbol, currentPrice }: TradingPanelProps) {
  const { portfolio, executeTrade } = useTradingStore()
  const [side, setSide] = React.useState<OrderSide>('buy')
  const [orderType, setOrderType] = React.useState<OrderType>('market')
  const [quantity, setQuantity] = React.useState('')
  const [limitPrice, setLimitPrice] = React.useState('')
  const [stopPrice, setStopPrice] = React.useState('')
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [tradeResult, setTradeResult] = React.useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = React.useState('')

  const position = portfolio.positions.find((p) => p.symbol === symbol)
  const maxShares = side === 'sell' ? position?.quantity || 0 : Math.floor(portfolio.cash / currentPrice)

  const calculateTotal = () => {
    const qty = parseInt(quantity) || 0
    const price = orderType === 'limit' ? parseFloat(limitPrice) || currentPrice : currentPrice
    return price * qty
  }

  const handleTrade = () => {
    setErrorMessage('')
    
    const qty = parseInt(quantity)
    if (!qty || qty <= 0) {
      setErrorMessage('Please enter a valid quantity')
      return
    }

    if (side === 'buy' && calculateTotal() > portfolio.cash) {
      setErrorMessage('Insufficient funds')
      return
    }

    if (side === 'sell' && (!position || qty > position.quantity)) {
      setErrorMessage('Insufficient shares to sell')
      return
    }

    if (orderType === 'limit' && !limitPrice) {
      setErrorMessage('Please enter a limit price')
      return
    }

    if (orderType === 'stop' && !stopPrice) {
      setErrorMessage('Please enter a stop price')
      return
    }

    setShowConfirmation(true)
  }

  const confirmTrade = () => {
    const qty = parseInt(quantity)
    const price = orderType === 'limit' ? parseFloat(limitPrice) : orderType === 'stop' ? parseFloat(stopPrice) : currentPrice

    const tradeId = executeTrade(
      symbol,
      side,
      qty,
      currentPrice,
      orderType,
      orderType === 'limit' ? parseFloat(limitPrice) : undefined,
      orderType === 'stop' ? parseFloat(stopPrice) : undefined
    )

    if (tradeId) {
      setTradeResult('success')
      setQuantity('')
      setLimitPrice('')
      setStopPrice('')
    } else {
      setTradeResult('error')
      setErrorMessage('Trade execution failed')
    }

    setTimeout(() => {
      setShowConfirmation(false)
      setTradeResult(null)
    }, 2000)
  }

  return (
    <>
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle>Trade {symbol}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buy/Sell Tabs */}
          <Tabs value={side} onValueChange={(v) => setSide(v as OrderSide)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-danger data-[state=active]:text-danger-foreground">
                Sell
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Order Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Order Type</label>
            <Tabs value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="limit">Limit</TabsTrigger>
                <TabsTrigger value="stop">Stop</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Quantity</label>
              <span className="text-xs text-muted-foreground">
                Max: {formatNumber(maxShares, 0)} shares
              </span>
            </div>
            <Input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={maxShares}
            />
          </div>

          {/* Limit Price */}
          {orderType === 'limit' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Limit Price</label>
              <Input
                type="number"
                placeholder={currentPrice.toFixed(2)}
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                step="0.01"
              />
            </div>
          )}

          {/* Stop Price */}
          {orderType === 'stop' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Stop Price</label>
              <Input
                type="number"
                placeholder={currentPrice.toFixed(2)}
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                step="0.01"
              />
            </div>
          )}

          {/* Order Summary */}
          <div className="space-y-2 p-4 rounded-lg bg-muted">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-medium">{formatCurrency(currentPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">{quantity || 0} shares</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-2 border-t">
              <span>Estimated Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          {/* Available Cash/Position */}
          {side === 'buy' ? (
            <div className="text-sm">
              <span className="text-muted-foreground">Available Cash: </span>
              <span className="font-medium">{formatCurrency(portfolio.cash)}</span>
            </div>
          ) : (
            <div className="text-sm">
              <span className="text-muted-foreground">Your Position: </span>
              <span className="font-medium">
                {position ? `${formatNumber(position.quantity, 0)} shares` : 'No position'}
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-sm text-danger">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <Button
            className="w-full"
            variant={side === 'buy' ? 'success' : 'danger'}
            onClick={handleTrade}
            disabled={!quantity}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} {symbol}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          {tradeResult === null ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm {side === 'buy' ? 'Purchase' : 'Sale'}</DialogTitle>
                <DialogDescription>
                  Please review your order details before confirming
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Symbol</span>
                  <span className="font-medium">{symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Action</span>
                  <Badge variant={side === 'buy' ? 'success' : 'danger'}>
                    {side.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Type</span>
                  <span className="font-medium capitalize">{orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{quantity} shares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{formatCurrency(currentPrice)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
                <Button
                  variant={side === 'buy' ? 'success' : 'danger'}
                  onClick={confirmTrade}
                >
                  Confirm {side === 'buy' ? 'Purchase' : 'Sale'}
                </Button>
              </DialogFooter>
            </>
          ) : tradeResult === 'success' ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trade Successful!</h3>
              <p className="text-muted-foreground">
                Your {side} order has been executed
              </p>
            </div>
          ) : (
            <div className="py-8 text-center">
              <AlertCircle className="h-16 w-16 text-danger mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trade Failed</h3>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
