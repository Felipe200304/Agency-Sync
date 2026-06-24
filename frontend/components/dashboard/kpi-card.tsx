import type { LucideIcon } from 'lucide-react'

type Tone = 'default' | 'positive' | 'pending'

interface KpiCardProps {
  title: string
  value: string
  change?: string
  positive?: boolean
  icon: LucideIcon
  sub?: string
  tone?: Tone
}

const toneStyles: Record<Tone, { value: string; iconBg: string; icon: string }> = {
  default:  { value: 'text-foreground', iconBg: 'bg-primary/10 group-hover:bg-primary/15', icon: 'text-primary' },
  positive: { value: 'text-green-400',  iconBg: 'bg-green-400/10', icon: 'text-green-400' },
  pending:  { value: 'text-red-400',    iconBg: 'bg-red-400/10',   icon: 'text-red-400' },
}

export function KpiCard({ title, value, change, positive = true, icon: Icon, sub, tone = 'default' }: KpiCardProps) {
  const t = toneStyles[tone]
  return (
    <div className="bg-card border border-border rounded-sm p-5 flex flex-col gap-4 hover:border-border/80 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-muted-foreground">{title}</p>
          <p className={`font-heading text-3xl font-light mt-1 ${t.value}`}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors ${t.iconBg}`}>
          <Icon className={`w-5 h-5 ${t.icon}`} />
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
