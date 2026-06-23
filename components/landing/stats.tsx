const stats = [
  { value: '1.200+', label: 'Modelos Cadastrados' },
  { value: '340+', label: 'Marcas Parceiras' },
  { value: '8.500+', label: 'Castings Realizados' },
  { value: 'R$ 12M+', label: 'Pagos em Cachets' },
]

export function Stats() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="font-heading text-4xl md:text-5xl gold-text font-light mb-2">
                {stat.value}
              </div>
              <div className="text-xs tracking-widest uppercase text-foreground/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
