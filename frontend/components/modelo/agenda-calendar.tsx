'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import { api } from '@/lib/api'
import type { ApiJob } from '@/lib/api'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/** Data local (yyyy-MM-dd) sem cair em fuso UTC. */
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatCurrency = (v: number | null) =>
  v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Confirmado pelo modelo (dourado) vs. aprovado pela marca aguardando resposta (amarelo). */
type JobState = 'confirmado' | 'aguardando'
const stateOf = (j: ApiJob): JobState => (j.decision === 'confirmado' ? 'confirmado' : 'aguardando')

const stateStyle: Record<JobState, { pill: string; dot: string; border: string; label: string }> = {
  confirmado: { pill: 'bg-primary/15 text-primary', dot: 'bg-primary', border: 'border-l-primary', label: 'Confirmado' },
  aguardando: { pill: 'bg-yellow-400/15 text-yellow-400', dot: 'bg-yellow-400', border: 'border-l-yellow-400', label: 'Aguardando sua resposta' },
}

/**
 * Calendário mensal da agenda do modelo. Mostra apenas os castings
 * confirmados (recebidos já filtrados) posicionados na sua data.
 */
export function AgendaCalendar({ jobs }: { jobs: ApiJob[] }) {
  const router = useRouter()
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(ymd(today))
  const [modalOpen, setModalOpen] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function openDay(dateStr: string) {
    setSelected(dateStr)
    setError(null)
    setModalOpen(true)
  }

  async function decide(castingId: string, decision: string) {
    setBusy(castingId)
    setError(null)
    try {
      await api.meDecideJob(castingId, decision)
      router.refresh() // re-busca no servidor; recusados saem do calendário
    } catch {
      setError('Não foi possível atualizar. Tente novamente.')
    } finally {
      setBusy(null)
    }
  }

  // Agrupa castings por data.
  const byDate = jobs.reduce<Record<string, ApiJob[]>>((acc, j) => {
    if (j.date) (acc[j.date] ??= []).push(j)
    return acc
  }, {})

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = ymd(today)

  // Células: brancos iniciais + dias do mês.
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const goMonth = (delta: number) => setCursor(new Date(year, month + delta, 1))
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelected(todayStr)
  }

  const selectedJobs = byDate[selected] ?? []

  return (
    <div className="glass rounded-sm p-5">
      {/* Cabeçalho do mês */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-light capitalize">
          {MONTHS[month]} <span className="text-muted-foreground">{year}</span>
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={goToday} className="px-3 py-1.5 text-xs rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all mr-1">
            Hoje
          </button>
          <button onClick={() => goMonth(-1)} aria-label="Mês anterior" className="w-8 h-8 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => goMonth(1)} aria-label="Próximo mês" className="w-8 h-8 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 mb-4">
        {(['confirmado', 'aguardando'] as JobState[]).map(s => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${stateStyle[s].dot}`} />
            <span className="text-xs text-muted-foreground">{stateStyle[s].label}</span>
          </div>
        ))}
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-[10px] tracking-wider uppercase text-muted-foreground py-1">{w}</div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`b${i}`} />
          const dateStr = ymd(new Date(year, month, day))
          const dayJobs = byDate[dateStr] ?? []
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selected
          return (
            <button
              key={dateStr}
              onClick={() => openDay(dateStr)}
              className={`aspect-square rounded-sm p-1 flex flex-col items-stretch text-left border transition-all ${
                isSelected ? 'border-primary/60 bg-primary/5' : 'border-transparent hover:border-border'
              }`}
            >
              <span className={`text-xs ${isToday ? 'text-primary font-semibold' : 'text-foreground/70'}`}>
                {day}
              </span>
              <div className="mt-0.5 space-y-0.5 overflow-hidden">
                {dayJobs.slice(0, 2).map(j => (
                  <span key={j.castingId} className={`block truncate text-[9px] leading-tight px-1 py-0.5 rounded-sm ${stateStyle[stateOf(j)].pill}`}>
                    {j.title}
                  </span>
                ))}
                {dayJobs.length > 2 && (
                  <span className="block text-[9px] text-muted-foreground px-1">+{dayJobs.length - 2}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Modal do dia */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[oklch(0.09_0.006_85_/_0.7)] backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-card border border-border shadow-2xl rounded-sm w-full max-w-md max-h-[85vh] overflow-y-auto p-5 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Fechar"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-xs tracking-wider uppercase text-muted-foreground">Agenda do dia</p>
            <h2 className="font-heading text-xl font-light capitalize mb-4">
              {new Date(selected + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>

            {selectedJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhum casting para este dia.</p>
            ) : (
              <div className="space-y-2">
                {selectedJobs.map(j => {
                  const st = stateStyle[stateOf(j)]
                  return (
                    <div key={j.castingId} className={`rounded-sm bg-muted/30 border border-border/50 border-l-2 ${st.border} p-3`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-primary font-medium tracking-wider uppercase">{j.brand ?? 'Casting'}</span>
                        <span className="text-xs text-muted-foreground">{formatCurrency(j.cachet)}</span>
                      </div>
                      <h3 className="text-sm font-medium mt-0.5">{j.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${st.pill}`}>{st.label}</span>
                        {j.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {j.location}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => decide(j.castingId, 'confirmado')}
                          disabled={busy === j.castingId || j.decision === 'confirmado'}
                          className="text-xs px-3 py-1.5 rounded-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-40"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => decide(j.castingId, 'recusado')}
                          disabled={busy === j.castingId}
                          className="text-xs px-3 py-1.5 rounded-sm bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all disabled:opacity-40"
                        >
                          Recusar
                        </button>
                      </div>
                    </div>
                  )
                })}
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
