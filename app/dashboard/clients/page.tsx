import { clients, castings } from '@/lib/mock-data'
import { Mail, Phone, MapPin, Briefcase, Plus, Building2 } from 'lucide-react'

export default function ClientsPage() {
  const activeCastingsByBrand = (brandName: string) =>
    castings.filter(c => c.brand === brandName && c.status !== 'concluido').length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-light">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{clients.filter(c => c.status === 'ativo').length} clientes ativos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Clientes ativos', value: clients.filter(c => c.status === 'ativo').length },
          { label: 'Total de campanhas', value: clients.reduce((s, c) => s + c.campaigns, 0) },
          { label: 'Castings ativos', value: castings.filter(c => c.status !== 'concluido').length },
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
              {['Cliente', 'Responsavel', 'Contato', 'Cidade', 'Campanhas', 'Castings Ativos', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs text-muted-foreground tracking-wider uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client, i) => (
              <tr key={client.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{client.brand}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{client.responsible}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[180px]">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {client.city}, {client.state}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-medium">{client.campaigns}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">{activeCastingsByBrand(client.brand)}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-sm border ${
                    client.status === 'ativo'
                      ? 'text-primary bg-primary/10 border-primary/20'
                      : 'text-muted-foreground bg-muted/30 border-border'
                  }`}>
                    {client.status === 'ativo' ? 'Ativo' : 'Inativo'}
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
