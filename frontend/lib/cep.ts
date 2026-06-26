/**
 * Consulta de CEP via ViaCEP (https://viacep.com.br). Reutilizável em
 * qualquer formulário com endereço. Retorna os campos do endereço ou
 * null se o CEP for inválido / não encontrado.
 */

export interface CepResult {
  street: string
  district: string
  city: string
  state: string
}

/** Mantém só os dígitos do CEP. */
export function cepDigits(cep: string): string {
  return cep.replace(/\D/g, '')
}

/** Formata como 00000-000 enquanto o usuário digita. */
export function formatCep(cep: string): string {
  const d = cepDigits(cep).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export async function lookupCep(cep: string): Promise<CepResult | null> {
  const d = cepDigits(cep)
  if (d.length !== 8) return null
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.erro) return null
    return {
      street: data.logradouro ?? '',
      district: data.bairro ?? '',
      city: data.localidade ?? '',
      state: data.uf ?? '',
    }
  } catch {
    return null
  }
}
