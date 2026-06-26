import { DashboardHeader } from '@/components/dashboard/header'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { CastingsChart } from '@/components/dashboard/castings-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { api } from '@/lib/api'
import type { ApiCasting } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const token = (await cookies()).get('token')?.value
  let activeModels = 0
  let openCastings = 0
  let pendingPayments = 0
  let totalRevenue = 0
  let castings: ApiCasting[] = []
  try {
    const [models, cs, finance] = await Promise.all([api.models(token), api.castings(token), api.finance(token)])
    activeModels = models.filter(m => m.status !== 'inactive').length
    castings = cs
    openCastings = cs.filter(c => c.status !== 'completed').length
    pendingPayments = finance.filter(f => f.status === 'pending').reduce((acc, f) => acc + f.cachet, 0)
    totalRevenue = finance.reduce((acc, f) => acc + f.cachet, 0)
  } catch {
    // backend indisponível — KPIs ficam zerados
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Modelos Ativos"
            value={String(activeModels)}
            icon={Users}
            sub="do total cadastrado"
          />
          <KpiCard
            title="Castings Abertos"
            value={String(openCastings)}
            icon={Briefcase}
            sub="em andamento"
          />
          <KpiCard
            title="Pendente a Receber"
            value={`R$ ${pendingPayments.toLocaleString('pt-BR')}`}
            icon={DollarSign}
            sub="de marcas"
            tone="pending"
          />
          <KpiCard
            title="Receita Total"
            value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`}
            icon={TrendingUp}
            sub="todos os cachês"
            tone="positive"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <CastingsChart />
        </div>

        {/* Bottom */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Upcoming castings */}
          <div className="bg-card border border-border rounded-sm p-6">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-5">Próximos Castings</p>
            <div className="space-y-3">
              {castings.filter(c => !['completed', 'confirmed'].includes(c.status)).slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/castings/${c.id}`}
                  className="flex items-center gap-3 p-2 rounded-sm hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.brand ?? 'Sem marca'}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-foreground/60">
                      {c.date ? new Date(c.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '—'}
                    </p>
                    <p className="text-xs text-primary">{c.modelsNeeded} modelo{c.modelsNeeded > 1 ? 's' : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/dashboard/castings" className="block text-center text-xs text-primary/70 hover:text-primary mt-4 transition-colors tracking-wide">
              Ver todos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
