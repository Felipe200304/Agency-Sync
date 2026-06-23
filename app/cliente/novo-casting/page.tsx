'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NovoCastingClientePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cliente" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Titulo da campanha</label>
              <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Ex: Campanha Verao 2026" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Data do casting', type: 'date' },
                { label: 'Horario preferencial', type: 'time' },
                { label: 'Local / Estudio', type: 'text', placeholder: 'Endereco completo' },
                { label: 'Cidade', type: 'text', placeholder: 'Sao Paulo' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-muted-foreground tracking-wider uppercase">{f.label}</label>
                  <input type={f.type} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder={'placeholder' in f ? f.placeholder : ''} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Modelos & Cachet</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Quantidade de modelos', type: 'number', placeholder: '1' },
              { label: 'Cachet por modelo (R$)', type: 'number', placeholder: '0,00' },
              { label: 'Duracao do trabalho', type: 'text', placeholder: 'Ex: 2 dias' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">{f.label}</label>
                <input type={f.type} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Perfil Desejado</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Descricao do perfil</label>
            <textarea
              className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none h-24"
              placeholder="Descreva altura, tipo fisico, tom de pele, estilo..."
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-wider uppercase">Descricao do trabalho</label>
            <textarea
              className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none h-28"
              placeholder="Tipo de conteudo, uso das imagens, duracao da campanha..."
            />
          </div>
        </div>

        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-4">Informacoes de Contato</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Responsavel', placeholder: 'Nome completo' },
              { label: 'E-mail', placeholder: 'email@empresa.com' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">{f.label}</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/cliente" className="px-6 py-2.5 rounded-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
            Cancelar
          </Link>
          <button className="px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all tracking-wide">
            Enviar Solicitacao
          </button>
        </div>
      </div>
    </div>
  )
}
