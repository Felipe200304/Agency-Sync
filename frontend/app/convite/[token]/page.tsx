'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { setSession } from '@/lib/auth'

export default function ConvitePage() {
  const router = useRouter()
  const { token } = useParams<{ token: string }>()
  const [modelName, setModelName] = useState<string | null>(null)
  const [used, setUsed] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ok' | 'invalid'>('loading')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.inviteInfo(token)
      .then(info => { setModelName(info.modelName); setUsed(info.used); setStatus('ok') })
      .catch(() => setStatus('invalid'))
  }, [token])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const { token: jwt, user } = await api.acceptInvite(token, email.trim(), password)
      setSession(jwt, user.role)
      router.push('/modelo')
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados (senha mínima de 6 caracteres) ou o link.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <span className="font-heading text-2xl tracking-widest gold-text font-light">AGENCY SYNC</span>

        {status === 'loading' && <p className="text-sm text-muted-foreground mt-10">Carregando convite…</p>}

        {status === 'invalid' && (
          <p className="text-sm text-red-400 mt-10">Convite inválido ou expirado. Peça um novo link à sua agência.</p>
        )}

        {status === 'ok' && used && (
          <p className="text-sm text-yellow-400 mt-10">Este convite já foi utilizado. Faça login normalmente.</p>
        )}

        {status === 'ok' && !used && (
          <>
            <h1 className="font-heading text-3xl font-light text-foreground mt-8 mb-1">Crie seu acesso</h1>
            <p className="text-foreground/40 text-sm mb-8">
              Convite para <span className="text-foreground/70">{modelName}</span> — defina seu login.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-foreground/40 block mb-2">E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="seu@email.com"
                  className="w-full bg-input border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-foreground/40 block mb-2">Senha</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="mínimo 6 caracteres"
                  className="w-full bg-input border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={saving}
                className="block w-full py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase text-center hover:opacity-90 transition-all rounded-sm mt-2 disabled:opacity-60">
                {saving ? 'Criando…' : 'Criar conta e entrar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
