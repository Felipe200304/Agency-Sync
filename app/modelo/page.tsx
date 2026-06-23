import { models } from '@/lib/mock-data'
import { Link2, MapPin, Ruler, Weight, CheckCircle, Clock, XCircle } from 'lucide-react'

// Simulating logged-in model: Bella Ferreira
const model = models[0]

const paymentColors = {
  pago: 'text-primary bg-primary/10 border-primary/20',
  pendente: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  atrasado: 'text-destructive bg-destructive/10 border-destructive/20',
}
const paymentLabels = { pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado' }

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ModeloPage() {
  const totalEarned = model.worksHistory
    .filter(w => w.paymentStatus === 'pago')
    .reduce((s, w) => s + (w.cachet * (1 - model.agencyComission / 100)), 0)

  const pendingValue = model.worksHistory
    .filter(w => w.paymentStatus !== 'pago')
    .reduce((s, w) => s + (w.cachet * (1 - model.agencyComission / 100)), 0)

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Hero */}
      <div className="glass rounded-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-6 mb-5">
            <img
              src={model.photo}
              alt={model.artisticName}
              className="w-24 h-24 rounded-sm object-cover border-2 border-background ring-1 ring-primary/30"
            />
            <div className="mb-2">
              <h1 className="font-heading text-3xl font-light">{model.artisticName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {model.city}, {model.state}
                </div>
                <span className="text-muted-foreground">·</span>
                <a href={`https://instagram.com/${model.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Link2 className="w-3.5 h-3.5" />
                  {model.instagram}
                </a>
              </div>
            </div>
            <div className="ml-auto mb-2">
              <span className={`text-xs px-3 py-1.5 rounded-sm border ${
                model.status === 'disponivel' ? 'text-primary bg-primary/10 border-primary/20' :
                model.status === 'em-campanha' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
                'text-muted-foreground bg-muted/30 border-border'
              }`}>
                {model.status === 'disponivel' ? 'Disponivel' : model.status === 'em-campanha' ? 'Em Campanha' : 'Inativo'}
              </span>
            </div>
          </div>

          {/* Medidas */}
          <div className="grid grid-cols-7 gap-3">
            {[
              { label: 'Altura', value: `${model.height}cm` },
              { label: 'Peso', value: `${model.weight}kg` },
              { label: 'Busto', value: `${model.bust}cm` },
              { label: 'Cintura', value: `${model.waist}cm` },
              { label: 'Quadril', value: `${model.hips}cm` },
              { label: 'Manequim', value: model.size },
              { label: 'Calcado', value: model.shoe },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 rounded-sm bg-muted/30">
                <p className="text-lg font-heading font-light text-primary">{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Resumo financeiro */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-sm p-5">
              <p className="text-xs text-muted-foreground mb-2">Total Recebido</p>
              <p className="text-2xl font-heading font-light text-primary">{formatCurrency(totalEarned)}</p>
              <p className="text-xs text-muted-foreground mt-1">apos comissao da agencia</p>
            </div>
            <div className="glass rounded-sm p-5">
              <p className="text-xs text-muted-foreground mb-2">A Receber</p>
              <p className="text-2xl font-heading font-light text-yellow-400">{formatCurrency(pendingValue)}</p>
              <p className="text-xs text-muted-foreground mt-1">{model.worksHistory.filter(w => w.paymentStatus !== 'pago').length} trabalho(s) pendente(s)</p>
            </div>
          </div>

          {/* Historico */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-xl font-light mb-4">Historico de Trabalhos</h2>
            {model.worksHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum trabalho registrado</p>
            ) : (
              <div className="space-y-4">
                {model.worksHistory.map(work => (
                  <div key={work.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{work.campaign}</p>
                        <p className="text-xs text-primary">{work.brand}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-sm border ${paymentColors[work.paymentStatus]}`}>
                        {paymentLabels[work.paymentStatus]}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground mb-2">
                      <span>{new Date(work.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                      <span>{work.location}</span>
                      <span>{work.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{work.description}</p>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(work.cachet * (1 - model.agencyComission / 100))}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Cachet bruto: {formatCurrency(work.cachet)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lateral */}
        <div className="space-y-5">
          {/* Experiencia */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-3">Experiencia</h2>
            <div className="flex flex-wrap gap-2">
              {model.experience.map(exp => (
                <span key={exp} className="text-xs px-2.5 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {/* Book */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-3">Book</h2>
            <div className="grid grid-cols-2 gap-2">
              {model.photos.slice(0, 4).map((photo, i) => (
                <div key={i} className="aspect-[3/4] overflow-hidden rounded-sm">
                  <img src={photo} alt={`Book ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Informacoes agencia */}
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-3">Minha Agencia</h2>
            <p className="font-heading text-xl tracking-widest gold-text font-light mb-2">AGENCY SYNC</p>
            <p className="text-xs text-muted-foreground">Comissao: <span className="text-foreground">{model.agencyComission}%</span></p>
            <button className="mt-3 w-full px-3 py-2 border border-border rounded-sm text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
              Contatar Booker
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
