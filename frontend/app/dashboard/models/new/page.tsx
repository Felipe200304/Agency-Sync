'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import { api } from '@/lib/api'
import { compressImage, ImageTooLargeError } from '@/lib/image'

const experienceOptions = ['Passarela', 'Editorial', 'Comercial', 'Digital', 'Publicidade', 'TV', 'Catálogo', 'Influencer', 'Internacional']

type FormState = {
  name: string; artisticName: string; city: string; state: string
  heightCm: string; bust: string; waist: string; hips: string; shoe: string
  eyeColor: string; hairColor: string; instagram: string
}

const initialForm: FormState = {
  name: '', artisticName: '', city: '', state: '',
  heightCm: '', bust: '', waist: '', hips: '', shoe: '',
  eyeColor: 'Castanho', hairColor: '', instagram: '',
}

export default function NewModelPage() {
  const router = useRouter()
  const [experience, setExperience] = useState<string[]>([])
  const [form, setForm] = useState<FormState>(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Foto principal
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  // Fotos do book (4 slots)
  const bookInputRef = useRef<HTMLInputElement>(null)
  const [bookIndex, setBookIndex] = useState(0)
  const [bookUrls, setBookUrls] = useState<(string | null)[]>([null, null, null, null])

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    try {
      setPhotoUrl(await compressImage(file))
    } catch (err) {
      setError(err instanceof ImageTooLargeError ? err.message : 'Não foi possível processar a imagem.')
    }
  }

  function openBookPicker(index: number) {
    setBookIndex(index)
    bookInputRef.current?.click()
  }

  async function handleBookChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    try {
      const url = await compressImage(file)
      setBookUrls(prev => prev.map((u, i) => (i === bookIndex ? url : u)))
    } catch (err) {
      setError(err instanceof ImageTooLargeError ? err.message : 'Não foi possível processar a imagem.')
    }
  }

  const set = (field: keyof FormState) => (e: { target: { value: string } }) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const num = (v: string) => (v.trim() === '' ? undefined : Number(v))

  function toggleExp(exp: string) {
    setExperience(prev =>
      prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
    )
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError('Informe o nome completo.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const created = await api.createModel({
        name: form.name,
        artisticName: form.artisticName || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        heightCm: num(form.heightCm),
        bust: num(form.bust),
        waist: num(form.waist),
        hips: num(form.hips),
        shoe: num(form.shoe),
        eyeColor: form.eyeColor || undefined,
        hairColor: form.hairColor || undefined,
        instagram: form.instagram || undefined,
        photoUrl: photoUrl ?? undefined,
      })
      // Envia o book (galeria) em lote, na ordem dos slots preenchidos.
      const bookPhotos = bookUrls.filter((u): u is string => !!u)
      if (bookPhotos.length) await api.addModelPhotos(created.id, bookPhotos)
      router.push('/dashboard/models')
    } catch {
      setError('Não foi possível cadastrar o modelo. Verifique se o backend está rodando.')
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/models"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-light">Cadastrar Modelo</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Preencha as informações do novo talento</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Foto + Dados Principais */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Informações Pessoais</h2>
          <div className="flex gap-6">
            {/* Upload Foto */}
            <div className="flex-shrink-0 relative w-32 h-40">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors group overflow-hidden relative"
              >
                {photoUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl} alt="Foto principal" className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-foreground">Trocar foto</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground text-center leading-tight">Foto<br />principal</span>
                  </>
                )}
              </button>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  aria-label="Remover foto"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Nome completo</label>
                <input value={form.name} onChange={set('name')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Nome civil" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Nome artístico</label>
                <input value={form.artisticName} onChange={set('artisticName')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Nome para o book" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">E-mail</label>
                <input type="email" className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Telefone / WhatsApp</label>
                <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="(00) 90000-0000" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Cidade</label>
                <input value={form.city} onChange={set('city')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="São Paulo" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">Estado</label>
                <select value={form.state} onChange={set('state')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors text-foreground">
                  <option value="">Selecione</option>
                  {['SP','RJ','MG','RS','PR','SC','BA','PE','CE','GO','DF'].map(uf => (
                    <option key={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Medidas */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Medidas & Aparência</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {([
              { label: 'Altura (cm)', placeholder: '176', field: 'heightCm' },
              { label: 'Peso (kg)', placeholder: '57' },
              { label: 'Busto (cm)', placeholder: '86', field: 'bust' },
              { label: 'Cintura (cm)', placeholder: '61', field: 'waist' },
              { label: 'Quadril (cm)', placeholder: '89', field: 'hips' },
              { label: 'Manequim', placeholder: '38' },
              { label: 'Calçado', placeholder: '37', field: 'shoe' },
            ] as { label: string; placeholder: string; field?: keyof FormState }[]).map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground tracking-wider uppercase">{f.label}</label>
                <input
                  value={f.field ? form[f.field] : undefined}
                  onChange={f.field ? set(f.field) : undefined}
                  className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Olhos</label>
              <select value={form.eyeColor} onChange={set('eyeColor')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors text-foreground">
                <option>Castanho</option>
                <option>Verde</option>
                <option>Azul</option>
                <option>Mel</option>
                <option>Cinza</option>
                <option>Preto</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Cor do cabelo</label>
              <input value={form.hairColor} onChange={set('hairColor')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="Ex: Castanho escuro" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Tom de pele</label>
              <select className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors text-foreground">
                <option>Clara</option>
                <option>Morena clara</option>
                <option>Morena</option>
                <option>Morena escura</option>
                <option>Negra</option>
              </select>
            </div>
          </div>
        </div>

        {/* Experiência & Redes */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Experiência & Redes Sociais</h2>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-2">Área de experiência</label>
            <div className="flex flex-wrap gap-2">
              {experienceOptions.map(exp => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => toggleExp(exp)}
                  className={`px-3 py-1.5 rounded-sm text-xs border transition-all ${
                    experience.includes(exp)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Instagram</label>
              <input value={form.instagram} onChange={set('instagram')} className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="@usuario" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">TikTok</label>
              <input className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="@usuario" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wider uppercase">Comissão da agência (%)</label>
              <input type="number" className="mt-1 w-full bg-muted/40 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors" placeholder="20" min="0" max="50" />
            </div>
          </div>
        </div>

        {/* Fotos do Book */}
        <div className="glass rounded-sm p-6">
          <h2 className="font-heading text-xl font-light mb-5">Fotos do Book</h2>
          <input
            ref={bookInputRef}
            type="file"
            accept="image/*"
            onChange={handleBookChange}
            className="hidden"
          />
          <div className="grid grid-cols-4 gap-3">
            {bookUrls.map((url, i) => (
              <div key={i} className="relative aspect-[3/4]">
                <button
                  type="button"
                  onClick={() => openBookPicker(i)}
                  className="w-full h-full border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors group overflow-hidden relative"
                >
                  {url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Foto do book ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-foreground">Trocar foto</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs text-muted-foreground">Adicionar foto</span>
                    </>
                  )}
                </button>
                {url && (
                  <button
                    type="button"
                    onClick={() => setBookUrls(prev => prev.map((u, j) => (j === i ? null : u)))}
                    aria-label="Remover foto"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        {error && <p className="text-sm text-red-400 text-right">{error}</p>}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/models"
            className="px-6 py-2.5 rounded-sm border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all tracking-wide disabled:opacity-60"
          >
            {saving ? 'Cadastrando…' : 'Cadastrar Modelo'}
          </button>
        </div>
      </div>
    </div>
  )
}
