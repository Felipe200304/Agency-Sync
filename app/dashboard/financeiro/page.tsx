'use client'

import { useState } from 'react'
import { financeRecords, monthlyRevenue } from '@/lib/mock-data'
import type { PaymentStatus } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react'

const statusLabels: Record<PaymentStatus, string> = {
  pago:     'Pago',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
}

const statusColors: Record<PaymentStatus, string> = {
  pago:     'text-primary bg-primary/10 border-primary/20',
  pendente: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  atrasado: 'text-destructive bg-destructive/10 border-destructive/20',
}

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-sm px-3 py-2 text-xs space-y-1">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function FinanceiroPage() {
  const [filter, setFilter] = useState<'todos' | PaymentStatus>('todos')

  const totalReceita = financeRecords.reduce((s, r) => s + r.cachet, 0)
  const totalComissoes = financeRecords.reduce((s, r) => s + r.agencyComission, 0)
  const totalRepasses = financeRecords.reduce((s, r) => s + r.modelValue, 0)
  const totalPendente = financeRecords.filter(r => r.status === 'pendente').reduce((s, r) => s + r.cachet, 0)
  const totalAtrasado = financeRecords.filter(r => r.status === 'atrasado').reduce((s, r) => s + r.cachet, 0)

  const filtered = filter === 'todos'
    ? financeRecords
    : financeRecords.filter(r => r.status === filter)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-light">Financeiro</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gestão de cachês e comissões</p>
        </div>
        <button className="px-4 py-2 border border-border rounded-sm text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
          Exportar Relatorio
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Receita Total', value: totalReceita, icon: DollarSign, color: 'text-primary', sub: 'todos os cachês' },
          { label: 'Comissoes', value: totalComissoes, icon: TrendingUp, color: 'text-primary', sub: 'agência' },
          { label: 'Repasses', value: totalRepasses, icon: TrendingUp, color: 'text-blue-400', sub: 'para modelos' },
          { label: 'A Receber', value: totalPendente, icon: Clock, color: 'text-yellow-400', sub: 'pendente' },
          { label: 'Em Atraso', value: totalAtrasado, icon: AlertCircle, color: 'text-destructive', sub: 'atrasado' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="glass rounded-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-xl font-heading font-light">{formatCurrency(value)}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-sm p-5">
          <h2 className="font-heading text-lg font-light mb-4">Receita por Mes</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyRevenue} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="receita" name="Receita" fill="oklch(0.78 0.09 85)" radius={[2,2,0,0]} />
              <Bar dataKey="comissoes" name="Comissoes" fill="oklch(0.78 0.09 85 / 40%)" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-sm p-5">
          <h2 className="font-heading text-lg font-light mb-4">Evolucao de Repasses</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="repasses" name="Repasses" stroke="oklch(0.78 0.09 85)" strokeWidth={2} dot={{ fill: 'oklch(0.78 0.09 85)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela */}
      <div className="glass rounded-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading text-lg font-light">Transacoes</h2>
          <div className="flex rounded-sm border border-border overflow-hidden">
            {(['todos', 'pago', 'pendente', 'atrasado'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs tracking-wider capitalize transition-all ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f === 'todos' ? 'Todos' : statusLabels[f]}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {['Modelo', 'Campanha', 'Marca', 'Data', 'Cachet', 'Comissao', 'Repasse', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                <td className="px-4 py-3 text-sm font-medium">{r.modelName}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{r.campaign}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{r.brand}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-sm">{formatCurrency(r.cachet)}</td>
                <td className="px-4 py-3 text-sm text-primary">{formatCurrency(r.agencyComission)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatCurrency(r.modelValue)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-sm border ${statusColors[r.status]}`}>
                    {statusLabels[r.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
