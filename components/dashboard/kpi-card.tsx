import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  change?: string
  positive?: boolean
  icon: LucideIcon
  sub?: string
}

export function KpiCard({ title, value, change, positive = true, icon: Icon, sub }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-sm p-5 flex flex-col gap-4 hover:border-border/80 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-muted-foreground">{title}</p>
          <p className="font-heading text-3xl font-light text-foreground mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {change && (
        <p className={`text-xs ${positive ? 'text-green-400' : 'text-destructive'}`}>
          {positive ? '+' : ''}{change} em relação ao mês anterior
        </p>
      )}
    </div>
  )
}
