import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video — model walking the runway */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/runway.mp4"
          poster="https://images.pexels.com/videos/6261136/pexels-photo-6261136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <p className="text-xs tracking-[0.4em] text-primary uppercase mb-6 animate-fade-in">
          Plataforma Premium para Agências de Modelos
        </p>

        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-foreground leading-none mb-8 text-balance">
          O ecossistema da
          <br />
          <span className="gold-text italic">moda brasileira</span>
        </h1>

        <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 text-pretty">
          Conectamos agências, modelos, marcas e profissionais em uma única plataforma.
          Gestão completa de castings, contratos e pagamentos com elegância e eficiência.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-10 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:opacity-90 transition-all w-full sm:w-auto text-center"
          >
            Entrar
          </Link>
          <Link
            href="#plataforma"
            className="px-10 py-4 border border-border text-foreground/80 text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-all w-full sm:w-auto text-center"
          >
            Conhecer a Plataforma
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-primary/50" />
        <span className="text-xs text-foreground/30 tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}
