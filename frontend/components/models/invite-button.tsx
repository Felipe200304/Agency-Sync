'use client'

import { useState } from 'react'
import { Link2, Copy, Check } from 'lucide-react'
import { api } from '@/lib/api'

/** Gera um link de convite para o modelo criar o próprio login. */
export function InviteButton({ modelId }: { modelId: string }) {
  const [link, setLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const { token } = await api.createInvite(modelId)
      setLink(`${window.location.origin}/convite/${token}`)
    } catch {
      setError('Não foi possível gerar o convite.')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Convite de Acesso</p>
      {!link ? (
        <button onClick={generate} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm border border-border text-foreground/80 hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-60">
          <Link2 className="w-4 h-4" />
          {loading ? 'Gerando…' : 'Gerar link de convite'}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Envie este link ao modelo para ele criar o login:</p>
          <div className="flex items-center gap-2">
            <input readOnly value={link}
              className="flex-1 bg-muted/40 border border-border rounded-sm px-3 py-2 text-xs text-foreground/80 focus:outline-none" />
            <button onClick={copy} className="p-2 rounded-sm border border-border hover:border-primary/50 transition-colors" title="Copiar">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  )
}
