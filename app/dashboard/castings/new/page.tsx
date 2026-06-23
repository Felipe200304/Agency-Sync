'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewCastingPage() {
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
            {[
              { label: 'Marca / Empresa', placeholder: 'Ex: Dior Brasil' },
              { label: 'Responsável pelo contato', placeholder: 'Nome completo' },
              { label: 'E-mail', placeholder: 'email@empresa.com' },
              { label: 'Telefone / WhatsApp', placeholder: '(00) 90000-0000' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">{f.label}</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>

        {/* Dados do trabalho */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Dados do Trabalho</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Título da campanha</label>
            <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Ex: Campanha Verão 2026 — Linha Premium" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Data do casting', type: 'date', placeholder: '' },
              { label: 'Horário', type: 'time', placeholder: '' },
              { label: 'Local / Estúdio', type: 'text', placeholder: 'Ex: Estúdio Central, Av. Paulista' },
              { label: 'Cidade', type: 'text', placeholder: 'São Paulo' },
              { label: 'Duração do trabalho', type: 'text', placeholder: 'Ex: 2 dias' },
              { label: 'Duração da campanha', type: 'text', placeholder: 'Ex: 6 meses' },
              { label: 'Cachê por modelo (R$)', type: 'number', placeholder: '0,00' },
              { label: 'Prazo pagamento', type: 'text', placeholder: 'Ex: 30 dias' },
              { label: 'Quantidade de modelos', type: 'number', placeholder: '1' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">{f.label}</label>
                <input type={f.type} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>

        {/* Briefing */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Briefing</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Perfil desejado</label>
            <textarea
              className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none h-20"
              placeholder="Descreva o perfil de modelo desejado (altura, tipo físico, cabelo, etc.)"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Descrição do trabalho</label>
            <textarea
              className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none h-28"
              placeholder="Descreva detalhes sobre o trabalho, tipo de conteúdo, uso das imagens, etc."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/castings" className="px-6 py-2.5 rounded-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
            Cancelar
          </Link>
          <button className="px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all tracking-wide">
            Criar Casting
          </button>
        </div>
      </div>
    </div>
  )
}
