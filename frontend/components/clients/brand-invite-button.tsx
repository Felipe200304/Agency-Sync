'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { api } from '@/lib/api'

/**
 * Gera um link de convite para a MARCA criar o próprio login e o copia.
 * A agência valida a marca (já tem o cadastro/CNPJ), dispensando verificação.
 */
export function BrandInviteButton({ brandId }: { brandId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'copied' | 'error'>('idle')

  async function invite() {
    setState('loading')
    try {
      const { token } = await api.createBrandInvite(brandId)
      const link = `${window.location.origin}/convite/${token}`
      await navigator.clipboard.writeText(link)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2500)
    }
  }

  return (
    <button
      onClick={invite}
      disabled={state === 'loading'}
      title="Gerar link de convite e copiar"
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-60"
    >
      {state === 'copied' ? <Check className="w-3.5 h-3.5 text-primary" /> : <Link2 className="w-3.5 h-3.5" />}
      {state === 'copied' ? 'Link copiado' : state === 'loading' ? 'Gerando…' : state === 'error' ? 'Erro' : 'Convidar'}
    </button>
  )
}
