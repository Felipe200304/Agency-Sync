'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Calendar, Briefcase, DollarSign } from 'lucide-react'

const items = [
  { href: '/model', label: 'Perfil', icon: User },
  { href: '/model/agenda', label: 'Agenda', icon: Calendar },
  { href: '/model/castings', label: 'Castings', icon: Briefcase },
  { href: '/model/finances', label: 'Cachês', icon: DollarSign },
]

function isActive(pathname: string, href: string) {
  return href === '/model' ? pathname === '/model' : pathname.startsWith(href)
}

/** Navegação horizontal no topo (desktop). */
export function ModeloTopNav() {
  const pathname = usePathname()
  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm transition-colors ${
            isActive(pathname, href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

/** Tab bar fixa no rodapé (mobile) — padrão de app nativo. */
export function ModeloBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] tracking-wide transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
