import Link from 'next/link'
import type { Model } from '@/lib/types'

const statusLabel: Record<string, { label: string; color: string }> = {
  'available': { label: 'Disponível', color: 'text-green-400 bg-green-400/10' },
  'on-campaign': { label: 'Em Campanha', color: 'text-primary bg-primary/10' },
  'inactive': { label: 'Inativo', color: 'text-muted-foreground bg-muted/50' },
}

export function ModelCard({ model }: { model: Model }) {
  const s = statusLabel[model.status]

  return (
    <Link href={`/dashboard/models/${model.id}`} className="group block">
      <div className="bg-card border border-border rounded-sm overflow-hidden hover:border-primary/30 transition-all">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={model.photo}
            alt={model.artisticName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${s.color}`}>
              {s.label}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="font-heading text-lg font-light text-foreground">{model.artisticName}</p>
            <p className="text-xs text-foreground/60">{model.city}, {model.state}</p>
          </div>
        </div>
        <div className="p-3 grid grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Altura</p>
            <p className="text-sm font-medium text-foreground">{model.height}cm</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Manequim</p>
            <p className="text-sm font-medium text-foreground">{model.size}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Calçado</p>
            <p className="text-sm font-medium text-foreground">{model.shoe}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
