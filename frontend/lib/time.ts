/**
 * Máscara de horário HH:MM para input de texto simples. Aceita só dígitos,
 * insere o ":" automaticamente e limita hora (00–23) e minuto (00–59).
 * Reutilizável em qualquer campo de horário.
 */
export function formatTime(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) {
    // Limita a hora a 23 assim que o 2º dígito entra.
    if (d.length === 2 && Number(d) > 23) return '23'
    return d
  }
  let hh = d.slice(0, 2)
  let mm = d.slice(2)
  if (Number(hh) > 23) hh = '23'
  if (Number(mm) > 59) mm = '59'
  return `${hh}:${mm}`
}
