'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { ApiFinanceRecord, ApiMonthlyRevenue, ApiExpense } from '@/lib/api'
import type { PaymentStatus } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, DollarSign, AlertCircle, Clock, Plus, Trash2, Scale } from 'lucide-react'
import { DateInput } from '@/components/ui/date-input'

const statusLabels: Record<PaymentStatus, string> = { pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado' }

const statusColors: Record<PaymentStatus, string> = {
  pago: 'text-primary bg-primary/10 border-primary/20',
  pendente: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  atrasado: 'text-destructive bg-destructive/10 border-destructive/20',
}

const fmt = (val: number, currency = 'BRL') =>
  val.toLocaleString('pt-BR', { style: 'currency', currency })

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-sm px-3 py-2 text-xs space-y-1">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

export default function FinanceiroPage() {
  const [filter, setFilter] = useState<'todos' | PaymentStatus>('todos')
  const [records, setRecords] = useState<ApiFinanceRecord[]>([])
  const [monthly, setMonthly] = useState<ApiMonthlyRevenue[]>([])
  const [expenses, setExpenses] = useState<ApiExpense[]>([])
  const [error, setError] = useState<string | null>(null)

  const blankExpense = { description: '', category: '', amount: '', date: '' }
  const [form, setForm] = useState(blankExpense)

  const load = useCallback(() => {
    return Promise.all([api.finance(), api.financeMonthly(), api.expenses()])
      .then(([rs, ms, es]) => { setRecords(rs); setMonthly(ms); setExpenses(es) })
      .catch(() => setError('Não foi possível carregar o financeiro. O backend está rodando?'))
  }, [])

  useEffect(() => { load() }, [load])

  async function changeStatus(id: string, status: string) {
    setError(null)
    try { await api.setFinanceStatus(id, status); await load() }
    catch { setError('Não foi possível atualizar o status.') }
  }

  async function addExpense() {
    if (!form.description.trim() || form.amount.trim() === '') return
    setError(null)
    try {
      await api.createExpense({
        description: form.description,
        category: form.category || undefined,
        amount: Number(form.amount),
        date: form.date || undefined,
      })
      setForm(blankExpense)
      await load()
    } catch { setError('Não foi possível lançar a despesa.') }
  }

  async function toggleExpense(e: ApiExpense) {
    try { await api.setExpenseStatus(e.id, e.status === 'pago' ? 'pendente' : 'pago'); await load() }
    catch { setError('Não foi possível atualizar a despesa.') }
  }

  async function removeExpense(id: string) {
    try { await api.deleteExpense(id); await load() }
    catch { setError('Não foi possível excluir a despesa.') }
  }

  const totalReceita = records.reduce((s, r) => s + r.cachet, 0)
  const totalComissoes = records.reduce((s, r) => s + r.agencyComission, 0)
  const totalRepasses = records.reduce((s, r) => s + r.modelValue, 0)
  const totalPendente = records.filter(r => r.status === 'pendente').reduce((s, r) => s + r.cachet, 0)
  const totalAtrasado = records.filter(r => r.status === 'atrasado').reduce((s, r) => s + r.cachet, 0)
  const totalDespesas = expenses.reduce((s, e) => s + e.amount, 0)
  const resultado = totalComissoes - totalDespesas // resultado da agência: comissões − despesas

  const filtered = filter === 'todos' ? records : records.filter(r => r.status === filter)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-light">Financeiro</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gestão de cachês e comissões</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Receita Total', value: totalReceita, icon: DollarSign, color: 'text-green-400', sub: 'todos os cachês' },
          { label: 'Comissões', value: totalComissoes, icon: TrendingUp, color: 'text-primary', sub: 'agência' },
          { label: 'Repasses', value: totalRepasses, icon: TrendingUp, color: 'text-blue-400', sub: 'para modelos' },
          { label: 'A Receber', value: totalPendente, icon: Clock, color: 'text-yellow-400', sub: 'pendente' },
          { label: 'Em Atraso', value: totalAtrasado, icon: AlertCircle, color: 'text-destructive', sub: 'atrasado' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="glass rounded-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-xl font-heading font-light">{fmt(value)}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-sm p-5">
          <h2 className="font-heading text-lg font-light mb-4">Receita por Mês</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthly} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(1 0 0 / 4%)' }} />
              <Bar dataKey="receita" name="Receita" fill="oklch(0.72 0.16 150)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="comissoes" name="Comissões" fill="oklch(0.80 0.13 85)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-sm p-5">
          <h2 className="font-heading text-lg font-light mb-4">Evolução de Repasses</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthly}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="repasses" name="Repasses" stroke="oklch(0.68 0.13 250)" strokeWidth={2} dot={{ fill: 'oklch(0.68 0.13 250)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela */}
      <div className="glass rounded-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading text-lg font-light">Transações</h2>
          <div className="flex rounded-sm border border-border overflow-hidden">
            {(['todos', 'pago', 'pendente', 'atrasado'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs tracking-wider capitalize transition-all ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}>
                {f === 'todos' ? 'Todos' : statusLabels[f]}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {['Modelo', 'Campanha', 'Marca', 'Data', 'Cachê', 'Comissão', 'Repasse', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma transação.</td></tr>
            )}
            {filtered.map((r, i) => (
              <tr key={r.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                <td className="px-4 py-3 text-sm font-medium">{r.modelName}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{r.campaign ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{r.brand ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                </td>
                <td className="px-4 py-3 text-sm">{fmt(r.cachet, r.currency)}</td>
                <td className="px-4 py-3 text-sm text-primary">{fmt(r.agencyComission, r.currency)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{fmt(r.modelValue, r.currency)}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={e => changeStatus(r.id, e.target.value)}
                    className={`text-xs px-2 py-0.5 rounded-sm border bg-transparent cursor-pointer focus:outline-none ${statusColors[r.status]}`}
                  >
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Despesas */}
      <div className="mt-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Comissões (entra)', value: totalComissoes, color: 'text-primary' },
            { label: 'Despesas (sai)', value: totalDespesas, color: 'text-destructive' },
            { label: 'Resultado', value: resultado, color: resultado >= 0 ? 'text-green-400' : 'text-destructive' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className={`text-xl font-heading font-light ${color}`}>{fmt(value)}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-heading text-lg font-light mb-3">Despesas</h2>
            {/* Nova despesa */}
            <div className="flex items-end gap-2 flex-wrap">
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Descrição" className="flex-1 min-w-[160px] bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="Categoria" className="w-36 bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="Valor (R$)" className="w-32 bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
              <DateInput value={form.date} onChange={iso => setForm({ ...form, date: iso })}
                className="bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
              <button onClick={addExpense}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-sm hover:opacity-90 transition-all">
                <Plus className="w-4 h-4" /> Lançar
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {['Descrição', 'Categoria', 'Valor', 'Data', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma despesa lançada.</td></tr>
              )}
              {expenses.map((e, i) => (
                <tr key={e.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3 text-sm font-medium">{e.description}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.category ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-destructive">{fmt(e.amount, e.currency)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleExpense(e)}
                      className={`text-xs px-2 py-0.5 rounded-sm border ${
                        e.status === 'pago'
                          ? 'text-primary bg-primary/10 border-primary/20'
                          : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                      }`}>
                      {e.status === 'pago' ? 'Pago' : 'Pendente'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeExpense(e.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
