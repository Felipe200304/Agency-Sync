'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { api } from '@/lib/api'

const STATUS: { key: string; name: string; color: string }[] = [
  { key: 'concluido', name: 'Concluído', color: 'oklch(0.72 0.16 150)' },
  { key: 'confirmado', name: 'Confirmado', color: 'oklch(0.70 0.15 250)' },
  { key: 'em-avaliacao', name: 'Em Avaliação', color: 'oklch(0.68 0.16 300)' },
  { key: 'modelos-enviados', name: 'Modelos Enviados', color: 'oklch(0.74 0.15 50)' },
  { key: 'em-analise', name: 'Em Análise', color: 'oklch(0.80 0.13 85)' },
  { key: 'solicitado', name: 'Solicitado', color: 'oklch(0.68 0.17 20)' },
]

export function CastingsChart() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    api.castings()
      .then(cs => {
        const c: Record<string, number> = {}
        cs.forEach(x => { c[x.status] = (c[x.status] ?? 0) + 1 })
        setCounts(c)
        setTotal(cs.length)
      })
      .catch(() => {})
  }, [])

  const data = STATUS
    .map(s => ({ name: s.name, value: counts[s.key] ?? 0, color: s.color }))
    .filter(d => d.value > 0)

  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <div className="mb-6">
        <p className="text-xs tracking-widest uppercase text-muted-foreground">Castings por Status</p>
        <p className="font-heading text-2xl font-light text-foreground mt-1">{total} casting{total === 1 ? '' : 's'}</p>
      </div>
      {data.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Nenhum casting</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
            </Pie>
            <Tooltip
              formatter={(v) => `${v} casting(s)`}
              contentStyle={{ background: 'oklch(0.12 0 0)', border: '1px solid oklch(1 0 0 / 8%)', borderRadius: '4px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'oklch(0.55 0 0)' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
