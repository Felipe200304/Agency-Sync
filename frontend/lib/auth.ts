import type { Role } from './api'

/** Página inicial de cada perfil após o login (login único, roteamento por papel). */
export const HOME_BY_ROLE: Record<Role, string> = {
  AGENCY: '/dashboard',
  MODEL: '/modelo',
  BRAND: '/cliente',
}

const MAX_AGE = 12 * 60 * 60 // 12h, alinhado ao TTL do JWT

/** Grava token e papel em cookies (lidos pelo middleware e pelo client). */
export function setSession(token: string, role: Role) {
  document.cookie = `token=${token}; path=/; max-age=${MAX_AGE}; samesite=lax`
  document.cookie = `role=${role}; path=/; max-age=${MAX_AGE}; samesite=lax`
}

export function clearSession() {
  document.cookie = 'token=; path=/; max-age=0'
  document.cookie = 'role=; path=/; max-age=0'
}
