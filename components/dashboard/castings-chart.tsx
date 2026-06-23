'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { name: 'Concluído', value: 42, color: 'oklch(0.78 0.09 85)' },
  { name: 'Confirmado', value: 18, color: 'oklch(0.65 0.07 85)' },
  { name: 'Em Avaliação', value: 12, color: 'oklch(0.50 0.06 85)' },
  { name: 'Em Análise', value: 8, color: 'oklch(0.38 0.05 85)' },
  { name: 'Solicitado', value: 5, color: 'oklch(0.28 0.03 85)' },
]

export function CastingsChart() {
  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <div className="mb-6">
        <p className="text-xs tracking-widest uppercase text-muted-foreground">Castings por Status</p>
        <p className="font-heading text-2xl font-light text-foreground mt-1">85 castings</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => `${v} castings`}
            contentStyle={{ background: 'oklch(0.12 0 0)', border: '1px solid oklch(1 0 0 / 8%)', borderRadius: '4px', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: 'oklch(0.55 0 0)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
