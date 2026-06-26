import Link from 'next/link'
import { LogoutButton } from '@/components/auth/logout-button'
import { ModeloTopNav, ModeloBottomNav } from '@/components/model/model-nav'

export default function ModeloLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 bg-background/95 backdrop-blur">
        <Link href="/" className="font-heading text-lg md:text-xl tracking-widest gold-text font-light">
          AGENCY SYNC
        </Link>
        <ModeloTopNav />
        <LogoutButton className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" />
      </header>

      {/* pb extra no mobile para o conteúdo não ficar atrás da tab bar */}
      <main className="pb-24 md:pb-0">{children}</main>

      <ModeloBottomNav />
    </div>
  )
}
