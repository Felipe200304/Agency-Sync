import { cookies } from 'next/headers'
import { Link2, MapPin } from 'lucide-react'
import { api } from '@/lib/api'
import type { ApiModel, ApiMeFinance } from '@/lib/api'

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  paid: 'text-primary bg-primary/10 border-primary/20',
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  overdue: 'text-destructive bg-destructive/10 border-destructive/20',
}
const statusLabels: Record<string, string> = { paid: 'Pago', pending: 'Pendente', overdue: 'Atrasado' }
const modelStatus: Record<string, { label: string; color: string }> = {
  available: { label: 'Disponível', color: 'text-primary bg-primary/10 border-primary/20' },
  'on-campaign': { label: 'Em Campanha', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  inactive: { label: 'Inativo', color: 'text-muted-foreground bg-muted/30 border-border' },
}

const fmt = (v: number, currency = 'BRL') => v.toLocaleString('pt-BR', { style: 'currency', currency })
const fmtDate = (d: string | null) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—')

export default async function ModelPage() {
  const token = (await cookies()).get('token')?.value
  let model: ApiModel | null = null
  let finance: ApiMeFinance | null = null
  try {
    const user = await api.meUser(token)
    model = user.modelId ? await api.model(user.modelId, token) : null
    finance = await api.meFinance(token)
  } catch {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="font-heading text-3xl font-light">Meu Perfil</h1>
        <p className="text-sm text-red-400 mt-4">Não foi possível carregar seu perfil.</p>
      </div>
    )
  }
  if (!model) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="font-heading text-3xl font-light">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground mt-4">Sua conta ainda não está vinculada a um perfil de modelo.</p>
      </div>
    )
  }

  const name = model.artisticName ?? model.name
  const st = modelStatus[model.status] ?? modelStatus.disponivel
  const summary = finance?.summary
  const records = finance?.records ?? []

  const measures = [
    { label: 'Altura', value: model.heightCm ? `${model.heightCm}cm` : '—' },
    { label: 'Busto', value: model.bust ? `${model.bust}cm` : '—' },
    { label: 'Cintura', value: model.waist ? `${model.waist}cm` : '—' },
    { label: 'Quadril', value: model.hips ? `${model.hips}cm` : '—' },
    { label: 'Calçado', value: model.shoe ?? '—' },
    { label: 'Olhos', value: model.eyeColor ?? '—' },
    { label: 'Cabelo', value: model.hairColor ?? '—' },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Hero */}
      <div className="glass rounded-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-6 mb-5">
            <div className="w-24 h-24 rounded-sm bg-primary/15 text-primary border-2 border-background ring-1 ring-primary/30 flex items-center justify-center text-3xl font-heading font-light">
              {name.charAt(0)}
            </div>
            <div className="mb-2">
              <h1 className="font-heading text-3xl font-light">{name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {[model.city, model.state].filter(Boolean).join(', ') || '—'}
                </div>
                {model.instagram && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <a href={`https://instagram.com/${model.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Link2 className="w-3.5 h-3.5" />
                      {model.instagram}
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="ml-auto mb-2">
              <span className={`text-xs px-3 py-1.5 rounded-sm border ${st.color}`}>{st.label}</span>
            </div>
          </div>

          {/* Medidas */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {measures.map(({ label, value }) => (
              <div key={label} className="text-center p-3 rounded-sm bg-muted/30">
                <p className="text-lg font-heading font-light text-primary">{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Resumo financeiro + histórico */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-sm p-5">
              <p className="text-xs text-muted-foreground mb-2">Total Recebido</p>
              <p className="text-2xl font-heading font-light text-green-400">{fmt(summary?.netReceived ?? 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">líquido, após comissão</p>
            </div>
            <div className="glass rounded-sm p-5">
              <p className="text-xs text-muted-foreground mb-2">A Receber</p>
              <p className="text-2xl font-heading font-light text-yellow-400">{fmt(summary?.netPending ?? 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">{summary?.jobs ?? 0} trabalho(s) no total</p>
            </div>
          </div>

          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-xl font-light mb-4">Histórico de Trabalhos</h2>
            {records.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum trabalho registrado</p>
            ) : (
              <div className="space-y-4">
                {records.map(work => (
                  <div key={work.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{work.campaign ?? '—'}</p>
                        <p className="text-xs text-primary">{work.brand ?? '—'}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-sm border ${statusColors[work.status]}`}>
                        {statusLabels[work.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{fmtDate(work.date)}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">{fmt(work.modelValue, work.currency)}</p>
                        <p className="text-[10px] text-muted-foreground">Cachê bruto: {fmt(work.cachet, work.currency)}</p>
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
          <div className="glass rounded-sm p-5">
            <h2 className="font-heading text-lg font-light mb-3">Minha Agência</h2>
            <p className="font-heading text-xl tracking-widest gold-text font-light mb-2">
              {model.baseAgencyName ?? 'AGENCY SYNC'}
            </p>
            <p className="text-xs text-muted-foreground">
              {model.country ?? 'Brasil'}{model.city ? ` · ${model.city}` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
