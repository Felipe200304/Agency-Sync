import { cookies } from 'next/headers'
import { api } from '@/lib/api'
import type { ApiBrand } from '@/lib/api'
import { Mail, Phone, MapPin, Building2 } from 'lucide-react'
import { NewClientButton } from '@/components/clients/new-client-button'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const token = (await cookies()).get('token')?.value
  let brands: ApiBrand[] = []
  let error: string | null = null
  try {
    brands = await api.brands(token)
  } catch {
    error = 'Não foi possível carregar os clientes. Verifique se o backend está rodando.'
  }

  const active = brands.filter(b => b.status === 'ativo').length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-light">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{active} clientes ativos</p>
        </div>
        <NewClientButton />
      </div>

      {error && <p className="text-sm text-red-400 mb-6">{error}</p>}

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Clientes ativos', value: active },
          { label: 'Total de clientes', value: brands.length },
          { label: 'Clientes inativos', value: brands.length - active },
        ].map(({ label, value }) => (
          <div key={label} className="glass rounded-sm p-4">
            <p className="text-3xl font-heading font-light text-primary">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabela de clientes */}
      <div className="glass rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Cliente', 'Responsavel', 'Contato', 'Cidade', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs text-muted-foreground tracking-wider uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 && !error && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">Nenhum cliente cadastrado.</td></tr>
            )}
            {brands.map((b, i) => (
              <tr key={b.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{b.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">{b.responsible ?? '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-0.5">
                    {b.email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[180px]">{b.email}</span>
                      </div>
                    )}
                    {b.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{b.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {[b.city, b.state].filter(Boolean).join(', ') || '—'}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-sm border ${
                    b.status === 'ativo'
                      ? 'text-primary bg-primary/10 border-primary/20'
                      : 'text-muted-foreground bg-muted/30 border-border'
                  }`}>
                    {b.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
