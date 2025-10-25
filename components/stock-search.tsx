'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { searchStocks } from '@/lib/api'
import { Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StockSearchProps {
  onSelect?: () => void
}

export function StockSearch({ onSelect }: StockSearchProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<Array<{ symbol: string; description: string }>>([])
  const [loading, setLoading] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)
  const searchRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    // Increased debounce delay for better performance
    const searchDebounced = setTimeout(async () => {
      if (query.length < 2) { // Require at least 2 characters
        setResults([])
        setShowResults(false)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const data = await searchStocks(query)
        setResults(data)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500) // Increased from 300ms to 500ms

    return () => clearTimeout(searchDebounced)
  }, [query])

  const handleSelect = (symbol: string) => {
    setQuery('')
    setShowResults(false)
    router.push(`/trade/${symbol}`)
    onSelect?.()
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-md z-50 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.symbol}
              onClick={() => handleSelect(result.symbol)}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex flex-col"
            >
              <span className="font-medium">{result.symbol}</span>
              <span className="text-sm text-muted-foreground truncate">
                {result.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length > 0 && results.length === 0 && !loading && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-md z-50 p-4 text-center text-sm text-muted-foreground">
          No stocks found
        </div>
      )}
    </div>
  )
}
