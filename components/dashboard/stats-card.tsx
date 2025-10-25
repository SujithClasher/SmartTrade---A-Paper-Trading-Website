'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  description?: string
  gradient?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  gradient = 'from-primary/10 to-primary/5'
}: StatsCardProps) {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral: 'text-muted-foreground'
  }[changeType]

  return (
    <Card className="card-hover overflow-hidden fade-in">
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', gradient)} />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {change && (
          <div className={cn('text-sm font-medium mt-2', changeColor)}>
            {change}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
