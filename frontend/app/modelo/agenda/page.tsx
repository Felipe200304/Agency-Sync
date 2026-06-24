import { cookies } from 'next/headers'
import { api } from '@/lib/api'
import type { ApiEvent } from '@/lib/api'
import { Clock, MapPin, Download } from 'lucide-react'
import { BlockDayForm, RemoveBlockButton } from '@/components/modelo/agenda-controls'

export const dynamic = 'force-dynamic'

const eventStyle: Record<string, { text: string; dot: string; border: string }> = {
  casting:      { text: 'text-blue-300',   dot: 'bg-blue-400',   border: 'border-l-blue-400' },
  trabalho:     { text: 'text-primary',    dot: 'bg-primary',    border: 'border-l-primary' },
  reuniao:      { text: 'text-purple-300', dot: 'bg-purple-400', border: 'border-l-purple-400' },
  producao:     { text: 'text-orange-300', dot: 'bg-orange-400', border: 'border-l-orange-400' },
  evento:       { text: 'text-pink-300',   dot: 'bg-pink-400',   border: 'border-l-pink-400' },
  indisponivel: { text: 'text-red-300',    dot: 'bg-red-400',    border: 'border-l-red-400' },
}

const typeLabels: Record<string, string> = {
  casting: 'Casting', trabalho: 'Trabalho', reuniao: 'Reuniao',
  producao: 'Producao', evento: 'Evento', indisponivel: 'Indisponivel',
}

const styleOf = (type: string) => eventStyle[type] ?? eventStyle.evento

export default async function ModeloAgendaPage() {
  const token = (await cookies()).get('token')?.value
  let modelId: string | undefined
  let events: ApiEvent[] = []
  try {
    const user = await api.meUser(token)
    modelId = user.modelId ?? undefined
    events = await api.meAgenda(token)
  } catch {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="font-heading text-3xl font-light">Minha Agenda</h1>
        <p className="text-sm text-red-400 mt-4">
          Não foi possível carregar a agenda. Verifique se o backend está rodando (docker compose up).
        </p>
      </div>
    )
  }

  // Agrupa eventos por data (já vêm ordenados do backend).
  const grouped = events.reduce<Record<string, ApiEvent[]>>((acc, evt) => {
    (acc[evt.eventDate] ??= []).push(evt)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-light">Minha Agenda</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Seus proximos compromissos</p>
        </div>
        {modelId && (
          <a
            href={api.agendaExportUrl(modelId, token)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-sm hover:opacity-90 transition-all flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </a>
        )}
      </div>

      {/* Bloquear um dia (indisponibilidade) */}
      <div className="mb-6 glass rounded-sm p-4">
        <BlockDayForm />
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {Object.keys(eventStyle).map(type => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${styleOf(type).dot}`} />
            <span className="text-xs text-muted-foreground">{typeLabels[type]}</span>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum compromisso na agenda.</p>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, dayEvents]) => {
          const d = new Date(date + 'T12:00:00')
          const dayName = d.toLocaleDateString('pt-BR', { weekday: 'long' })

          return (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 text-center">
                  <p className="text-2xl font-heading font-light text-primary">{d.getDate()}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {d.toLocaleDateString('pt-BR', { month: 'short' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{dayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="ml-12 space-y-3">
                {dayEvents.map(evt => (
                  <div key={evt.id} className={`glass rounded-sm p-4 border-l-2 ${styleOf(evt.type).border}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={`text-xs font-medium ${styleOf(evt.type).text}`}>
                          {typeLabels[evt.type] ?? evt.type}
                        </span>
                        <h3 className="text-sm font-medium mt-0.5">{evt.title}</h3>
                      </div>
                      {evt.type === 'indisponivel' && <RemoveBlockButton eventId={evt.id} />}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {evt.startTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {evt.startTime}{evt.endTime ? ` — ${evt.endTime}` : ''}
                        </div>
                      )}
                      {evt.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {evt.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
