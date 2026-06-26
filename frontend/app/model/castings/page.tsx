'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { ApiJob } from '@/lib/api'
import { Calendar, MapPin, DollarSign, CheckCircle, XCircle, Clock3 } from 'lucide-react'

const brandStatusLabel: Record<string, string> = {
  enviado: 'Convite de casting', aprovado: 'Selecionada para o trabalho',
  reprovado: 'Não selecionada', pendente: 'Aguardando avaliação da marca',
}

const decisionBadge: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { label: 'Confirme sua presença', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: <Clock3 className="w-3.5 h-3.5" /> },
  confirmado: { label: 'Presença confirmada', color: 'text-primary bg-primary/10 border-primary/20', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  recusado: { label: 'Você recusou', color: 'text-destructive bg-destructive/10 border-destructive/20', icon: <XCircle className="w-3.5 h-3.5" /> },
}

const fmt = (v: number | null) => (v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
const fmtDate = (d: string | null) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—')

export default function TrabalhosPage() {
  const [jobs, setJobs] = useState<ApiJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    return api.meJobs()
      .then(setJobs)
      .catch(() => setError('Não foi possível carregar seus trabalhos.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function decide(castingId: string, decision: string) {
    setError(null)
    try { await api.meDecideJob(castingId, decision); await load() }
    catch { setError('A ação falhou. Tente novamente.') }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-light">Meus Castings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Confirme sua presença nos castings. A marca avalia todos e seleciona quem fica com o trabalho.</p>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
      {!loading && jobs.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum casting enviado para você ainda.</p>
      )}

      <div className="space-y-3">
        {jobs.map(j => {
          const badge = decisionBadge[j.decision] ?? decisionBadge.pendente
          return (
            <div key={j.castingId} className="glass rounded-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs text-primary tracking-widest uppercase mb-0.5">{j.brand ?? 'Sem marca'}</p>
                  <h3 className="text-base font-medium">{j.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{brandStatusLabel[j.brandStatus] ?? j.brandStatus}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-sm border flex items-center gap-1.5 flex-shrink-0 ${badge.color}`}>
                  {badge.icon}{badge.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtDate(j.date)}</span>
                {j.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>}
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{fmt(j.cachet)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => decide(j.castingId, 'confirmado')} disabled={j.decision === 'confirmado'}
                  className="text-xs px-3 py-1.5 rounded-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-40">
                  Confirmar presença
                </button>
                <button onClick={() => decide(j.castingId, 'recusado')} disabled={j.decision === 'recusado'}
                  className="text-xs px-3 py-1.5 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all disabled:opacity-40">
                  Recusar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
