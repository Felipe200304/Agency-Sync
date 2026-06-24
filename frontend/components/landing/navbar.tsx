'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = ['Plataforma', 'Modelos', 'Marcas', 'Agências']

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'glass border-b border-white/8 py-3' : 'py-5'
      }`}
    >
      {/* Grid de 3 colunas: as colunas nunca se sobrepõem, então o menu
          fica sempre centralizado independentemente da largura do logo/ações. */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Logo — esquerda */}
        <Link href="/" className="justify-self-start flex items-center whitespace-nowrap">
          <span className="font-heading text-xl sm:text-2xl tracking-widest gold-text font-light">AGENCY SYNC</span>
        </Link>

        {/* Menu — centro (apenas desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm tracking-wider text-foreground/60 hover:text-foreground transition-colors uppercase whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Ações — direita */}
        <div className="justify-self-end flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm px-5 py-2 border border-border rounded-sm text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-all tracking-wide whitespace-nowrap"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="text-sm px-5 py-2 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-all tracking-wide whitespace-nowrap"
            >
              Começar
            </Link>
          </div>

          {/* Hambúrguer — mobile */}
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            className="md:hidden p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Painel mobile */}
      {open && (
        <div className="md:hidden glass border-t border-white/8 mt-3">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm tracking-wider text-foreground/70 hover:text-foreground transition-colors uppercase"
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-white/8">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm px-5 py-2.5 border border-border rounded-sm text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-all tracking-wide"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm px-5 py-2.5 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-all tracking-wide"
              >
                Começar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
