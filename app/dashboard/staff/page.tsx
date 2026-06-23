import { staffMembers } from '@/lib/mock-data'
import type { StaffRole } from '@/lib/types'
import { Mail, Phone, Plus, Users, Briefcase, UserSearch } from 'lucide-react'

const roleLabels: Record<StaffRole, string> = {
  administrador: 'Administrador',
  booker:        'Booker',
  scout:         'Scout',
  financeiro:    'Financeiro',
}

const roleColors: Record<StaffRole, string> = {
  administrador: 'text-primary bg-primary/10 border-primary/20',
  booker:        'text-blue-400 bg-blue-400/10 border-blue-400/20',
  scout:         'text-orange-400 bg-orange-400/10 border-orange-400/20',
  financeiro:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

export default function StaffPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-light">Equipe</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{staffMembers.length} membros ativos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Adicionar Membro
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de membros', value: staffMembers.length, icon: Users },
          { label: 'Bookers ativos', value: staffMembers.filter(s => s.role === 'booker').length, icon: Briefcase },
          { label: 'Scouts', value: staffMembers.filter(s => s.role === 'scout').length, icon: UserSearch },
          { label: 'Modelos gerenciados', value: staffMembers.reduce((acc, s) => acc + (s.activeModels || 0), 0), icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-heading font-light">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de membros */}
      <div className="grid grid-cols-3 gap-5">
        {staffMembers.map(member => (
          <div key={member.id} className="glass rounded-sm p-5 hover:border-primary/20 transition-all group">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={member.photo}
                alt={member.name}
                className="w-14 h-14 rounded-sm object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium group-hover:text-primary transition-colors">{member.name}</h3>
                <span className={`inline-flex text-xs px-2 py-0.5 rounded-sm border mt-1 ${roleColors[member.role]}`}>
                  {roleLabels[member.role]}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{member.phone}</span>
              </div>
            </div>

            {(member.activeModels || member.activeCastings) && (
              <div className="flex gap-4 pt-3 border-t border-border/50">
                {member.activeModels && (
                  <div>
                    <p className="text-lg font-heading font-light text-primary">{member.activeModels}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Modelos</p>
                  </div>
                )}
                {member.activeCastings && (
                  <div>
                    <p className="text-lg font-heading font-light text-primary">{member.activeCastings}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Castings</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add new card */}
        <button className="glass rounded-sm p-5 border-dashed flex flex-col items-center justify-center gap-3 hover:border-primary/40 transition-all text-muted-foreground hover:text-primary min-h-[180px]">
          <div className="w-10 h-10 rounded-sm border-2 border-dashed border-current flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <p className="text-xs tracking-wider">Convidar membro</p>
        </button>
      </div>
    </div>
  )
}
