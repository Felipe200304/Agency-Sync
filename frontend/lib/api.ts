/**
 * Cliente da API do backend (Spring Boot). Base configurável por env;
 * default para o backend local em Docker (porta 8080).
 */
import type { Model } from './types'

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

/** Lê o token do cookie no browser (no SSR o token é passado explicitamente). */
function clientToken(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie.split('; ').find(c => c.startsWith('token='))?.split('=')[1]
}

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const auth = token ?? clientToken()
  const headers = {
    ...(init?.headers as Record<string, string> | undefined),
    ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
  }
  const method = init?.method ?? 'GET'
  // [DEBUG castings] remover depois de diagnosticar o portal da marca.
  console.log(`%c[API] ${method} ${API_BASE}${path}`, 'color:#7aa2f7', { hasToken: !!auth })
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', ...init, headers })
  console.log(`%c[API] ${method} ${path} → ${res.status}`, res.ok ? 'color:#9ece6a' : 'color:#f7768e')

  // Sessão expirada/ausente no browser → volta ao login.
  if (res.status === 401 && typeof window !== 'undefined' && path !== '/auth/login') {
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'role=; path=/; max-age=0'
    window.location.href = '/login'
  }
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

// --- Formatos retornados pelo backend ---

export interface ApiModel {
  id: string
  name: string
  artisticName: string | null
  baseAgencyId: string | null
  baseAgencyName: string | null
  city: string | null
  state: string | null
  country: string | null
  heightCm: number | null
  bust: number | null
  waist: number | null
  hips: number | null
  shoe: number | null
  eyeColor: string | null
  hairColor: string | null
  instagram: string | null
  status: string
  photoUrl: string | null
}

export interface ApiModelPhoto {
  id: string
  url: string
  position: number
}

export interface ApiEvent {
  id: string
  title: string
  type: string
  eventDate: string
  startTime: string | null
  endTime: string | null
  location: string | null
  description: string | null
  agencyId: string | null
}

export interface ApiAgencyLink {
  id: string
  agencyId: string
  agencyName: string
  role: 'BASE' | 'MOTHER' | 'INTERNATIONAL' | 'LOCAL'
  commissionPercent: number
}

export interface ApiCastingModel {
  modelId: string
  modelName: string
  status: 'submitted' | 'approved' | 'rejected' | 'pending'
}

export interface ApiCasting {
  id: string
  brand: string | null
  brandId: string | null
  title: string
  responsible: string | null
  email: string | null
  phone: string | null
  location: string | null
  city: string | null
  state: string | null
  date: string | null
  time: string | null
  modelsNeeded: number
  desiredProfile: string | null
  cachet: number | null
  paymentDeadline: string | null
  campaignDuration: string | null
  workDuration: string | null
  description: string | null
  status: string
  models: ApiCastingModel[]
  createdAt: string | null
}

export interface NewCasting {
  brandId?: string
  title: string
  responsible?: string
  email?: string
  phone?: string
  location?: string
  city?: string
  state?: string
  date?: string
  time?: string
  modelsNeeded?: number
  desiredProfile?: string
  cachet?: number
  paymentDeadline?: string
  campaignDuration?: string
  workDuration?: string
  description?: string
}

export interface ApiFinanceRecord {
  id: string
  modelId: string
  modelName: string
  campaign: string | null
  brand: string | null
  date: string | null
  cachet: number
  currency: string
  agencyComission: number
  modelValue: number
  status: 'paid' | 'pending' | 'overdue'
  paymentDate: string | null
}

export interface ApiMonthlyRevenue {
  month: string
  receita: number
  comissoes: number
  repasses: number
}

export interface ApiExpense {
  id: string
  description: string
  category: string | null
  amount: number
  currency: string
  date: string | null
  status: 'paid' | 'pending'
}

export interface NewExpense {
  description: string
  category?: string
  amount: number
  currency?: string
  date?: string
  status?: string
}

export interface ApiJob {
  castingId: string
  title: string
  brand: string | null
  date: string | null
  location: string | null
  cachet: number | null
  brandStatus: 'submitted' | 'approved' | 'rejected' | 'pending'
  decision: 'pending' | 'confirmed' | 'declined'
}

export interface ApiMeFinance {
  summary: {
    jobs: number
    grossTotal: number
    netReceived: number
    netPending: number
    totalCommission: number
  }
  records: ApiFinanceRecord[]
}

export interface AgencyDto {
  id: string
  name: string
  country: string | null
  city: string | null
}

export interface Address {
  cep?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  district?: string | null
  city?: string | null
  state?: string | null
}

export interface ApiBrand {
  id: string
  name: string
  responsible: string | null
  email: string | null
  phone: string | null
  status: string
  cnpj: string | null
  legalName: string | null
  address: Address | null
}

export interface NewBrand {
  name: string
  responsible?: string
  email?: string
  phone?: string
  status?: string
  cnpj?: string
  legalName?: string
  address?: Address
}

export type Role = 'AGENCY' | 'MODEL' | 'BRAND'

export interface AuthUser {
  id: string
  email: string
  role: Role
  agencyId: string | null
  modelId: string | null
  brandId: string | null
}

export interface InviteInfo {
  token: string
  name: string
  role: Role
  used: boolean
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface NewModel {
  name: string
  artisticName?: string
  city?: string
  state?: string
  heightCm?: number
  bust?: number
  waist?: number
  hips?: number
  shoe?: number
  eyeColor?: string
  hairColor?: string
  instagram?: string
  photoUrl?: string
}

// --- Endpoints ---

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  me: (token: string) => request<AuthUser>('/auth/me', undefined, token),

  // --- "Eu" (modelo logado): backend resolve o modelId pelo token ---
  meUser: (token?: string) => request<AuthUser>('/me', undefined, token),
  meAgenda: (token?: string) => request<ApiEvent[]>('/me/agenda', undefined, token),
  meBlockDay: (date: string, title?: string) =>
    request<ApiEvent>('/me/agenda/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, title }),
    }),
  meRemoveBlock: (eventId: string) =>
    fetch(`${API_BASE}/me/agenda/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${clientToken() ?? ''}` },
    }).then(r => { if (!r.ok && r.status !== 204) throw new Error(`DELETE block → ${r.status}`) }),
  meJobs: (token?: string) => request<ApiJob[]>('/me/jobs', undefined, token),
  meDecideJob: (castingId: string, decision: string) =>
    request<ApiJob>(`/me/jobs/${castingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    }),
  meFinance: (token?: string) => request<ApiMeFinance>('/me/finance', undefined, token),

  // --- Castings da própria marca (portal do cliente) ---
  meCastings: (token?: string) => request<ApiCasting[]>('/me/castings', undefined, token),
  createMeCasting: (body: NewCasting) =>
    request<ApiCasting>('/me/castings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  // Brand approves/rejects a model on its own casting (ownership checked server-side).
  decideMeCastingModel: (castingId: string, modelId: string, status: string) =>
    request<ApiCasting>(`/me/castings/${castingId}/models/${modelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
  // token opcional: usado pelos server components (SSR) que leem o cookie via next/headers.
  models: (token?: string) => request<ApiModel[]>('/models', undefined, token),
  model: (id: string, token?: string) => request<ApiModel>(`/models/${id}`, undefined, token),
  createModel: (body: NewModel) =>
    request<ApiModel>('/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  // --- Galeria (book) do modelo ---
  modelPhotos: (id: string, token?: string) =>
    request<ApiModelPhoto[]>(`/models/${id}/photos`, undefined, token),
  addModelPhotos: (id: string, urls: string[]) =>
    request<ApiModelPhoto[]>(`/models/${id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    }),
  deleteModelPhoto: (id: string, photoId: string) =>
    fetch(`${API_BASE}/models/${id}/photos/${photoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${clientToken() ?? ''}` },
    }).then(r => { if (!r.ok && r.status !== 204) throw new Error(`DELETE photo → ${r.status}`) }),
  agenda: (id: string, token?: string) => request<ApiEvent[]>(`/models/${id}/agenda`, undefined, token),
  agencyLinks: (id: string, token?: string) => request<ApiAgencyLink[]>(`/models/${id}/agencies`, undefined, token),
  agendaExportUrl: (id: string, token?: string) =>
    `${API_BASE}/models/${id}/agenda/export${token ? `?token=${encodeURIComponent(token)}` : ''}`,
  brands: (token?: string) => request<ApiBrand[]>('/brands', undefined, token),
  createBrand: (body: NewBrand) =>
    request<ApiBrand>('/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  castings: (token?: string) => request<ApiCasting[]>('/castings', undefined, token),
  casting: (id: string, token?: string) => request<ApiCasting>(`/castings/${id}`, undefined, token),
  createCasting: (body: NewCasting) =>
    request<ApiCasting>('/castings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  setCastingStatus: (id: string, status: string) =>
    request<ApiCasting>(`/castings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
  addCastingModels: (id: string, modelIds: string[]) =>
    request<ApiCasting>(`/castings/${id}/models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelIds }),
    }),
  decideCastingModel: (id: string, modelId: string, status: string) =>
    request<ApiCasting>(`/castings/${id}/models/${modelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),

  // --- Configurações (agência + conta) ---
  agency: (id: string, token?: string) => request<AgencyDto>(`/agencies/${id}`, undefined, token),
  updateAgency: (id: string, body: { name: string; country?: string; city?: string }) =>
    request<AgencyDto>(`/agencies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    fetch(`${API_BASE}/me/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clientToken() ?? ''}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    }).then(r => { if (!r.ok && r.status !== 204) throw new Error(`senha → ${r.status}`) }),

  // --- Convite (onboarding do modelo ou da marca) ---
  createInvite: (modelId: string) =>
    request<InviteInfo>(`/models/${modelId}/invite`, { method: 'POST' }),
  createBrandInvite: (brandId: string) =>
    request<InviteInfo>(`/brands/${brandId}/invite`, { method: 'POST' }),
  inviteInfo: (token: string) =>
    request<InviteInfo>(`/invite/${token}`),
  acceptInvite: (token: string, email: string, password: string) =>
    request<AuthResponse>(`/invite/${token}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  finance: (token?: string) => request<ApiFinanceRecord[]>('/finance', undefined, token),
  financeMonthly: (token?: string) => request<ApiMonthlyRevenue[]>('/finance/monthly', undefined, token),
  setFinanceStatus: (id: string, status: string) =>
    request<ApiFinanceRecord>(`/finance/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),

  // --- Despesas ---
  expenses: (token?: string) => request<ApiExpense[]>('/finance/expenses', undefined, token),
  createExpense: (body: NewExpense) =>
    request<ApiExpense>('/finance/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  setExpenseStatus: (id: string, status: string) =>
    request<ApiExpense>(`/finance/expenses/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
  deleteExpense: (id: string) =>
    fetch(`${API_BASE}/finance/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${clientToken() ?? ''}` },
    }).then(r => { if (!r.ok && r.status !== 204) throw new Error(`DELETE expense → ${r.status}`) }),
}

const PLACEHOLDER_PHOTO =
  'https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=400&h=600&fit=crop'

/** Adapta o modelo da API ao tipo rico do frontend (campos ausentes recebem default). */
export function toModel(m: ApiModel): Model {
  return {
    id: m.id,
    name: m.name,
    artisticName: m.artisticName ?? m.name,
    photo: m.photoUrl ?? PLACEHOLDER_PHOTO,
    photos: [m.photoUrl ?? PLACEHOLDER_PHOTO],
    height: m.heightCm ?? 0,
    weight: 0,
    bust: m.bust ?? 0,
    waist: m.waist ?? 0,
    hips: m.hips ?? 0,
    size: 0,
    shoe: m.shoe ?? 0,
    eyeColor: m.eyeColor ?? '',
    hairColor: m.hairColor ?? '',
    city: m.city ?? '',
    state: m.state ?? '',
    status: (m.status as Model['status']) ?? 'available',
    instagram: m.instagram ?? '',
    experience: [],
    worksHistory: [],
    agencyComission: 20,
  }
}
