'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import type { ApiCasting } from '@/lib/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CalEvent = { id: string; date: string; title: string; time: string | null; location: string | null }

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function CalendarPage() {
  const [castings, setCastings] = useState<ApiCasting[]>([])
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => { api.castings().then(setCastings).catch(() => {}) }, [])

  // Castings viram eventos do calendário (têm data).
  const events: CalEvent[] = useMemo(
    () => castings
      .filter(c => c.date)
      .map(c => ({ id: c.id, date: c.date as string, title: c.title, time: c.time, location: c.city })),
    [castings],
  )

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null) }
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null) }

  const eventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthCount = events.filter(e => e.date.startsWith(monthPrefix)).length
  const selectedDayEvents = selectedDay ? eventsForDay(selectedDay) : []
  const upcomingEvents = [...events]
    .filter(e => e.date >= `${monthPrefix}-01`)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-light">Calendário</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {monthCount} casting{monthCount === 1 ? '' : 's'} em {MONTHS[month]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-5">
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        <span className="text-xs text-muted-foreground">Castings</span>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Grade do mês */}
        <div className="flex-1 flex flex-col glass rounded-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-1.5 rounded-sm hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="font-heading text-xl font-light">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-1.5 rounded-sm hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs text-muted-foreground py-1 tracking-wide">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 flex-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayEvents = eventsForDay(day)
              const isSelected = selectedDay === day
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

              return (
                <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative flex flex-col items-start p-1.5 rounded-sm min-h-[60px] transition-all text-left ${
                    isSelected ? 'bg-primary/20 border border-primary/40'
                      : isToday ? 'bg-muted/50 border border-border'
                      : 'hover:bg-muted/30 border border-transparent'
                  }`}>
                  <span className={`text-xs mb-1 w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5 w-full">
                    {dayEvents.slice(0, 2).map(evt => (
                      <div key={evt.id} className="text-[10px] px-1 py-0.5 rounded-sm truncate bg-blue-400/20 text-blue-300">
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
          {selectedDay && (
            <div className="glass rounded-sm p-4">
              <h3 className="font-heading text-lg font-light mb-3">{selectedDay} de {MONTHS[month]}</h3>
              {selectedDayEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum casting neste dia</p>
              ) : (
                <div className="space-y-2">
                  {selectedDayEvents.map(evt => (
                    <div key={evt.id} className="p-3 rounded-sm bg-blue-400/20">
                      <p className="text-sm font-medium mb-1">{evt.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {evt.time ?? ''}{evt.location ? ` · ${evt.location}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="glass rounded-sm p-4 flex-1 overflow-y-auto">
            <h3 className="font-heading text-lg font-light mb-3">Próximos Castings</h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum casting agendado.</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map(evt => {
                  const [, m, day] = evt.date.split('-')
                  return (
                    <div key={evt.id} className="flex items-start gap-3 p-2 rounded-sm hover:bg-muted/30 transition-colors">
                      <div className="w-8 text-center">
                        <p className="text-lg font-heading font-light text-primary leading-none">{parseInt(day)}</p>
                        <p className="text-[10px] text-muted-foreground">{MONTHS[parseInt(m) - 1].slice(0, 3)}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{evt.title}</p>
                        <p className="text-[10px] text-muted-foreground">{evt.time ?? ''}{evt.location ? ` · ${evt.location}` : ''}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
