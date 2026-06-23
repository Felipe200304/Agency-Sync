'use client'

import { useEffect, useRef } from 'react'

/** Velocidade de reprodução do vídeo de fundo (0.5 = metade da velocidade). */
const PLAYBACK_RATE = 0.5

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
      className="w-full h-full object-cover object-[center_28%]"
      src="/runway.mp4"
      poster="https://images.pexels.com/videos/3894693/pexels-photo-3894693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  )
}
