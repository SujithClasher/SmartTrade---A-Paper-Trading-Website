'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyProfile } from '@/lib/types'
import { Building2 } from 'lucide-react'

interface CompanyInfoProps {
  company: CompanyProfile
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {company.logo && (
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-lg bg-white p-2">
              <Image
                src={company.logo}
                alt={company.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.symbol}</p>
            </div>
          </div>
        )}

        {company.sector && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Sector</h4>
            <p>{company.sector}</p>
          </div>
        )}

        {company.industry && company.industry !== company.sector && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
            <p>{company.industry}</p>
          </div>
        )}

        {company.description && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
            <p className="text-sm leading-relaxed">{company.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
