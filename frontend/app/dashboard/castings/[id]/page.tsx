'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, MapPin, Calendar, Clock, DollarSign,
  User, Phone, Mail, Users, FileText, CheckCircle, XCircle, Clock3
} from 'lucide-react'
import { api, toModel } from '@/lib/api'
import type { ApiCasting, ApiModel } from '@/lib/api'
import type { CastingStatus } from '@/lib/types'

const statusLabels: Record<string, string> = {
  'requested': 'Solicitado',
  'reviewing': 'Em Análise',
  'models-submitted': 'Modelos Enviados',
  'evaluating': 'Em Avaliação',
  'confirmed': 'Confirmado',
  'completed': 'Concluído',
}

const statusColors: Record<string, string> = {
  'requested': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'reviewing': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'models-submitted': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'evaluating': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'confirmed': 'text-primary bg-primary/10 border-primary/20',
  'completed': 'text-muted-foreground bg-muted/30 border-border',
}

const modelStatusIcon: Record<string, React.ReactNode> = {
  'submitted': <Clock3 className="w-3 h-3 text-yellow-400" />,
  'approved': <CheckCircle className="w-3 h-3 text-primary" />,
  'rejected': <XCircle className="w-3 h-3 text-destructive" />,
  'pending': <Clock3 className="w-3 h-3 text-muted-foreground" />,
}

const modelStatusLabel: Record<string, string> = {
  submitted: 'Enviado', approved: 'Aprovado', rejected: 'Reprovado', pending: 'Pendente',
}

const formatCurrency = (v: number | null) =>
  v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (d: string | null) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—'

export default function CastingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [casting, setCasting] = useState<ApiCasting | null>(null)
  const [allModels, setAllModels] = useState<ApiModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pick, setPick] = useState('')

  const load = useCallback(() => {
    return Promise.all([api.casting(id), api.models()])
      .then(([c, ms]) => { setCasting(c); setAllModels(ms) })
      .catch(() => setError('Não foi possível carregar o casting.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  async function act(fn: () => Promise<unknown>) {
    setError(null)
    try { await fn(); await load() } catch { setError('A ação falhou. Tente novamente.') }
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>
  if (!casting) return <div className="p-6 text-sm text-red-400">{error ?? 'Casting não encontrado.'}</div>

  const approved = casting.models.filter(m => m.status === 'approved').length
  const availableModels = allModels
    .map(toModel)
    .filter(m => m.status !== 'inactive' && !casting.models.some(cm => cm.modelId === m.id))

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link href="/dashboard/castings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs text-primary font-medium tracking-widest uppercase">{casting.brand ?? 'Sem marca'}</span>
              <span className={`text-xs px-2.5 py-1 rounded-sm border font-medium ${statusColors[casting.status]}`}>
                {statusLabels[casting.status] ?? casting.status}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-light">{casting.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">Criado em {formatDate(casting.createdAt)}</p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="grid grid-cols-3 gap-6">
        {/* Col Principal */}
        <div className="col-span-2 space-y-6">
          <div className="glass rounded-sm p-6">
            <h2 className="font-heading text-xl font-light mb-4">Detalhes do Casting</h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { icon: Calendar, label: 'Data', value: formatDate(casting.date) },
                { icon: Clock, label: 'Horário', value: casting.time ?? '—' },
                { icon: MapPin, label: 'Local', value: `${casting.location ?? ''} — ${casting.city ?? ''}, ${casting.state ?? ''}` },
                { icon: Clock3, label: 'Duração do trabalho', value: casting.workDuration ?? '—' },
                { icon: DollarSign, label: 'Cachê', value: formatCurrency(casting.cachet) },
                { icon: Calendar, label: 'Prazo pagamento', value: casting.paymentDeadline ?? '—' },
                { icon: Calendar, label: 'Duração da campanha', value: casting.campaignDuration ?? '—' },
                { icon: Users, label: 'Modelos necessárias', value: `${casting.modelsNeeded} modelo${casting.modelsNeeded > 1 ? 's' : ''}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary mt-0.5" />
                <p className="text-xs text-muted-foreground">Briefing</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{casting.description}</p>
            </div>
          </div>

          <div className="glass rounded-sm p-6">
            <h2 className="font-heading text-xl font-light mb-3">Perfil Desejado</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{casting.desiredProfile}</p>
          </div>

          {/* Modelos no casting */}
          <div className="glass rounded-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-light">
                Modelos ({casting.models.length}/{casting.modelsNeeded})
              </h2>
              <div className="text-xs text-muted-foreground">{casting.modelsNeeded - approved} vagas restantes</div>
            </div>

            {casting.models.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div>
                  <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhuma modelo adicionada ainda</p>
                </div>
                {availableModels.length > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <select
                      value={pick}
                      onChange={e => setPick(e.target.value)}
                      className="bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors max-w-[220px]"
                    >
                      <option value="">Selecione um modelo…</option>
                      {availableModels.map(m => (
                        <option key={m.id} value={m.id}>{m.artisticName}</option>
                      ))}
                    </select>
                    <button
                      disabled={!pick}
                      onClick={() => act(() => api.addCastingModels(casting.id, [pick])).then(() => setPick(''))}
                      className="px-4 py-2 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      Escalar modelo
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Cadastre modelos para poder escalá-los neste casting.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {casting.models.map(cm => (
                  <div key={cm.modelId} className="flex items-center justify-between p-3 rounded-sm bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-sm bg-primary/15 text-primary flex items-center justify-center text-sm font-medium">
                        {cm.modelName.charAt(0)}
                      </span>
                      <Link href={`/dashboard/models/${cm.modelId}`} className="text-sm font-medium hover:text-primary transition-colors">
                        {cm.modelName}
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        {modelStatusIcon[cm.status]}
                        <span className="text-muted-foreground">{modelStatusLabel[cm.status]}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => act(() => api.decideCastingModel(casting.id, cm.modelId, 'approved'))}
                          className="text-xs px-2 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => act(() => api.decideCastingModel(casting.id, cm.modelId, 'rejected'))}
                          className="text-xs px-2 py-1 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all"
                        >
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

        {/* Coluna lateral */}
        <div className="space-y-6">
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-4">Responsável</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{casting.responsible ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">{casting.brand ?? ''}</p>
                </div>
              </div>
              <div className="space-y-2 pt-1">
                {casting.email && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <a href={`mailto:${casting.email}`} className="hover:text-foreground transition-colors truncate">{casting.email}</a>
                  </div>
                )}
                {casting.phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{casting.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sugerir / enviar modelo */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-4">Enviar Modelo</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {availableModels.length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhum modelo disponível.</p>
              )}
              {availableModels.map(m => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded-sm hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-sm bg-primary/15 text-primary flex items-center justify-center text-xs font-medium">
                      {m.artisticName.charAt(0)}
                    </span>
                    <div>
                      <p className="text-xs font-medium">{m.artisticName}</p>
                      <p className="text-xs text-muted-foreground">{m.height ? `${m.height}cm` : ''} · {m.city}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => act(() => api.addCastingModels(casting.id, [m.id]))}
                    className="text-xs px-2 py-1 rounded-sm border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:border-primary hover:text-primary transition-all"
                  >
                    Enviar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mudar status */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-4">Atualizar Status</h2>
            <div className="space-y-2">
              {(Object.keys(statusLabels) as CastingStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => act(() => api.setCastingStatus(casting.id, s))}
                  className={`w-full text-left px-3 py-2 rounded-sm text-xs border transition-all ${
                    casting.status === s
                      ? statusColors[s]
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
