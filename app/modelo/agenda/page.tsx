import { calendarEvents } from '@/lib/mock-data'
import type { EventType } from '@/lib/types'
import { Calendar, Clock, MapPin } from 'lucide-react'

const eventColors: Record<EventType, { bg: string; text: string; dot: string }> = {
  casting:  { bg: 'bg-blue-400/10',   text: 'text-blue-300',   dot: 'bg-blue-400' },
  trabalho: { bg: 'bg-primary/10',    text: 'text-primary',    dot: 'bg-primary' },
  reuniao:  { bg: 'bg-purple-400/10', text: 'text-purple-300', dot: 'bg-purple-400' },
  producao: { bg: 'bg-orange-400/10', text: 'text-orange-300', dot: 'bg-orange-400' },
  evento:   { bg: 'bg-pink-400/10',   text: 'text-pink-300',   dot: 'bg-pink-400' },
}

const typeLabels: Record<EventType, string> = {
  casting:  'Casting',
  trabalho: 'Trabalho',
  reuniao:  'Reuniao',
  producao: 'Producao',
  evento:   'Evento',
}

const sorted = [...calendarEvents].sort((a, b) => a.date.localeCompare(b.date))

export default function ModeloAgendaPage() {
  // Group events by date
  const grouped = sorted.reduce<Record<string, typeof calendarEvents>>((acc, evt) => {
    if (!acc[evt.date]) acc[evt.date] = []
    acc[evt.date].push(evt)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-light">Minha Agenda</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Seus proximos compromissos</p>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {(Object.keys(eventColors) as EventType[]).map(type => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${eventColors[type].dot}`} />
            <span className="text-xs text-muted-foreground">{typeLabels[type]}</span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, events]) => {
          const d = new Date(date + 'T12:00:00')
          const dayName = d.toLocaleDateString('pt-BR', { weekday: 'long' })
          const dayFull = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })

          return (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 text-center">
                  <p className="text-2xl font-heading font-light text-primary">{d.getDate()}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{d.toLocaleDateString('pt-BR', { month: 'short' })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{dayName}</p>
                  <p className="text-xs text-muted-foreground">{events.length} evento{events.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="ml-12 space-y-3">
                {events.map(evt => (
                  <div key={evt.id} className={`glass rounded-sm p-4 border-l-2 ${
                    evt.type === 'casting' ? 'border-l-blue-400' :
                    evt.type === 'trabalho' ? 'border-l-primary' :
                    evt.type === 'reuniao' ? 'border-l-purple-400' :
                    evt.type === 'producao' ? 'border-l-orange-400' :
                    'border-l-pink-400'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={`text-xs font-medium ${eventColors[evt.type].text}`}>
                          {typeLabels[evt.type]}
                        </span>
                        <h3 className="text-sm font-medium mt-0.5">{evt.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {evt.time}{evt.endTime ? ` — ${evt.endTime}` : ''}
                      </div>
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
