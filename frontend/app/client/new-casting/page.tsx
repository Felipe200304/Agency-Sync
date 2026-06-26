'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import { DateInput } from '@/components/ui/date-input'
import { TimeInput } from '@/components/ui/time-input'

type Form = {
  title: string; date: string; time: string; location: string; city: string
  modelsNeeded: string; cachet: string; workDuration: string
  desiredProfile: string; description: string; responsible: string; email: string
}

const initial: Form = {
  title: '', date: '', time: '', location: '', city: '',
  modelsNeeded: '1', cachet: '', workDuration: '',
  desiredProfile: '', description: '', responsible: '', email: '',
}

export default function NovoCastingClientePage() {
  const router = useRouter()
  const [form, setForm] = useState<Form>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (f: keyof Form) => (e: { target: { value: string } }) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }))
  const num = (v: string) => (v.trim() === '' ? undefined : Number(v))
  const cls = 'mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors'

  async function handleSubmit() {
    if (!form.title.trim()) { setError('Informe o título da campanha.'); return }
    setSaving(true); setError(null)
    try {
      await api.createMeCasting({
        title: form.title,
        date: form.date || undefined,
        time: form.time || undefined,
        location: form.location || undefined,
        city: form.city || undefined,
        modelsNeeded: num(form.modelsNeeded),
        cachet: num(form.cachet),
        workDuration: form.workDuration || undefined,
        desiredProfile: form.desiredProfile || undefined,
        description: form.description || undefined,
        responsible: form.responsible || undefined,
        email: form.email || undefined,
      })
      router.push('/client')
    } catch {
      setError('Não foi possível enviar a solicitação. Verifique se o backend está rodando.')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/client" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-light">Solicitar Casting</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Preencha os detalhes da sua necessidade</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Dados da Campanha</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Título da campanha</label>
              <input value={form.title} onChange={set('title')} className={cls} placeholder="Ex: Campanha Verão 2026" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Data do casting</label>
                <DateInput value={form.date} onChange={iso => setForm(prev => ({ ...prev, date: iso }))} className={cls} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Horário preferencial</label>
                <TimeInput value={form.time} onChange={v => set('time')({ target: { value: v } })} className={cls} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Local / Estúdio</label>
                <input value={form.location} onChange={set('location')} className={cls} placeholder="Endereço completo" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Cidade</label>
                <input value={form.city} onChange={set('city')} className={cls} placeholder="São Paulo" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Modelos & Cachê</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Quantidade de modelos</label>
              <input type="number" value={form.modelsNeeded} onChange={set('modelsNeeded')} className={cls} placeholder="1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Cachê por modelo (R$)</label>
              <input type="number" value={form.cachet} onChange={set('cachet')} className={cls} placeholder="0,00" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Duração do trabalho</label>
              <input value={form.workDuration} onChange={set('workDuration')} className={cls} placeholder="Ex: 2 dias" />
            </div>
          </div>
        </div>

        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Perfil Desejado</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Descrição do perfil</label>
            <textarea value={form.desiredProfile} onChange={set('desiredProfile')}
              className={`${cls} resize-none h-24`} placeholder="Descreva altura, tipo físico, tom de pele, estilo..." />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Descrição do trabalho</label>
            <textarea value={form.description} onChange={set('description')}
              className={`${cls} resize-none h-28`} placeholder="Tipo de conteúdo, uso das imagens, duração da campanha..." />
          </div>
        </div>

        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-4">Informações de Contato</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Responsável</label>
              <input value={form.responsible} onChange={set('responsible')} className={cls} placeholder="Nome completo" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">E-mail</label>
              <input value={form.email} onChange={set('email')} className={cls} placeholder="email@empresa.com" />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-400 text-right">{error}</p>}
        <div className="flex justify-end gap-3">
          <Link href="/client" className="px-6 py-2.5 rounded-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
            Cancelar
          </Link>
          <button onClick={handleSubmit} disabled={saving}
            className="px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all tracking-wide disabled:opacity-60">
            {saving ? 'Enviando…' : 'Enviar Solicitação'}
          </button>
        </div>
      </div>
    </div>
  )
}
