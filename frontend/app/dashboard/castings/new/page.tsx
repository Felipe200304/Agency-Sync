'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import type { ApiBrand } from '@/lib/api'
import { DateInput } from '@/components/ui/date-input'
import { TimeInput } from '@/components/ui/time-input'

type Form = {
  brandId: string; responsible: string; email: string; phone: string
  title: string; date: string; time: string; location: string; city: string
  workDuration: string; campaignDuration: string; cachet: string
  paymentDeadline: string; modelsNeeded: string; desiredProfile: string; description: string
}

const initial: Form = {
  brandId: '', responsible: '', email: '', phone: '',
  title: '', date: '', time: '', location: '', city: '',
  workDuration: '', campaignDuration: '', cachet: '',
  paymentDeadline: '', modelsNeeded: '1', desiredProfile: '', description: '',
}

export default function NewCastingPage() {
  const router = useRouter()
  const [form, setForm] = useState<Form>(initial)
  const [brands, setBrands] = useState<ApiBrand[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { api.brands().then(setBrands).catch(() => {}) }, [])

  const set = (f: keyof Form) => (e: { target: { value: string } }) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }))
  const num = (v: string) => (v.trim() === '' ? undefined : Number(v))

  async function handleSubmit() {
    if (!form.title.trim()) { setError('Informe o título da campanha.'); return }
    setSaving(true); setError(null)
    try {
      await api.createCasting({
        brandId: form.brandId || undefined,
        title: form.title,
        responsible: form.responsible || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        location: form.location || undefined,
        city: form.city || undefined,
        date: form.date || undefined,
        time: form.time || undefined,
        modelsNeeded: num(form.modelsNeeded),
        desiredProfile: form.desiredProfile || undefined,
        cachet: num(form.cachet),
        paymentDeadline: form.paymentDeadline || undefined,
        campaignDuration: form.campaignDuration || undefined,
        workDuration: form.workDuration || undefined,
        description: form.description || undefined,
      })
      router.push('/dashboard/castings')
    } catch {
      setError('Não foi possível criar o casting. Verifique se o backend está rodando.')
      setSaving(false)
    }
  }

  const inputCls = 'mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors'

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/castings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-light">Novo Casting</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Registre uma nova solicitação de casting</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dados do cliente */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Dados do Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Marca / Empresa</label>
              <select value={form.brandId} onChange={set('brandId')} className={`${inputCls} text-foreground`}>
                <option value="">Selecione a marca</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Responsável pelo contato</label>
              <input value={form.responsible} onChange={set('responsible')} className={inputCls} placeholder="Nome completo" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">E-mail</label>
              <input value={form.email} onChange={set('email')} className={inputCls} placeholder="email@empresa.com" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Telefone / WhatsApp</label>
              <input value={form.phone} onChange={set('phone')} className={inputCls} placeholder="(00) 90000-0000" />
            </div>
          </div>
        </div>

        {/* Dados do trabalho */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Dados do Trabalho</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Título da campanha</label>
            <input value={form.title} onChange={set('title')} className={inputCls} placeholder="Ex: Campanha Verão 2026 — Linha Premium" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Data do casting</label>
              <DateInput value={form.date} onChange={iso => setForm(prev => ({ ...prev, date: iso }))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Horário</label>
              <TimeInput value={form.time} onChange={v => set('time')({ target: { value: v } })} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Local / Estúdio</label>
              <input value={form.location} onChange={set('location')} className={inputCls} placeholder="Ex: Estúdio Central, Av. Paulista" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Cidade</label>
              <input value={form.city} onChange={set('city')} className={inputCls} placeholder="São Paulo" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Duração do trabalho</label>
              <input value={form.workDuration} onChange={set('workDuration')} className={inputCls} placeholder="Ex: 2 dias" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Duração da campanha</label>
              <input value={form.campaignDuration} onChange={set('campaignDuration')} className={inputCls} placeholder="Ex: 6 meses" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Cachê por modelo (R$)</label>
              <input type="number" value={form.cachet} onChange={set('cachet')} className={inputCls} placeholder="0,00" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Prazo pagamento</label>
              <input value={form.paymentDeadline} onChange={set('paymentDeadline')} className={inputCls} placeholder="Ex: 30 dias" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Quantidade de modelos</label>
              <input type="number" value={form.modelsNeeded} onChange={set('modelsNeeded')} className={inputCls} placeholder="1" />
            </div>
          </div>
        </div>

        {/* Briefing */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Briefing</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Perfil desejado</label>
            <textarea value={form.desiredProfile} onChange={set('desiredProfile')}
              className={`${inputCls} resize-none h-20`}
              placeholder="Descreva o perfil de modelo desejado (altura, tipo físico, cabelo, etc.)" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Descrição do trabalho</label>
            <textarea value={form.description} onChange={set('description')}
              className={`${inputCls} resize-none h-28`}
              placeholder="Descreva detalhes sobre o trabalho, tipo de conteúdo, uso das imagens, etc." />
          </div>
        </div>

        {error && <p className="text-sm text-red-400 text-right">{error}</p>}
        <div className="flex justify-end gap-3">
          <Link href="/dashboard/castings" className="px-6 py-2.5 rounded-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
            Cancelar
          </Link>
          <button onClick={handleSubmit} disabled={saving}
            className="px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all tracking-wide disabled:opacity-60">
            {saving ? 'Criando…' : 'Criar Casting'}
          </button>
        </div>
      </div>
    </div>
  )
}
