'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { clearSession } from '@/lib/auth'
import {
  LayoutDashboard, Users, Briefcase, Calendar, DollarSign,
  UserCheck, Building2, ChevronLeft, ChevronRight, LogOut, Settings
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/models', label: 'Modelos', icon: Users },
  { href: '/dashboard/castings', label: 'Castings', icon: Briefcase },
  { href: '/dashboard/calendar', label: 'Calendário', icon: Calendar },
  { href: '/dashboard/clients', label: 'Clientes', icon: Building2 },
  { href: '/dashboard/staff', label: 'Equipe', icon: UserCheck },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  return (
    <aside
      className={`flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        {collapsed ? (
          <span className="font-heading text-lg gold-text font-light mx-auto">L</span>
        ) : (
          <span className="font-heading text-xl tracking-widest gold-text font-light">AGENCY SYNC</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all group ${
                isActive
                  ? 'bg-sidebar-accent text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!collapsed && (
                <span className="tracking-wide truncate">{label}</span>
              )}
              {isActive && !collapsed && (
                <span className="ml-auto w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse + Logout */}
      <div className="pb-4 px-2 space-y-0.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="tracking-wide">Sair</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-sidebar-foreground/40 hover:text-sidebar-foreground transition-all w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="tracking-wide text-xs">Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
