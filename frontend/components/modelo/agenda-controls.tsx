'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarPlus, X } from 'lucide-react'
import { api } from '@/lib/api'
import { DateInput } from '@/components/ui/date-input'

/** Formulário para o modelo bloquear um dia (indisponibilidade). */
export function BlockDayForm() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  async function block() {
    if (!date) return
    setSaving(true)
    try {
      await api.meBlockDay(date, title || undefined)
      setDate(''); setTitle('')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-end gap-2 flex-wrap">
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Bloquear dia</label>
        <DateInput value={date} onChange={setDate}
          className="bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Motivo (opcional)"
        className="bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
      <button onClick={block} disabled={!date || saving}
        className="flex items-center gap-2 px-3 py-2 bg-red-400/10 text-red-300 border border-red-400/20 text-sm rounded-sm hover:bg-red-400/20 transition-all disabled:opacity-50">
        <CalendarPlus className="w-4 h-4" />
        {saving ? 'Bloqueando…' : 'Bloquear'}
      </button>
    </div>
  )
}

/** Botão para remover um bloqueio do próprio modelo. */
export function RemoveBlockButton({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function remove() {
    setBusy(true)
    try { await api.meRemoveBlock(eventId); router.refresh() }
    finally { setBusy(false) }
  }

  return (
    <button onClick={remove} disabled={busy} title="Remover bloqueio"
      className="text-muted-foreground hover:text-red-300 transition-colors disabled:opacity-50">
      <X className="w-4 h-4" />
    </button>
  )
}
