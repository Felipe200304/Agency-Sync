import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <Link href="/" className="font-heading text-xl tracking-widest gold-text font-light">
          AGENCY SYNC
        </Link>
        <nav className="flex items-center gap-6">
          {[
            { href: '/client', label: 'Meu Painel' },
            { href: '/client/castings', label: 'Meus Castings' },
            { href: '/client/new-casting', label: 'Solicitar Casting' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <LogoutButton className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" />
      </header>
      <main>{children}</main>
    </div>
  )
}
