import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${formatNumber(value, 2)}%`
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function isMarketOpen(): boolean {
  const now = new Date()
  const day = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentMinutes = hours * 60 + minutes

  // Weekend check (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) return false

  // Market hours: 9:30 AM - 4:00 PM ET (converted to UTC-5)
  const marketOpen = 9 * 60 + 30 // 9:30 AM
  const marketClose = 16 * 60 // 4:00 PM

  return currentMinutes >= marketOpen && currentMinutes < marketClose
}

export function getMarketStatus(): { isOpen: boolean; message: string } {
  const open = isMarketOpen()
  return {
    isOpen: open,
    message: open ? 'Market is Open' : 'Market is Closed',
  }
}
