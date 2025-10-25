'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { getAPIKeyStatus } from '@/lib/api'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function APIStatusBadge() {
  const [status, setStatus] = React.useState(getAPIKeyStatus())
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setStatus(getAPIKeyStatus())
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button 
        className="flex items-center"
        onClick={() => setOpen(true)}
      >
        <Badge
          variant={status.configured ? 'success' : 'outline'}
          className="cursor-pointer gap-1.5"
        >
          {status.configured ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span className="hidden md:inline">
            {status.configured ? 'Live Data' : 'Demo Mode'}
          </span>
        </Badge>
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status.configured ? (
              <>
                <Wifi className="h-5 w-5 text-success" />
                API Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                API Not Configured
              </>
            )}
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <p>{status.message}</p>
            
            {!status.configured && (
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">Quick Setup:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Visit <a href="https://finnhub.io/register" target="_blank" rel="noopener noreferrer" className="text-primary underline">finnhub.io/register</a></li>
                    <li>Sign up for a free account (takes 30 seconds)</li>
                    <li>Copy your API key</li>
                    <li>Add to Vercel environment variables as <code className="bg-secondary px-1 py-0.5 rounded">NEXT_PUBLIC_FINNHUB_API_KEY</code></li>
                    <li>Redeploy your app</li>
                  </ol>
                </div>
                
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> The app works in demo mode with simulated data. 
                    Add an API key to get real-time stock quotes and historical data.
                  </p>
                </div>
              </div>
            )}

            {status.configured && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm">
                  ✓ You&apos;re connected to live market data via Finnhub API
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
