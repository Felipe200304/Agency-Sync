'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { api, toModel } from '@/lib/api'
import type { ApiCasting, ApiModel } from '@/lib/api'
import {
  MapPin, Calendar, Clock, Users, DollarSign,
  ChevronRight, CheckCircle, Clock3, XCircle, Search, Plus
} from 'lucide-react'

const statusConfig: Record<string, { label: string; color: string }> = {
  solicitado: { label: 'Solicitado', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  'em-analise': { label: 'Em Análise', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  'modelos-enviados': { label: 'Modelos Enviados', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  'em-avaliacao': { label: 'Em Avaliação', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  confirmado: { label: 'Confirmado', color: 'text-primary bg-primary/10 border-primary/20' },
  concluido: { label: 'Concluído', color: 'text-muted-foreground bg-muted/30 border-border' },
}

const modelStatusIcon: Record<string, React.ReactNode> = {
  enviado: <Clock3 className="w-3.5 h-3.5 text-yellow-400" />,
  aprovado: <CheckCircle className="w-3.5 h-3.5 text-primary" />,
  reprovado: <XCircle className="w-3.5 h-3.5 text-destructive" />,
  pendente: <Clock3 className="w-3.5 h-3.5 text-muted-foreground" />,
}
const modelStatusLabel: Record<string, string> = {
  enviado: 'Enviado', aprovado: 'Aprovado', reprovado: 'Reprovado', pendente: 'Pendente',
}

const fmt = (v: number | null) => (v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
const fmtDate = (d: string | null) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—')

const tabs = ['Meus Castings', 'Solicitação', 'Explorar Modelos'] as const
type Tab = typeof tabs[number]

export default function ClientePage() {
  const [tab, setTab] = useState<Tab>('Meus Castings')
  const [castings, setCastings] = useState<ApiCasting[]>([])
  const [allModels, setAllModels] = useState<ApiModel[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    return Promise.all([api.meCastings(), api.models()])
      .then(([cs, ms]) => {
        setCastings(cs)
        setAllModels(ms)
        setSelectedId(prev => prev ?? cs[0]?.id ?? null)
      })
      .catch(() => setError('Não foi possível carregar seus castings.'))
  }, [])

  useEffect(() => { load() }, [load])

  async function decide(castingId: string, modelId: string, status: string) {
    setError(null)
    try { await api.decideMeCastingModel(castingId, modelId, status); await load() }
    catch { setError('A ação falhou. Tente novamente.') }
  }

  const selected = castings.find(c => c.id === selectedId) ?? null
  const activeCastings = castings.filter(c => c.status !== 'concluido')
  const totalModels = castings.reduce((s, c) => s + c.models.length, 0)
  const exploreModels = allModels.map(toModel).filter(m =>
    m.artisticName.toLowerCase().includes(search.toLowerCase()) ||
    m.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-light text-foreground">Bem-vindo</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie seus castings e encontre os talentos ideais para suas campanhas.</p>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Castings Ativos', value: String(activeCastings.length), icon: Clock, color: 'text-primary' },
          { label: 'Total de Castings', value: String(castings.length), icon: Calendar, color: 'text-blue-400' },
          { label: 'Modelos Enviadas', value: String(totalModels), icon: Users, color: 'text-purple-400' },
          { label: 'Modelos no banco', value: String(allModels.length), icon: DollarSign, color: 'text-green-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-heading font-light text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm tracking-wide transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ---- Meus Castings ---- */}
      {tab === 'Meus Castings' && (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {castings.length === 0 ? (
              <div className="text-center py-16 bg-card border border-dashed border-border rounded-sm">
                <p className="text-sm text-muted-foreground">Nenhum casting ainda.</p>
                <Link href="/cliente/novo-casting" className="mt-3 inline-block text-xs text-primary hover:underline">Solicitar casting</Link>
              </div>
            ) : (
              castings.map(c => {
                const cfg = statusConfig[c.status]
                const isSelected = selectedId === c.id
                return (
                  <button key={c.id} onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left p-4 rounded-sm border transition-all ${
                      isSelected ? 'bg-primary/5 border-primary/30' : 'bg-card border-border hover:border-border/80 hover:bg-muted/20'
                    }`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">{c.title}</p>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-sm border ${cfg?.color ?? ''}`}>{cfg?.label ?? c.status}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtDate(c.date)}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{c.models.length}/{c.modelsNeeded}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          <div className="lg:col-span-3">
            {!selected ? (
              <div className="flex items-center justify-center h-full min-h-64 text-muted-foreground text-sm bg-card border border-dashed border-border rounded-sm">
                Selecione um casting para ver os detalhes
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-sm p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-primary tracking-widest uppercase mb-1">{selected.brand ?? 'Sem marca'}</p>
                      <h2 className="font-heading text-xl font-light text-foreground">{selected.title}</h2>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-sm border flex-shrink-0 ${statusConfig[selected.status]?.color ?? ''}`}>
                      {statusConfig[selected.status]?.label ?? selected.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { icon: Calendar, label: 'Data', value: fmtDate(selected.date) },
                      { icon: Clock, label: 'Horário', value: selected.time ?? '—' },
                      { icon: MapPin, label: 'Local', value: `${selected.city ?? ''}, ${selected.state ?? ''}` },
                      { icon: DollarSign, label: 'Cachê por modelo', value: fmt(selected.cachet) },
                      { icon: Users, label: 'Modelos necessárias', value: String(selected.modelsNeeded) },
                      { icon: Clock, label: 'Prazo pagamento', value: selected.paymentDeadline ?? '—' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-2">
                        <Icon className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="text-sm text-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Perfil desejado</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selected.desiredProfile}</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-sm p-5">
                  <h3 className="font-heading text-base font-light text-foreground mb-4">
                    Modelos Enviadas ({selected.models.length}/{selected.modelsNeeded})
                  </h3>
                  {selected.models.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      A agência ainda não enviou modelos para este casting.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selected.models.map(cm => (
                        <div key={cm.modelId} className="flex items-center gap-3 p-3 bg-muted/30 rounded-sm border border-border/50">
                          <span className="w-12 h-12 rounded-sm bg-primary/15 text-primary flex items-center justify-center text-base font-medium flex-shrink-0">
                            {cm.modelName.charAt(0)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{cm.modelName}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              {modelStatusIcon[cm.status]}
                              <span>{modelStatusLabel[cm.status]}</span>
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => decide(selected.id, cm.modelId, 'aprovado')}
                                className="text-xs px-2.5 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                                Aprovar
                              </button>
                              <button onClick={() => decide(selected.id, cm.modelId, 'reprovado')}
                                className="text-xs px-2.5 py-1 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all">
                                Reprovar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- Solicitação ---- */}
      {tab === 'Solicitação' && (
        <div className="max-w-2xl">
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <h2 className="font-heading text-xl font-light text-foreground mb-2">Solicitar um novo casting</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Preencha os detalhes da sua campanha e nossa equipe entrará em contato em até 24h.
            </p>
            <Link href="/cliente/novo-casting"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-sm text-sm hover:opacity-90 transition-all tracking-wide">
              <Plus className="w-4 h-4" />
              Solicitar Casting
            </Link>
          </div>
        </div>
      )}

      {/* ---- Explorar Modelos ---- */}
      {tab === 'Explorar Modelos' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-sm px-3 py-2.5 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input type="search" placeholder="Buscar por nome ou cidade..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1" />
            </div>
            <span className="text-xs text-muted-foreground">{exploreModels.length} modelos</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {exploreModels.map(m => (
              <div key={m.id} className="group">
                <div className="aspect-[3/4] rounded-sm overflow-hidden mb-2 relative">
                  <img src={m.photo} alt={m.artisticName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {m.status === 'disponivel' && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-400 rounded-full border border-background" />
                  )}
                </div>
                <p className="text-sm font-medium text-foreground leading-tight">{m.artisticName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.height ? `${m.height}cm` : ''} · {m.city}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
