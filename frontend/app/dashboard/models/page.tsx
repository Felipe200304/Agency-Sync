'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { ModelCard } from '@/components/models/model-card'
import { api, toModel } from '@/lib/api'
import type { Model, ModelStatus } from '@/lib/types'

const statusFilters: { value: ModelStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'available', label: 'Disponível' },
  { value: 'on-campaign', label: 'Em Campanha' },
  { value: 'inactive', label: 'Inativo' },
]

export default function ModelsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ModelStatus | 'todos'>('todos')
  const [models, setModels] = useState<Model[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.models()
      .then(list => setModels(list.map(toModel)))
      .catch(() => setError('Não foi possível carregar os modelos. O backend está rodando?'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = models.filter(m => {
    const matchSearch = m.artisticName.toLowerCase().includes(search.toLowerCase()) ||
      m.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'todos' || m.status === status
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Modelos" />

      <div className="flex-1 p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-sm px-3 py-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="search"
              placeholder="Buscar por nome ou cidade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatus(f.value)}
                className={`px-3 py-1.5 rounded-sm text-xs tracking-wide transition-colors ${
                  status === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Link
            href="/dashboard/models/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-sm hover:opacity-90 transition-all ml-auto"
          >
            <Plus className="w-4 h-4" />
            Novo Modelo
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {loading ? 'Carregando…' : `${filtered.length} modelos encontrados`}
        </p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(m => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </div>
    </div>
  )
}
