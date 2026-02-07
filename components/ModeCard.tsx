import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ReactNode } from 'react'

interface ModeCardProps {
  icon: ReactNode
  title: string
  description: string
  badge?: string
  href: string
  disabled?: boolean
}

export function ModeCard({ icon, title, description, badge, href, disabled }: ModeCardProps) {
  const content = (
    <Card
      className={`transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-foreground/30 hover:shadow-md cursor-pointer'
      }`}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-xl">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            {badge && (
              <Badge variant={disabled ? 'secondary' : 'default'}>{badge}</Badge>
            )}
          </div>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )

  if (disabled) {
    return content
  }

  return <Link href={href}>{content}</Link>
}
