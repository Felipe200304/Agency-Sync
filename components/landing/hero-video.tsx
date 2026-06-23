'use client'

import { useEffect, useRef } from 'react'

/** Velocidade de reprodução do vídeo de fundo (1 = normal; menor = mais lento/cinematográfico). */
const PLAYBACK_RATE = 0.75
/** Zoom no rosto da modelo (1 = sem zoom). Ajuste para aproximar/afastar. */
const FACE_ZOOM = 1.1
/** Ponto do quadro onde está o rosto (x% y%) — usado como foco do zoom. */
const FACE_FOCUS = '50% 35%'

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.playbackRate = PLAYBACK_RATE
    // Garante que a taxa seja reaplicada caso o vídeo recarregue/reinicie.
    const apply = () => {
      video.playbackRate = PLAYBACK_RATE
    }
    video.addEventListener('loadedmetadata', apply)
    video.addEventListener('play', apply)
    return () => {
      video.removeEventListener('loadedmetadata', apply)
      video.removeEventListener('play', apply)
    }
  }, [])

  return (
    <video
      ref={ref}
      className="w-full h-full object-cover"
      style={{
        objectPosition: FACE_FOCUS,
        transform: `scale(${FACE_ZOOM})`,
        transformOrigin: FACE_FOCUS,
      }}
      src="/hero-model.mp4"
      poster="https://images.pexels.com/videos/6782218/free-video-6782218.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  )
}
