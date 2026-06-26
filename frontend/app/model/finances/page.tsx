'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { ApiMeFinance } from '@/lib/api'
import { Briefcase, Wallet, Clock, TrendingDown } from 'lucide-react'

const fmt = (v: number, currency = 'BRL') => v.toLocaleString('pt-BR', { style: 'currency', currency })
const fmtDate = (d: string | null) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—')

const statusColors: Record<string, string> = {
  paid: 'text-primary bg-primary/10 border-primary/20',
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  overdue: 'text-destructive bg-destructive/10 border-destructive/20',
}
const statusLabel: Record<string, string> = { paid: 'Pago', pending: 'Pendente', overdue: 'Atrasado' }

export default function FinancasPage() {
  const [data, setData] = useState<ApiMeFinance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.meFinance()
      .then(setData)
      .catch(() => setError('Não foi possível carregar suas finanças.'))
      .finally(() => setLoading(false))
  }, [])

  const s = data?.summary

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-light">Minhas Finanças</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Seus cachês, repasses e comissões</p>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {s && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Trabalhos', value: String(s.jobs), icon: Briefcase, color: 'text-blue-400' },
              { label: 'Líquido recebido', value: fmt(s.netReceived), icon: Wallet, color: 'text-green-400' },
              { label: 'A receber', value: fmt(s.netPending), icon: Clock, color: 'text-yellow-400' },
              { label: 'Comissões (agência)', value: fmt(s.totalCommission), icon: TrendingDown, color: 'text-muted-foreground' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <p className="text-xl font-heading font-light">{value}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-heading text-lg font-light">Histórico de Trabalhos</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {['Campanha', 'Marca', 'Data', 'Cachê', 'Comissão', 'Repasse (você)', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.records.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum trabalho registrado.</td></tr>
                )}
                {data.records.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border/30 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3 text-sm font-medium">{r.campaign ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.brand ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{fmtDate(r.date)}</td>
                    <td className="px-4 py-3 text-sm">{fmt(r.cachet, r.currency)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{fmt(r.agencyComission, r.currency)}</td>
                    <td className="px-4 py-3 text-sm text-green-400">{fmt(r.modelValue, r.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-sm border ${statusColors[r.status]}`}>
                        {statusLabel[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
