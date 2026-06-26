'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { api } from '@/lib/api'

const initial = { name: '', responsible: '', email: '', phone: '', city: '', state: '' }
const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF']

/** Botão "Novo Cliente" + modal de cadastro (POST /api/brands). */
export function NewClientButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (field: keyof typeof initial) => (e: { target: { value: string } }) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  function close() {
    setOpen(false)
    setForm(initial)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Informe o nome do cliente.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await api.createBrand({
        name: form.name.trim(),
        responsible: form.responsible || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
      })
      close()
      router.refresh()
    } catch {
      setError('Não foi possível cadastrar o cliente. Verifique se o backend está rodando.')
      setSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-primary/90 transition-all"
      >
        <Plus className="w-4 h-4" />
        Novo Cliente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70" onClick={close}>
          <div
            className="glass rounded-sm w-full max-w-lg p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Fechar"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-heading text-2xl font-light mb-1">Novo Cliente</h2>
            <p className="text-sm text-muted-foreground mb-6">Cadastre uma marca/empresa</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Nome *</label>
                <input value={form.name} onChange={set('name')} autoFocus className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Nome da marca/empresa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider uppercase">Responsável</label>
                  <input value={form.responsible} onChange={set('responsible')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Contato" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider uppercase">Telefone</label>
                  <input value={form.phone} onChange={set('phone')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="(00) 90000-0000" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">E-mail</label>
                <input type="email" value={form.email} onChange={set('email')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="email@exemplo.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider uppercase">Cidade</label>
                  <input value={form.city} onChange={set('city')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="São Paulo" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider uppercase">Estado</label>
                  <select value={form.state} onChange={set('state')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors text-foreground">
                    <option value="">Selecione</option>
                    {ufs.map(uf => <option key={uf}>{uf}</option>)}
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={close} className="px-5 py-2 rounded-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60">
                  {saving ? 'Cadastrando…' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
