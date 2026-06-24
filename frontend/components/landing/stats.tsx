const highlights = [
  { value: 'Multi-agência', label: 'Um modelo, várias agências' },
  { value: 'Agenda unificada', label: 'Disponibilidade sem conflitos' },
  { value: 'Casting completo', label: 'Do briefing à confirmação' },
  { value: 'Financeiro', label: 'Cachês, comissões e repasses' },
]

export function Stats() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {highlights.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="font-heading text-2xl md:text-3xl gold-text font-light mb-2">
                {item.value}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground/40">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
