'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { ApiCasting } from '@/lib/api'
import type { CastingStatus } from '@/lib/types'
import { Plus, MapPin, DollarSign, Calendar, Users } from 'lucide-react'

const columns: { status: CastingStatus; label: string; color: string }[] = [
  { status: 'solicitado',       label: 'Solicitado',       color: 'text-blue-400' },
  { status: 'em-analise',       label: 'Em Análise',       color: 'text-yellow-400' },
  { status: 'modelos-enviados', label: 'Modelos Enviados', color: 'text-orange-400' },
  { status: 'em-avaliacao',     label: 'Em Avaliação',     color: 'text-purple-400' },
  { status: 'confirmado',       label: 'Confirmado',       color: 'text-primary' },
  { status: 'concluido',        label: 'Concluído',        color: 'text-muted-foreground' },
]

const statusDot: Record<CastingStatus, string> = {
  'solicitado':       'bg-blue-400',
  'em-analise':       'bg-yellow-400',
  'modelos-enviados': 'bg-orange-400',
  'em-avaliacao':     'bg-purple-400',
  'confirmado':       'bg-primary',
  'concluido':        'bg-muted-foreground',
}

function formatCurrency(val: number | null) {
  if (val == null) return '—'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(d: string | null) {
  return d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—'
}

export default function CastingsPage() {
  const [view, setView] = useState<'kanban' | 'lista'>('kanban')
  const [castings, setCastings] = useState<ApiCasting[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.castings()
      .then(setCastings)
      .catch(() => setError('Não foi possível carregar os castings. O backend está rodando?'))
  }, [])

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-light">Castings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{castings.length} solicitações no pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-sm border border-border overflow-hidden">
            {(['kanban', 'lista'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-xs tracking-wider transition-all ${
                  view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {v === 'kanban' ? 'Kanban' : 'Lista'}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/castings/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Casting
          </Link>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {view === 'kanban' ? (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {columns.map(col => {
              const colCastings = castings.filter(c => c.status === col.status)
              return (
                <div key={col.status} className="w-72 flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusDot[col.status]}`} />
                      <span className={`text-xs font-medium tracking-wider uppercase ${col.color}`}>{col.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted/50 rounded-sm px-1.5 py-0.5">
                      {colCastings.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {colCastings.length === 0 && (
                      <div className="glass rounded-sm p-4 text-center text-xs text-muted-foreground border-dashed">
                        Nenhum casting
                      </div>
                    )}
                    {colCastings.map(c => (
                      <Link key={c.id} href={`/dashboard/castings/${c.id}`}>
                        <div className="glass rounded-sm p-4 hover:border-primary/30 transition-all cursor-pointer group">
                          <p className="text-xs text-primary font-medium tracking-wider mb-1">{c.brand}</p>
                          <h3 className="text-sm font-medium leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {c.title}
                          </h3>
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(c.date)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {c.city}, {c.state}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <DollarSign className="w-3 h-3" />
                              {formatCurrency(c.cachet)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>{c.models.length}/{c.modelsNeeded} modelos</span>
                            </div>
                            <div className="flex -space-x-1">
                              {c.models.slice(0, 3).map(m => (
                                <span
                                  key={m.modelId}
                                  title={m.modelName}
                                  className="w-5 h-5 rounded-full border border-background bg-primary/20 text-primary text-[9px] flex items-center justify-center font-medium"
                                >
                                  {m.modelName.charAt(0)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="glass rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Casting', 'Marca', 'Data', 'Local', 'Cachet', 'Modelos', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {castings.map((c, i) => {
                const col = columns.find(cl => cl.status === c.status)!
                return (
                  <tr key={c.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/castings/${c.id}`} className="text-sm hover:text-primary transition-colors line-clamp-1">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.brand}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(c.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.city}, {c.state}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatCurrency(c.cachet)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.models.length}/{c.modelsNeeded}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 text-xs ${col.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[c.status]}`} />
                        {col.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
