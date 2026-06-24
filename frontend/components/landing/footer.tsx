import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
          <div className="max-w-xs">
            <span className="font-heading text-2xl tracking-widest gold-text font-light">AGENCY SYNC</span>
            <p className="text-foreground/40 text-sm leading-relaxed mt-4">
              A plataforma que conecta agências, modelos e marcas em um único ecossistema digital.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs tracking-widest uppercase text-foreground/30 mb-4">Plataforma</p>
              <div className="space-y-2">
                {['Para Agências', 'Para Marcas', 'Para Modelos', 'Preços'].map(item => (
                  <a key={item} href="#" className="block text-sm text-foreground/50 hover:text-foreground transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-foreground/30 mb-4">Legal</p>
              <div className="space-y-2">
                {['Termos de Uso', 'Privacidade', 'Cookies'].map(item => (
                  <a key={item} href="#" className="block text-sm text-foreground/50 hover:text-foreground transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-foreground/30 mb-4">Acesso</p>
              <div className="space-y-2">
                <Link href="/login?role=agency" className="block text-sm text-foreground/50 hover:text-foreground transition-colors">Agências</Link>
                <Link href="/login?role=brand" className="block text-sm text-foreground/50 hover:text-foreground transition-colors">Marcas</Link>
                <Link href="/login?role=model" className="block text-sm text-foreground/50 hover:text-foreground transition-colors">Modelos</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/25 tracking-wider">
            © 2025 Agency Sync. Todos os direitos reservados.
          </p>
          <p className="text-xs text-foreground/20 tracking-widest uppercase">
            Made in Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
