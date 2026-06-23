'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'

const experienceOptions = ['Passarela', 'Editorial', 'Comercial', 'Digital', 'Publicidade', 'TV', 'Catálogo', 'Influencer', 'Internacional']

export default function NewModelPage() {
  const [experience, setExperience] = useState<string[]>([])

  function toggleExp(exp: string) {
    setExperience(prev =>
      prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/models"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-light">Cadastrar Modelo</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Preencha as informações do novo talento</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Foto + Dados Principais */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Informações Pessoais</h2>
          <div className="flex gap-6">
            {/* Upload Foto */}
            <div className="flex-shrink-0">
              <div className="w-32 h-40 border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors group">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground text-center leading-tight">Foto<br />principal</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Nome completo</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Nome civil" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Nome artístico</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Nome para o book" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">E-mail</label>
                <input type="email" className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Telefone / WhatsApp</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="(00) 90000-0000" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Cidade</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="São Paulo" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Estado</label>
                <select className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors text-foreground">
                  <option value="">Selecione</option>
                  {['SP','RJ','MG','RS','PR','SC','BA','PE','CE','GO','DF'].map(uf => (
                    <option key={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Medidas */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Medidas & Aparência</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Altura (cm)', placeholder: '176' },
              { label: 'Peso (kg)', placeholder: '57' },
              { label: 'Busto (cm)', placeholder: '86' },
              { label: 'Cintura (cm)', placeholder: '61' },
              { label: 'Quadril (cm)', placeholder: '89' },
              { label: 'Manequim', placeholder: '38' },
              { label: 'Calçado', placeholder: '37' },
            ].map(field => (
              <div key={field.label}>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">{field.label}</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder={field.placeholder} />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Olhos</label>
              <select className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors text-foreground">
                <option>Castanho</option>
                <option>Verde</option>
                <option>Azul</option>
                <option>Mel</option>
                <option>Cinza</option>
                <option>Preto</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Cor do cabelo</label>
              <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Ex: Castanho escuro" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Tom de pele</label>
              <select className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors text-foreground">
                <option>Clara</option>
                <option>Morena clara</option>
                <option>Morena</option>
                <option>Morena escura</option>
                <option>Negra</option>
              </select>
            </div>
          </div>
        </div>

        {/* Experiência & Redes */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Experiência & Redes Sociais</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-2">Área de experiência</label>
            <div className="flex flex-wrap gap-2">
              {experienceOptions.map(exp => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => toggleExp(exp)}
                  className={`px-3 py-1.5 rounded-sm text-xs border transition-all ${
                    experience.includes(exp)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Instagram</label>
              <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="@usuario" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">TikTok</label>
              <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="@usuario" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Comissão da agência (%)</label>
              <input type="number" className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="20" min="0" max="50" />
            </div>
          </div>
        </div>

        {/* Fotos do Book */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Fotos do Book</h2>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors group">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground">Adicionar foto</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/models"
            className="px-6 py-2.5 rounded-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          >
            Cancelar
          </Link>
          <button className="px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all tracking-wide">
            Cadastrar Modelo
          </button>
        </div>
      </div>
    </div>
  )
}
