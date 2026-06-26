'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { DashboardHeader } from '@/components/dashboard/header'

const cls = 'mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors'

export default function ConfiguracoesPage() {
  const [agencyId, setAgencyId] = useState<string | null>(null)
  const [agency, setAgency] = useState({ name: '', country: '', city: '' })
  const [agencyMsg, setAgencyMsg] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [pwd, setPwd] = useState({ current: '', next: '' })
  const [pwdMsg, setPwdMsg] = useState<string | null>(null)
  const [pwdErr, setPwdErr] = useState<string | null>(null)

  useEffect(() => {
    api.meUser()
      .then(u => {
        if (!u.agencyId) { setLoadError('Sua conta não está vinculada a uma agência.'); return }
        setAgencyId(u.agencyId)
        return api.agency(u.agencyId).then(a =>
          setAgency({ name: a.name ?? '', country: a.country ?? '', city: a.city ?? '' }))
      })
      .catch(() => setLoadError('Não foi possível carregar as configurações.'))
  }, [])

  async function saveAgency() {
    if (!agencyId) return
    setAgencyMsg(null)
    try {
      await api.updateAgency(agencyId, { name: agency.name, country: agency.country, city: agency.city })
      setAgencyMsg('Dados da agência salvos.')
    } catch { setAgencyMsg('Erro ao salvar.') }
  }

  async function savePassword() {
    setPwdMsg(null); setPwdErr(null)
    if (pwd.next.length < 6) { setPwdErr('A nova senha deve ter ao menos 6 caracteres.'); return }
    try {
      await api.changePassword(pwd.current, pwd.next)
      setPwd({ current: '', next: '' })
      setPwdMsg('Senha alterada com sucesso.')
    } catch { setPwdErr('Não foi possível alterar (verifique a senha atual).') }
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Configurações" />
      <div className="flex-1 p-6 max-w-2xl space-y-6">
        {loadError && <p className="text-sm text-red-400">{loadError}</p>}

        {/* Dados da agência */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Dados da Agência</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Nome</label>
              <input value={agency.name} onChange={e => setAgency({ ...agency, name: e.target.value })} className={cls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">País</label>
              <input value={agency.country} onChange={e => setAgency({ ...agency, country: e.target.value })} className={cls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Cidade</label>
              <input value={agency.city} onChange={e => setAgency({ ...agency, city: e.target.value })} className={cls} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button onClick={saveAgency} disabled={!agencyId}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm rounded-sm hover:opacity-90 transition-all disabled:opacity-50">
              Salvar
            </button>
            {agencyMsg && <span className="text-xs text-muted-foreground">{agencyMsg}</span>}
          </div>
        </div>

        {/* Trocar senha */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Alterar Senha</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Senha atual</label>
              <input type="password" value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} className={cls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Nova senha</label>
              <input type="password" value={pwd.next} onChange={e => setPwd({ ...pwd, next: e.target.value })} className={cls} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button onClick={savePassword}
              className="px-5 py-2 border border-border text-sm rounded-sm hover:border-primary/50 hover:text-primary transition-all">
              Alterar senha
            </button>
            {pwdMsg && <span className="text-xs text-primary">{pwdMsg}</span>}
            {pwdErr && <span className="text-xs text-red-400">{pwdErr}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
