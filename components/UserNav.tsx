'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

interface UserNavProps {
  user: User
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden md:inline">
        {user.email}
      </span>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sair
      </Button>
    </div>
  )
}
