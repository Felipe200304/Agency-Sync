'use client'

import { Bell, Search, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DashboardHeader({ title }: { title: string }) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  return (
    <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-background">
      <div className="flex-1">
        <h1 className="font-heading text-xl font-light text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 border border-border rounded-sm px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-36"
          />
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Alternar tema"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 ml-2">
          <img
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=32&h=32&fit=crop&crop=faces"
            alt="Carolina Bassi"
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
          <div className="hidden md:block">
            <p className="text-xs font-medium text-foreground leading-none">Carolina Bassi</p>
            <p className="text-xs text-muted-foreground mt-0.5">Administradora</p>
          </div>
        </div>
      </div>
    </header>
  )
}
