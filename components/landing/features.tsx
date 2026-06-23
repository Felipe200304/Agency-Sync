const features = [
  {
    role: 'Agências',
    tagline: 'Gestão completa do seu negócio',
    items: [
      'Cadastro detalhado de modelos com composite cards',
      'Pipeline de castings com kanban visual',
      'Calendário integrado com todos os eventos',
      'Financeiro completo: cachets, comissões e repasses',
      'Gestão da equipe: bookers, scouts e administradores',
    ],
  },
  {
    role: 'Marcas',
    tagline: 'Encontre o talento perfeito',
    items: [
      'Solicite trabalhos com formulário estruturado',
      'Receba modelos selecionados pela agência',
      'Aprove ou reprove candidatos com um clique',
      'Acompanhe todo o fluxo do casting em tempo real',
      'Histórico completo de campanhas e contratos',
    ],
  },
  {
    role: 'Modelos',
    tagline: 'Sua carreira em suas mãos',
    items: [
      'Visualize trabalhos futuros e confirmados',
      'Acesse briefings, contratos e comprovantes',
      'Acompanhe pagamentos e histórico financeiro',
      'Calendário pessoal com todas as agendas',
      'Perfil completo com portfólio e composite',
    ],
  },
]

export function Features() {
  return (
    <section id="plataforma" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.4em] text-primary uppercase mb-4">Funcionalidades</p>
          <h2 className="font-heading text-5xl md:text-6xl font-light text-balance">
            Uma plataforma,<br />
            <span className="gold-text italic">múltiplos perfis</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass rounded-sm p-8 hover:border-primary/20 transition-colors group"
            >
              <div className="mb-6">
                <span className="text-xs tracking-[0.3em] text-primary uppercase">{feature.role}</span>
                <h3 className="font-heading text-2xl font-light text-foreground mt-2">
                  {feature.tagline}
                </h3>
              </div>
              <ul className="space-y-3">
                {feature.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-foreground/60 text-sm leading-relaxed">
                    <span className="text-primary mt-0.5 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
