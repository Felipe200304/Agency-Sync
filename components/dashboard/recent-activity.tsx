const activities = [
  { time: '10:32', text: 'Animale aprovou Bella Ferreira para o casting Verão 2026', type: 'aprovado' },
  { time: '09:15', text: 'Novo casting solicitado: SPFW Inverno 2025', type: 'novo' },
  { time: '08:50', text: 'Pagamento recebido: Dior Brasil — R$ 8.500', type: 'pagamento' },
  { time: 'Ontem', text: 'O Boticário aprovou proposta de modelos para editorial', type: 'aprovado' },
  { time: 'Ontem', text: 'Sofia Mendes adicionada ao casting Cris Barros Lookbook', type: 'novo' },
  { time: '22/06', text: 'Repasse enviado para Larissa Oliveira — R$ 7.020', type: 'pagamento' },
  { time: '21/06', text: 'Novo modelo cadastrado: Rafaela Lima (Recife, PE)', type: 'modelo' },
]

const colors: Record<string, string> = {
  aprovado: 'text-green-400',
  novo: 'text-primary',
  pagamento: 'text-blue-400',
  modelo: 'text-purple-400',
}

export function RecentActivity() {
  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-5">Atividade Recente</p>
      <div className="space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xs text-muted-foreground/50 w-12 flex-shrink-0 pt-0.5">{a.time}</span>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${colors[a.type]}`} />
            <p className="text-sm text-foreground/70 leading-snug">{a.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
