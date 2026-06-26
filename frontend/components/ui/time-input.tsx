'use client'

import { formatTime } from '@/lib/time'

/**
 * Campo de horário como texto simples com máscara hh:mm. O valor é mantido
 * já no formato HH:MM (o mesmo que a API espera), sem o seletor nativo do
 * navegador. Reutilizável em qualquer formulário.
 */
interface Props {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function TimeInput({ value, onChange, className, placeholder = 'hh:mm' }: Props) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={5}
      value={value}
      onChange={e => onChange(formatTime(e.target.value))}
      placeholder={placeholder}
      className={className}
    />
  )
}
