'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { setSession, HOME_BY_ROLE } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { token, user } = await api.login(email.trim(), password)
      setSession(token, user.role)
      router.push(HOME_BY_ROLE[user.role])
    } catch {
      setError('E-mail ou senha inválidos.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex relative">
      {/* Mobile — imagem de fundo cobrindo 100% da viewport (100vw x 100dvh) */}
      <div className="lg:hidden fixed inset-0 z-0 w-screen h-[100dvh]">
        <img
          src="/login-model.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/login-model.jpg"
          alt=""
          className="w-full h-full object-cover object-[50%_35%]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-12 left-10">
          <span className="font-heading text-3xl tracking-widest gold-text font-light">AGENCY SYNC</span>
          <p className="text-foreground/40 text-sm mt-2 max-w-xs">
            A plataforma para o ecossistema da moda brasileira.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <span className="font-heading text-2xl tracking-widest gold-text font-light">AGENCY SYNC</span>
          </div>

          <h1 className="font-heading text-4xl font-light text-foreground mb-2">Bem-vindo de volta</h1>
          <p className="text-foreground/40 text-sm mb-10">Faça login para acessar sua conta</p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-foreground/40 block mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-foreground/40 block mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-foreground/40 cursor-pointer select-none">
                <input type="checkbox" className="accent-primary w-3.5 h-3.5" />
                Manter conectado
              </label>
              <a href="#" className="text-xs text-foreground/30 hover:text-foreground/60 transition-colors">
                Esqueci minha senha
              </a>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="block w-full py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase text-center hover:opacity-90 transition-all rounded-sm mt-2 disabled:opacity-60"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-foreground/25 mt-8">
            Não tem conta?{' '}
            <a href="#" className="text-foreground/50 hover:text-foreground transition-colors">
              Entre em contato com sua agência
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
