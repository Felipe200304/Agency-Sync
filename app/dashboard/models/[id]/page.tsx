import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Link2, ExternalLink, MapPin, CheckCircle2, Clock } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { models } from '@/lib/mock-data'

const statusLabel: Record<string, { label: string; color: string }> = {
  'disponivel': { label: 'Disponível', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  'em-campanha': { label: 'Em Campanha', color: 'text-primary bg-primary/10 border-primary/20' },
  'inativo': { label: 'Inativo', color: 'text-muted-foreground bg-muted/50 border-border' },
}

const paymentColors: Record<string, string> = {
  pago: 'text-green-400',
  pendente: 'text-primary',
  atrasado: 'text-destructive',
}

export default async function ModelProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const model = models.find(m => m.id === id)
  if (!model) notFound()

  const s = statusLabel[model.status]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title={model.artisticName} />

      <div className="flex-1 p-6 overflow-y-auto">
        <Link href="/dashboard/models" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          Voltar para Modelos
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Photos + quick info */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden">
              <img src={model.photo} alt={model.artisticName} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className={`text-xs px-2.5 py-1 rounded-sm border ${s.color}`}>{s.label}</span>
              </div>
            </div>

            {/* Thumbnail gallery */}
            {model.photos.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {model.photos.slice(0, 3).map((ph, i) => (
                  <div key={i} className="aspect-[3/4] rounded-sm overflow-hidden">
                    <img src={ph} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Social */}
            <div className="bg-card border border-border rounded-sm p-4 space-y-2">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Redes Sociais</p>
              <a href={`https://instagram.com/${model.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                <Link2 className="w-4 h-4" />
                {model.instagram}
                <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
              </a>
              {model.tiktok && (
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <span className="w-4 h-4 text-center text-xs font-bold">T</span>
                  {model.tiktok}
                </div>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="bg-card border border-border rounded-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-heading text-3xl font-light text-foreground">{model.artisticName}</h2>
                  <p className="text-sm text-muted-foreground">{model.name}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {model.city}, {model.state}
                  </div>
                </div>
                <Link href={`/dashboard/models/${model.id}`}
                  className="px-4 py-2 border border-border text-sm text-foreground/70 rounded-sm hover:border-primary/50 hover:text-primary transition-colors">
                  Editar Perfil
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {model.experience.map(exp => (
                  <span key={exp} className="text-xs px-2.5 py-1 bg-muted rounded-sm text-muted-foreground">{exp}</span>
                ))}
              </div>
            </div>

            {/* Measurements */}
            <div className="bg-card border border-border rounded-sm p-6">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-5">Medidas e Características</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Altura', value: `${model.height} cm` },
                  { label: 'Peso', value: `${model.weight} kg` },
                  { label: 'Busto', value: `${model.bust} cm` },
                  { label: 'Cintura', value: `${model.waist} cm` },
                  { label: 'Quadril', value: `${model.hips} cm` },
                  { label: 'Manequim', value: String(model.size) },
                  { label: 'Calçado', value: String(model.shoe) },
                  { label: 'Olhos', value: model.eyeColor },
                  { label: 'Cabelo', value: model.hairColor },
                  { label: 'Comissão', value: `${model.agencyComission}%` },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 bg-muted/30 rounded-sm">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Work history */}
            <div className="bg-card border border-border rounded-sm p-6">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-5">Histórico de Trabalhos</p>
              {model.worksHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum trabalho registrado.</p>
              ) : (
                <div className="space-y-4">
                  {model.worksHistory.map(work => (
                    <div key={work.id} className="border border-border rounded-sm p-4 hover:border-border/80 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">{work.campaign}</p>
                          <p className="text-xs text-muted-foreground">{work.brand}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {work.paymentStatus === 'pago' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-primary" />
                          )}
                          <span className={`text-xs font-medium ${paymentColors[work.paymentStatus]}`}>
                            {work.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                        <span>{new Date(work.date).toLocaleDateString('pt-BR')}</span>
                        <span>{work.location}</span>
                        <span className="font-medium text-foreground">R$ {work.cachet.toLocaleString('pt-BR')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{work.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
