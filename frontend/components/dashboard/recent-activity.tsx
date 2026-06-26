'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Item = { date: string; text: string; type: 'novo' | 'pagamento' | 'approved' }

const colors: Record<string, string> = {
  approved: 'text-green-400',
  novo: 'text-primary',
  pagamento: 'text-blue-400',
}

const castingStatusLabel: Record<string, string> = {
  requested: 'requested', 'reviewing': 'em análise', 'models-submitted': 'modelos enviados',
  'evaluating': 'em avaliação', confirmed: 'confirmed', completed: 'concluído',
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const dayMonth = (d: string) => { const [, m, day] = d.split('-'); return day && m ? `${day}/${m}` : '' }

export function RecentActivity() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    Promise.all([api.castings().catch(() => []), api.finance().catch(() => [])])
      .then(([castings, finance]) => {
        const acts: Item[] = []
        castings.forEach(c => {
          if (!c.createdAt) return
          acts.push({
            date: c.createdAt,
            type: c.status === 'confirmed' || c.status === 'completed' ? 'approved' : 'novo',
            text: `Casting "${c.title}"${c.brand ? ` (${c.brand})` : ''} — ${castingStatusLabel[c.status] ?? c.status}`,
          })
        })
        finance.forEach(r => {
          if (!r.date) return
          acts.push({
            date: r.date,
            type: 'pagamento',
            text: r.status === 'paid'
              ? `Pagamento recebido: ${r.campaign ?? 'cachê'} — ${fmt(r.cachet)}`
              : `Cachê ${r.status}: ${r.campaign ?? '—'} — ${fmt(r.cachet)}`,
          })
        })
        acts.sort((a, b) => b.date.localeCompare(a.date))
        setItems(acts.slice(0, 8))
      })
  }, [])

  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-5">Atividade Recente</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem atividade recente.</p>
      ) : (
        <div className="space-y-4">
          {items.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs text-muted-foreground/50 w-12 flex-shrink-0 pt-0.5">{dayMonth(a.date)}</span>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${colors[a.type]}`} />
              <p className="text-sm text-foreground/70 leading-snug">{a.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
