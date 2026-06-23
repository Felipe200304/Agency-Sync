'use client'

import { useState } from 'react'
import { calendarEvents } from '@/lib/mock-data'
import type { EventType } from '@/lib/types'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const eventColors: Record<EventType, { bg: string; text: string; dot: string }> = {
  casting:  { bg: 'bg-blue-400/20',   text: 'text-blue-300',   dot: 'bg-blue-400' },
  trabalho: { bg: 'bg-primary/20',    text: 'text-primary',    dot: 'bg-primary' },
  reuniao:  { bg: 'bg-purple-400/20', text: 'text-purple-300', dot: 'bg-purple-400' },
  producao: { bg: 'bg-orange-400/20', text: 'text-orange-300', dot: 'bg-orange-400' },
  evento:   { bg: 'bg-pink-400/20',   text: 'text-pink-300',   dot: 'bg-pink-400' },
}

const eventTypeLabels: Record<EventType, string> = {
  casting:  'Casting',
  trabalho: 'Trabalho',
  reuniao:  'Reuniao',
  producao: 'Producao',
  evento:   'Evento',
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const MONTHS = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)) // July 2025
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  function getEventsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return calendarEvents.filter(e => e.date === dateStr)
  }

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  // Upcoming events (next 5)
  const upcomingEvents = [...calendarEvents]
    .filter(e => e.date >= `${year}-${String(month + 1).padStart(2, '0')}-01`)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-light">Calendário</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{calendarEvents.length} eventos este mes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Novo Evento
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        {(Object.keys(eventColors) as EventType[]).map(type => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${eventColors[type].dot}`} />
            <span className="text-xs text-muted-foreground">{eventTypeLabels[type]}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Calendar grid */}
        <div className="flex-1 flex flex-col glass rounded-sm p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-1.5 rounded-sm hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="font-heading text-xl font-light">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-sm hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs text-muted-foreground py-1 tracking-wide">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayEvents = getEventsForDay(day)
              const isSelected = selectedDay === day
              const isToday = day === 23 && month === 6 && year === 2025

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative flex flex-col items-start p-1.5 rounded-sm min-h-[60px] transition-all text-left ${
                    isSelected
                      ? 'bg-primary/20 border border-primary/40'
                      : isToday
                      ? 'bg-muted/50 border border-border'
                      : 'hover:bg-muted/30 border border-transparent'
                  }`}
                >
                  <span className={`text-xs mb-1 w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5 w-full">
                    {dayEvents.slice(0, 2).map(evt => (
                      <div
                        key={evt.id}
                        className={`text-[10px] px-1 py-0.5 rounded-sm truncate ${eventColors[evt.type].bg} ${eventColors[evt.type].text}`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 flex flex-col gap-4">
          {/* Selected day events */}
          {selectedDay && (
            <div className="glass rounded-sm p-4">
              <h3 className="font-heading text-lg font-light mb-3">
                {selectedDay} de {MONTHS[month]}
              </h3>
              {selectedDayEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum evento neste dia</p>
              ) : (
                <div className="space-y-2">
                  {selectedDayEvents.map(evt => (
                    <div key={evt.id} className={`p-3 rounded-sm ${eventColors[evt.type].bg}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${eventColors[evt.type].dot}`} />
                        <span className={`text-xs font-medium ${eventColors[evt.type].text}`}>
                          {eventTypeLabels[evt.type]}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{evt.title}</p>
                      <p className="text-xs text-muted-foreground">{evt.time}{evt.endTime ? ` — ${evt.endTime}` : ''}</p>
                      {evt.location && <p className="text-xs text-muted-foreground">{evt.location}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming */}
          <div className="glass rounded-sm p-4 flex-1 overflow-y-auto">
            <h3 className="font-heading text-lg font-light mb-3">Proximos Eventos</h3>
            <div className="space-y-2">
              {upcomingEvents.map(evt => {
                const [, , day] = evt.date.split('-')
                return (
                  <div key={evt.id} className="flex items-start gap-3 p-2 rounded-sm hover:bg-muted/30 transition-colors">
                    <div className="w-8 text-center">
                      <p className="text-lg font-heading font-light text-primary leading-none">{parseInt(day)}</p>
                      <p className="text-[10px] text-muted-foreground">{MONTHS[month].slice(0,3)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{evt.title}</p>
                      <p className="text-[10px] text-muted-foreground">{evt.time} · {evt.location}</p>
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${eventColors[evt.type].dot}`} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
