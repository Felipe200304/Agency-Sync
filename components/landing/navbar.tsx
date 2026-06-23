'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/8 py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl tracking-widest gold-text font-light">AGENCY SYNC</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Plataforma', 'Modelos', 'Marcas', 'Agências'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm tracking-wider text-foreground/60 hover:text-foreground transition-colors uppercase"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm px-5 py-2 border border-border rounded-sm text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-all tracking-wide"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="text-sm px-5 py-2 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-all tracking-wide"
          >
            Começar
          </Link>
        </div>
      </div>
    </header>
  )
}
