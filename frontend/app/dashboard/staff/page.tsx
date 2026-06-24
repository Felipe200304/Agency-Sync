import { UserCheck } from 'lucide-react'

export default function StaffPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-light">Equipe</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gestão de funcionários da agência</p>
      </div>

      <div className="glass rounded-sm border-dashed flex flex-col items-center justify-center text-center gap-3 py-20 px-6">
        <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
          <UserCheck className="w-6 h-6 text-primary" />
        </div>
        <h2 className="font-heading text-xl font-light">Em breve</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          A gestão de funcionários (com papéis e permissões — ex.: administrador, booker, scout, financeiro)
          será adicionada quando os papéis forem definidos.
        </p>
      </div>
    </div>
  )
}
