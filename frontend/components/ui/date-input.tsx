'use client'

import { useEffect, useState } from 'react'

/**
 * Campo de data exibido como dd/mm/aaaa (padrão BR), independente do locale
 * do navegador. Mantém o valor em ISO (yyyy-MM-dd) para a API.
 */
function isoToBr(iso: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : ''
}

function brToIso(br: string): string {
  const m = br.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : ''
}

interface Props {
  value: string // ISO (yyyy-MM-dd) ou ''
  onChange: (iso: string) => void
  className?: string
  placeholder?: string
}

export function DateInput({ value, onChange, className, placeholder = 'dd/mm/aaaa' }: Props) {
  const [text, setText] = useState(isoToBr(value))

  // Sincroniza quando o valor muda fora do componente (ex.: reset do formulário).
  useEffect(() => { setText(isoToBr(value)) }, [value])

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    let masked = digits
    if (digits.length >= 5) masked = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    else if (digits.length >= 3) masked = `${digits.slice(0, 2)}/${digits.slice(2)}`
    setText(masked)
    onChange(brToIso(masked)) // emite '' enquanto a data não estiver completa
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={handle}
      placeholder={placeholder}
      className={className}
    />
  )
}
