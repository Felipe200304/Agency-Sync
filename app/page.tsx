import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Stats } from '@/components/landing/stats'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />

      {/* CTA final */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=600&fit=crop&q=60"
            alt=""
            className="w-full h-full object-cover opacity-20"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-5xl md:text-6xl font-light text-foreground mb-6 text-balance">
            Pronto para elevar sua{' '}
            <span className="gold-text italic">agência ao próximo nível?</span>
          </h2>
          <p className="text-foreground/50 text-lg mb-10 leading-relaxed">
            Junte-se a centenas de agências que já usam o Agency Sync para gerenciar seu negócio com eficiência e elegância.
          </p>
          <a
            href="/login"
            className="inline-block px-12 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:opacity-90 transition-all"
          >
            Começar Agora — Grátis
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
