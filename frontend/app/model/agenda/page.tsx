import { cookies } from 'next/headers'
import { api } from '@/lib/api'
import type { ApiJob } from '@/lib/api'
import { Download } from 'lucide-react'
import { AgendaCalendar } from '@/components/model/agenda-calendar'

export const dynamic = 'force-dynamic'

export default async function ModelAgendaPage() {
  const token = (await cookies()).get('token')?.value
  let modelId: string | undefined
  let jobs: ApiJob[] = []
  try {
    const user = await api.meUser(token)
    modelId = user.modelId ?? undefined
    jobs = await api.meJobs(token)
  } catch {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="font-heading text-3xl font-light">Minha Agenda</h1>
        <p className="text-sm text-red-400 mt-4">
          Não foi possível carregar a agenda. Verifique se o backend está rodando (docker compose up).
        </p>
      </div>
    )
  }

  // Casting é o teste; quando a marca aprova o modelo, vira trabalho. Entram
  // no calendário os com data que o modelo confirmou presença (casting) ou que
  // a marca já aprovou (trabalho). Recusados ficam de fora.
  const agendaJobs = jobs.filter(
    j => j.date && j.decision !== 'recusado' && (j.decision === 'confirmado' || j.brandStatus === 'aprovado'),
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-light">Minha Agenda</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Seus castings e trabalhos</p>
        </div>
        {modelId && (
          <a
            href={api.agendaExportUrl(modelId, token)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-sm hover:opacity-90 transition-all flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </a>
        )}
      </div>

      <AgendaCalendar jobs={agendaJobs} />
    </div>
  )
}
