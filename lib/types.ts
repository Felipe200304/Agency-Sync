export type ModelStatus = 'disponivel' | 'em-campanha' | 'inativo'
export type CastingStatus = 'solicitado' | 'em-analise' | 'modelos-enviados' | 'em-avaliacao' | 'confirmado' | 'concluido'
export type PaymentStatus = 'pendente' | 'pago' | 'atrasado'
export type EventType = 'casting' | 'trabalho' | 'reuniao' | 'producao' | 'evento'
export type StaffRole = 'administrador' | 'booker' | 'scout' | 'financeiro'
export type UserRole = 'agencia' | 'modelo' | 'cliente'

export interface Model {
  id: string
  name: string
  artisticName: string
  photo: string
  photos: string[]
  height: number
  weight: number
  bust: number
  waist: number
  hips: number
  size: number
  shoe: number
  eyeColor: string
  hairColor: string
  city: string
  state: string
  status: ModelStatus
  instagram: string
  tiktok?: string
  experience: string[]
  worksHistory: Work[]
  agencyComission: number
}

export interface Work {
  id: string
  campaign: string
  brand: string
  date: string
  location: string
  cachet: number
  paymentStatus: PaymentStatus
  paymentDeadline: string
  duration: string
  description: string
  briefing?: string
  responsible: string
  responsibleEmail: string
  responsiblePhone: string
  contract?: string
}

export interface Casting {
  id: string
  title: string
  brand: string
  responsible: string
  email: string
  phone: string
  location: string
  city: string
  state: string
  date: string
  time: string
  modelsNeeded: number
  desiredProfile: string
  cachet: number
  paymentDeadline: string
  campaignDuration: string
  workDuration: string
  description: string
  status: CastingStatus
  models: CastingModel[]
  createdAt: string
}

export interface CastingModel {
  modelId: string
  modelName: string
  modelPhoto: string
  status: 'enviado' | 'aprovado' | 'reprovado' | 'pendente'
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  endTime?: string
  type: EventType
  description?: string
  location?: string
  modelId?: string
  castingId?: string
}

export interface StaffMember {
  id: string
  name: string
  role: StaffRole
  email: string
  phone: string
  photo: string
  activeModels?: number
  activeClients?: number
  activeCastings?: number
}

export interface Client {
  id: string
  brand: string
  responsible: string
  email: string
  phone: string
  city: string
  state: string
  campaigns: number
  lastCampaign?: string
  status: 'ativo' | 'inativo'
  logo?: string
}

export interface FinanceRecord {
  id: string
  modelId: string
  modelName: string
  campaign: string
  brand: string
  date: string
  cachet: number
  agencyComission: number
  modelValue: number
  status: PaymentStatus
  paymentDate?: string
}

export interface MonthlyRevenue {
  month: string
  receita: number
  repasses: number
  comissoes: number
}
