import { DashboardHeader } from '@/components/dashboard/header'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { CastingsChart } from '@/components/dashboard/castings-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { castings, models, financeRecords } from '@/lib/mock-data'

export default function DashboardPage() {
  const activeModels = models.filter(m => m.status !== 'inativo').length
  const openCastings = castings.filter(c => !['concluido'].includes(c.status)).length
  const pendingPayments = financeRecords.filter(f => f.status === 'pendente').reduce((acc, f) => acc + f.cachet, 0)

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Modelos Ativos"
            value={String(activeModels)}
            change="3 novos"
            positive
            icon={Users}
            sub="do total cadastrado"
          />
          <KpiCard
            title="Castings Abertos"
            value={String(openCastings)}
            change="2 novos"
            positive
            icon={Briefcase}
            sub="em andamento"
          />
          <KpiCard
            title="Pendente a Receber"
            value={`R$ ${pendingPayments.toLocaleString('pt-BR')}`}
            icon={DollarSign}
            sub="de marcas"
          />
          <KpiCard
            title="Receita Junho"
            value="R$ 46,8k"
            change="8,3%"
            positive
            icon={TrendingUp}
            sub="vs. maio"
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
              {castings.filter(c => !['concluido', 'confirmado'].includes(c.status)).slice(0, 4).map(c => (
                <Link
                  key={c.id}
                  href={`/dashboard/castings/${c.id}`}
                  className="flex items-center gap-3 p-2 rounded-sm hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.brand}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-foreground/60">{new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
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
