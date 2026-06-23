import Link from 'next/link'
import { LogOut } from 'lucide-react'

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <Link href="/" className="font-heading text-xl tracking-widest gold-text font-light">
          AGENCY SYNC
        </Link>
        <nav className="flex items-center gap-6">
          {[
            { href: '/cliente', label: 'Meu Painel' },
            { href: '/cliente/castings', label: 'Meus Castings' },
            { href: '/cliente/novo-casting', label: 'Solicitar Casting' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </Link>
      </header>
      <main>{children}</main>
    </div>
  )
}
