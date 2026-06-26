'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { api } from '@/lib/api'

const initial = {
  name: '', legalName: '', cnpj: '', responsible: '', email: '', phone: '',
  cep: '', street: '', number: '', complement: '', district: '', city: '', state: '',
}
const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF']

const fieldClass =
  'mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors'
const labelClass = 'text-xs text-muted-foreground tracking-wider uppercase'

/** Botão "Novo Cliente" + modal de cadastro (POST /api/brands) com dados fiscais. */
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
        legalName: form.legalName || undefined,
        cnpj: form.cnpj || undefined,
        responsible: form.responsible || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        address: {
          cep: form.cep || undefined,
          street: form.street || undefined,
          number: form.number || undefined,
          complement: form.complement || undefined,
          district: form.district || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
        },
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={close}>
          <div
            className="bg-card border border-border shadow-2xl rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative"
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
            <p className="text-sm text-muted-foreground mb-6">Dados reais da empresa para emissão de NF</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identificação */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nome fantasia *</label>
                  <input value={form.name} onChange={set('name')} autoFocus className={fieldClass} placeholder="Como o cliente é conhecido" />
                </div>
                <div>
                  <label className={labelClass}>Razão social</label>
                  <input value={form.legalName} onChange={set('legalName')} className={fieldClass} placeholder="Nome jurídico (NF)" />
                </div>
                <div>
                  <label className={labelClass}>CNPJ</label>
                  <input value={form.cnpj} onChange={set('cnpj')} className={fieldClass} placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <label className={labelClass}>Responsável</label>
                  <input value={form.responsible} onChange={set('responsible')} className={fieldClass} placeholder="Contato" />
                </div>
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input type="email" value={form.email} onChange={set('email')} className={fieldClass} placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className={labelClass}>Telefone</label>
                  <input value={form.phone} onChange={set('phone')} className={fieldClass} placeholder="(00) 90000-0000" />
                </div>
              </div>

              {/* Endereço fiscal */}
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Endereço fiscal</p>
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>CEP</label>
                    <input value={form.cep} onChange={set('cep')} className={fieldClass} placeholder="00000-000" />
                  </div>
                  <div className="col-span-4">
                    <label className={labelClass}>Logradouro</label>
                    <input value={form.street} onChange={set('street')} className={fieldClass} placeholder="Rua / Avenida" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Número</label>
                    <input value={form.number} onChange={set('number')} className={fieldClass} placeholder="123" />
                  </div>
                  <div className="col-span-4">
                    <label className={labelClass}>Complemento</label>
                    <input value={form.complement} onChange={set('complement')} className={fieldClass} placeholder="Sala / Andar" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Bairro</label>
                    <input value={form.district} onChange={set('district')} className={fieldClass} placeholder="Bairro" />
                  </div>
                  <div className="col-span-3">
                    <label className={labelClass}>Cidade</label>
                    <input value={form.city} onChange={set('city')} className={fieldClass} placeholder="São Paulo" />
                  </div>
                  <div className="col-span-1">
                    <label className={labelClass}>UF</label>
                    <select value={form.state} onChange={set('state')} className={`${fieldClass} text-foreground`}>
                      <option value="">—</option>
                      {ufs.map(uf => <option key={uf}>{uf}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-1">
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
