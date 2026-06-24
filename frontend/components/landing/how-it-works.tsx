const steps = [
  { num: '01', title: 'Marca solicita trabalho', desc: 'A marca preenche um briefing detalhado com datas, perfil desejado, locação e cachet.' },
  { num: '02', title: 'Agência recebe e analisa', desc: 'A equipe de bookers analisa o pedido e seleciona os modelos mais adequados ao perfil.' },
  { num: '03', title: 'Modelos enviados para casting', desc: 'Os perfis selecionados são enviados digitalmente para a marca analisar.' },
  { num: '04', title: 'Marca aprova candidatos', desc: 'A marca visualiza portfolios completos e aprova ou reprova cada modelo individualmente.' },
  { num: '05', title: 'Confirmação e briefing', desc: 'Modelos aprovados recebem automaticamente todos os detalhes do trabalho e contrato.' },
]

export function HowItWorks() {
  return (
    <section id="modelos" className="py-32 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.4em] text-primary uppercase mb-4">Fluxo de Casting</p>
          <h2 className="font-heading text-5xl md:text-6xl font-light text-balance">
            Como funciona
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8 md:gap-12 items-start group">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border border-border glass flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <span className="font-heading text-lg text-primary font-light">{step.num}</span>
                  </div>
                </div>
                <div className="pb-12 pt-4">
                  <h3 className="font-heading text-2xl font-light text-foreground mb-2">{step.title}</h3>
                  <p className="text-foreground/55 text-sm leading-relaxed max-w-md">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
