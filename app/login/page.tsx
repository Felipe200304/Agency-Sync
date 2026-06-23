'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Mobile — imagem de fundo atrás do formulário */}
      <div className="lg:hidden absolute inset-0 z-0">
        <img
          src="/login-model.jpg"
          alt=""
          className="w-full h-full object-cover object-[50%_25%]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/85" />
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
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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

            <Link
              href="/dashboard"
              className="block w-full py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase text-center hover:opacity-90 transition-all rounded-sm mt-2"
            >
              Entrar
            </Link>
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
