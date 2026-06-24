'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { clearSession } from '@/lib/auth'

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  return (
    <button onClick={handleLogout} className={className}>
      <LogOut className="w-3.5 h-3.5" />
      Sair
    </button>
  )
}
