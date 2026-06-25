'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { api } from '@/lib/api'
import type { ApiMonthlyRevenue } from '@/lib/api'

const formatBRL = (v: number) => `R$ ${(v / 1000).toFixed(0)}k`

export function RevenueChart() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<ApiMonthlyRevenue[]>([])

  useEffect(() => { api.financeMonthly().then(setMonthlyRevenue).catch(() => {}) }, [])

  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <div className="mb-6">
        <p className="text-xs tracking-widest uppercase text-muted-foreground">Receita Mensal</p>
        <p className="font-heading text-2xl font-light text-foreground mt-1">Últimos 6 meses</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.80 0.13 85)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="oklch(0.80 0.13 85)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRepasses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.72 0.14 165)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.72 0.14 165)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
          <XAxis dataKey="month" tick={{ fill: 'oklch(0.50 0 0)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatBRL} tick={{ fill: 'oklch(0.50 0 0)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR')}`}
            contentStyle={{ background: 'oklch(0.12 0 0)', border: '1px solid oklch(1 0 0 / 8%)', borderRadius: '4px', fontSize: '12px' }}
            labelStyle={{ color: 'oklch(0.85 0 0)' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: 'oklch(0.55 0 0)' }} />
          <Area type="monotone" dataKey="receita" name="Receita" stroke="oklch(0.80 0.13 85)" fill="url(#colorReceita)" strokeWidth={2} />
          <Area type="monotone" dataKey="repasses" name="Repasses" stroke="oklch(0.72 0.14 165)" fill="url(#colorRepasses)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
