'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { api, type ApiModelPhoto } from '@/lib/api'

/** Galeria (book) do modelo com remoção persistida via API. */
export function ModelGallery({ modelId, initial }: { modelId: string; initial: ApiModelPhoto[] }) {
  const [photos, setPhotos] = useState(initial)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (photos.length === 0) return null

  async function remove(photoId: string) {
    setRemoving(photoId)
    setError(null)
    try {
      await api.deleteModelPhoto(modelId, photoId)
      setPhotos(prev => prev.filter(p => p.id !== photoId))
    } catch {
      setError('Não foi possível remover a foto.')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {photos.map(photo => (
          <div key={photo.id} className="relative aspect-[3/4] rounded-sm overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(photo.id)}
              disabled={removing === photo.id}
              aria-label="Remover foto"
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:border-destructive/50 transition-all disabled:opacity-60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
