'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X, Search, TrendingUp } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { StockSearch } from '@/components/stock-search'
import { APIStatusBadge } from '@/components/api-status-badge'

const routes = [
  { href: '/', label: 'Dashboard' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/history', label: 'History' },
  { href: '/watchlist', label: 'Watchlist' },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-smooth shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">SmartTrade</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={pathname === route.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'font-medium transition-all relative',
                    pathname === route.href && 'bg-secondary shadow-md'
                  )}
                >
                  {route.label}
                  {pathname === route.href && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <APIStatusBadge />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={pathname === route.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  {route.label}
                </Button>
              </Link>
            ))}
            <div className="pt-2">
              <StockSearch onSelect={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Desktop Search Bar */}
        {searchOpen && (
          <div className="hidden md:block py-4">
            <StockSearch onSelect={() => setSearchOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  )
}
