import Link from 'next/link'
import { notFound } from 'next/navigation'
import { castings, models } from '@/lib/mock-data'
import {
  ArrowLeft, MapPin, Calendar, Clock, DollarSign,
  User, Phone, Mail, Users, FileText, CheckCircle, XCircle, Clock3
} from 'lucide-react'
import type { CastingStatus } from '@/lib/types'

const statusLabels: Record<CastingStatus, string> = {
  'solicitado':       'Solicitado',
  'em-analise':       'Em Análise',
  'modelos-enviados': 'Modelos Enviados',
  'em-avaliacao':     'Em Avaliação',
  'confirmado':       'Confirmado',
  'concluido':        'Concluído',
}

const statusColors: Record<CastingStatus, string> = {
  'solicitado':       'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'em-analise':       'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'modelos-enviados': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'em-avaliacao':     'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'confirmado':       'text-primary bg-primary/10 border-primary/20',
  'concluido':        'text-muted-foreground bg-muted/30 border-border',
}

const modelStatusIcon = {
  'enviado':   <Clock3 className="w-3 h-3 text-yellow-400" />,
  'aprovado':  <CheckCircle className="w-3 h-3 text-primary" />,
  'reprovado': <XCircle className="w-3 h-3 text-destructive" />,
  'pendente':  <Clock3 className="w-3 h-3 text-muted-foreground" />,
}

const modelStatusLabel = {
  'enviado':   'Enviado',
  'aprovado':  'Aprovado',
  'reprovado': 'Reprovado',
  'pendente':  'Pendente',
}

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function CastingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const casting = castings.find(c => c.id === id)
  if (!casting) notFound()

  const castingModelsFull = casting.models.map(cm => ({
    ...cm,
    fullModel: models.find(m => m.id === cm.modelId),
  }))

  const availableModels = models.filter(
    m => !casting.models.find(cm => cm.modelId === m.id) && m.status !== 'inativo'
  )

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
              <span className="text-xs text-primary font-medium tracking-widest uppercase">{casting.brand}</span>
              <span className={`text-xs px-2.5 py-1 rounded-sm border font-medium ${statusColors[casting.status]}`}>
                {statusLabels[casting.status]}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-light">{casting.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">Criado em {new Date(casting.createdAt + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-sm text-sm text-muted-foreground hover:text-foreground transition-all">
            Editar
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-primary/90 transition-all">
            Adicionar Modelos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Col Principal */}
        <div className="col-span-2 space-y-6">
          {/* Detalhes */}
          <div className="glass rounded-sm p-6">
            <h2 className="font-heading text-xl font-light mb-4">Detalhes do Casting</h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { icon: Calendar, label: 'Data', value: new Date(casting.date + 'T12:00:00').toLocaleDateString('pt-BR') },
                { icon: Clock, label: 'Horário', value: casting.time },
                { icon: MapPin, label: 'Local', value: `${casting.location} — ${casting.city}, ${casting.state}` },
                { icon: Clock3, label: 'Duração do trabalho', value: casting.workDuration },
                { icon: DollarSign, label: 'Cachê', value: formatCurrency(casting.cachet) },
                { icon: Calendar, label: 'Prazo pagamento', value: casting.paymentDeadline },
                { icon: Calendar, label: 'Duração da campanha', value: casting.campaignDuration },
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

          {/* Perfil desejado */}
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
              <div className="text-xs text-muted-foreground">
                {casting.modelsNeeded - casting.models.filter(m => m.status === 'aprovado').length} vagas restantes
              </div>
            </div>

            {castingModelsFull.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma modelo adicionada ainda</p>
            ) : (
              <div className="space-y-3">
                {castingModelsFull.map(cm => (
                  <div key={cm.modelId} className="flex items-center justify-between p-3 rounded-sm bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <img src={cm.modelPhoto} alt={cm.modelName} className="w-10 h-10 rounded-sm object-cover" />
                      <div>
                        <Link href={`/dashboard/models/${cm.modelId}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {cm.modelName}
                        </Link>
                        {cm.fullModel && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cm.fullModel.height}cm · {cm.fullModel.city}, {cm.fullModel.state}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        {modelStatusIcon[cm.status]}
                        <span className="text-muted-foreground">{modelStatusLabel[cm.status]}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                          Aprovar
                        </button>
                        <button className="text-xs px-2 py-1 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all">
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
          {/* Contato */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-4">Responsável</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{casting.responsible}</p>
                  <p className="text-xs text-muted-foreground">{casting.brand}</p>
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <a href={`mailto:${casting.email}`} className="hover:text-foreground transition-colors truncate">{casting.email}</a>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{casting.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modelos disponíveis para sugestão */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-4">Sugerir Modelo</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {availableModels.map(m => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded-sm hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-2">
                    <img src={m.photo} alt={m.artisticName} className="w-8 h-8 rounded-sm object-cover" />
                    <div>
                      <p className="text-xs font-medium">{m.artisticName}</p>
                      <p className="text-xs text-muted-foreground">{m.height}cm · {m.size}</p>
                    </div>
                  </div>
                  <button className="text-xs px-2 py-1 rounded-sm border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:border-primary hover:text-primary transition-all">
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
