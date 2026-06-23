'use client'

import { useState } from 'react'
import Link from 'next/link'
import { castings, models } from '@/lib/mock-data'
import type { CastingStatus } from '@/lib/types'
import {
  Bell, LogOut, MapPin, Calendar, Clock, Users, DollarSign,
  ChevronRight, Plus, CheckCircle, Clock3, XCircle, Search
} from 'lucide-react'

// Simula a marca logada
const BRAND = 'Animale'
const myCastings = castings.filter(c => c.brand === BRAND)

const statusConfig: Record<CastingStatus, { label: string; color: string }> = {
  solicitado:       { label: 'Solicitado',       color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  'em-analise':     { label: 'Em Análise',       color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  'modelos-enviados':{ label: 'Modelos Enviados', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  'em-avaliacao':   { label: 'Em Avaliação',     color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  confirmado:       { label: 'Confirmado',       color: 'text-primary bg-primary/10 border-primary/20' },
  concluido:        { label: 'Concluído',        color: 'text-muted-foreground bg-muted/30 border-border' },
}

const modelStatusIcon = {
  enviado:   <Clock3 className="w-3.5 h-3.5 text-yellow-400" />,
  aprovado:  <CheckCircle className="w-3.5 h-3.5 text-primary" />,
  reprovado: <XCircle className="w-3.5 h-3.5 text-destructive" />,
  pendente:  <Clock3 className="w-3.5 h-3.5 text-muted-foreground" />,
}
const modelStatusLabel = {
  enviado: 'Enviado', aprovado: 'Aprovado', reprovado: 'Reprovado', pendente: 'Pendente',
}

function fmt(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const tabs = ['Meus Castings', 'Solicitação', 'Explorar Modelos'] as const
type Tab = typeof tabs[number]

export default function ClientePage() {
  const [tab, setTab] = useState<Tab>('Meus Castings')
  const [selectedCasting, setSelectedCasting] = useState(myCastings[0] ?? null)
  const [search, setSearch] = useState('')

  const activeCastings = myCastings.filter(c => c.status !== 'concluido')
  const totalCachet = myCastings.reduce((s, c) => s + c.cachet * c.models.length, 0)

  const filteredModels = models.filter(m =>
    m.artisticName.toLowerCase().includes(search.toLowerCase()) ||
    m.city.toLowerCase().includes(search.toLowerCase()) ||
    m.experience.some(e => e.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-card sticky top-0 z-10">
        <span className="font-heading text-xl tracking-widest gold-text font-light">AGENCY SYNC</span>
        <span className="text-muted-foreground/30 text-lg font-thin">|</span>
        <span className="text-sm text-muted-foreground">{BRAND}</span>
        <div className="flex-1" />
        <button className="relative w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">A</span>
        </div>
        <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <LogOut className="w-4 h-4" />
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-light text-foreground">
            Bem-vindo, <span className="gold-text">{BRAND}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie seus castings e encontre os talentos ideais para suas campanhas.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Castings Ativos',   value: String(activeCastings.length),   icon: Clock,    color: 'text-primary' },
            { label: 'Total de Castings', value: String(myCastings.length),        icon: Calendar, color: 'text-blue-400' },
            { label: 'Modelos Enviadas',  value: String(myCastings.reduce((s, c) => s + c.models.length, 0)), icon: Users, color: 'text-purple-400' },
            { label: 'Investimento',      value: fmt(totalCachet),                 icon: DollarSign, color: 'text-yellow-400' },
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
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm tracking-wide transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ---- Meus Castings ---- */}
        {tab === 'Meus Castings' && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Lista */}
            <div className="lg:col-span-2 space-y-3">
              {myCastings.length === 0 ? (
                <div className="text-center py-16 bg-card border border-dashed border-border rounded-sm">
                  <p className="text-sm text-muted-foreground">Nenhum casting ainda.</p>
                  <button onClick={() => setTab('Solicitação')}
                    className="mt-3 text-xs text-primary hover:underline">
                    Solicitar casting
                  </button>
                </div>
              ) : (
                myCastings.map(c => {
                  const cfg = statusConfig[c.status]
                  const isSelected = selectedCasting?.id === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCasting(c)}
                      className={`w-full text-left p-4 rounded-sm border transition-all ${
                        isSelected
                          ? 'bg-primary/5 border-primary/30'
                          : 'bg-card border-border hover:border-border/80 hover:bg-muted/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">{c.title}</p>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-sm border ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(c.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {c.models.length}/{c.modelsNeeded}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            {/* Detalhe */}
            <div className="lg:col-span-3">
              {!selectedCasting ? (
                <div className="flex items-center justify-center h-full min-h-64 text-muted-foreground text-sm bg-card border border-dashed border-border rounded-sm">
                  Selecione um casting para ver os detalhes
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Info principal */}
                  <div className="bg-card border border-border rounded-sm p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs text-primary tracking-widest uppercase mb-1">{selectedCasting.brand}</p>
                        <h2 className="font-heading text-xl font-light text-foreground">{selectedCasting.title}</h2>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-sm border flex-shrink-0 ${statusConfig[selectedCasting.status].color}`}>
                        {statusConfig[selectedCasting.status].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { icon: Calendar, label: 'Data', value: new Date(selectedCasting.date + 'T12:00:00').toLocaleDateString('pt-BR') },
                        { icon: Clock, label: 'Horário', value: selectedCasting.time },
                        { icon: MapPin, label: 'Local', value: `${selectedCasting.city}, ${selectedCasting.state}` },
                        { icon: DollarSign, label: 'Cachê por modelo', value: fmt(selectedCasting.cachet) },
                        { icon: Users, label: 'Modelos necessárias', value: String(selectedCasting.modelsNeeded) },
                        { icon: Clock, label: 'Prazo pagamento', value: selectedCasting.paymentDeadline },
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
                      <p className="text-sm text-foreground/80 leading-relaxed">{selectedCasting.desiredProfile}</p>
                    </div>
                  </div>

                  {/* Modelos enviadas */}
                  <div className="bg-card border border-border rounded-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-base font-light text-foreground">
                        Modelos Enviadas ({selectedCasting.models.length}/{selectedCasting.modelsNeeded})
                      </h3>
                    </div>
                    {selectedCasting.models.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        A agência ainda não enviou modelos para este casting.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedCasting.models.map(cm => {
                          const fullModel = models.find(m => m.id === cm.modelId)
                          return (
                            <div key={cm.modelId} className="flex items-center gap-3 p-3 bg-muted/30 rounded-sm border border-border/50">
                              <img
                                src={cm.modelPhoto}
                                alt={cm.modelName}
                                className="w-12 h-12 rounded-sm object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{cm.modelName}</p>
                                {fullModel && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {fullModel.height}cm · Man. {fullModel.size} · {fullModel.city}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  {modelStatusIcon[cm.status]}
                                  <span>{modelStatusLabel[cm.status]}</span>
                                </div>
                                <div className="flex gap-1.5">
                                  <button className="text-xs px-2.5 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                                    Aprovar
                                  </button>
                                  <button className="text-xs px-2.5 py-1 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all">
                                    Reprovar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
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
          <div className="max-w-2xl space-y-5">
            <p className="text-sm text-muted-foreground">
              Preencha o formulário abaixo e nossa equipe entrará em contato em até 24h.
            </p>

            {/* Dados do trabalho */}
            <div className="bg-card border border-border rounded-sm p-6 space-y-4">
              <h2 className="font-heading text-lg font-light text-foreground">Dados do Trabalho</h2>
              <div>
                <label className="text-xs text-muted-foreground tracking-widest uppercase">Título da campanha</label>
                <input className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Ex: Campanha Verão 2026 — Linha Premium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase">Data do casting</label>
                  <input type="date" className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase">Horário</label>
                  <input type="time" className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase">Cidade</label>
                  <input className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="São Paulo" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase">Qtd. de modelos</label>
                  <input type="number" min="1" className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase">Cachê por modelo (R$)</label>
                  <input type="number" className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-widest uppercase">Duração da campanha</label>
                  <input className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Ex: 3 meses" />
                </div>
              </div>
            </div>

            {/* Briefing */}
            <div className="bg-card border border-border rounded-sm p-6 space-y-4">
              <h2 className="font-heading text-lg font-light text-foreground">Briefing</h2>
              <div>
                <label className="text-xs text-muted-foreground tracking-widest uppercase">Perfil desejado</label>
                <textarea className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none h-24" placeholder="Descreva altura, tipo físico, cor de cabelo, estilo..." />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-widest uppercase">Descrição do trabalho</label>
                <textarea className="mt-1.5 w-full bg-muted/40 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none h-28" placeholder="Descreva o tipo de conteúdo, uso das imagens, referências visuais..." />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setTab('Meus Castings')} className="px-5 py-2.5 border border-border rounded-sm text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-sm text-sm hover:opacity-90 transition-all tracking-wide">
                Enviar Solicitação
              </button>
            </div>
          </div>
        )}

        {/* ---- Explorar Modelos ---- */}
        {tab === 'Explorar Modelos' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-sm px-3 py-2.5 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="search"
                  placeholder="Buscar por nome, cidade ou categoria..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
                />
              </div>
              <span className="text-xs text-muted-foreground">{filteredModels.length} modelos</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredModels.map(m => (
                <div key={m.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] rounded-sm overflow-hidden mb-2 relative">
                    <img
                      src={m.photo}
                      alt={m.artisticName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-sm hover:opacity-90 transition-all">
                        Ver Perfil
                      </button>
                    </div>
                    {m.status === 'disponivel' && (
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-400 rounded-full border border-background" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground leading-tight">{m.artisticName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.height}cm · {m.city}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {m.experience.slice(0, 2).map(e => (
                      <span key={e} className="text-[10px] px-1.5 py-0.5 bg-muted rounded-sm text-muted-foreground">{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
