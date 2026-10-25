import { useEffect, useRef } from 'react'
import type { WallpaperPreset } from '../../desktop/types'
import { resolveAssetPath } from '../../desktop/utils/assetPath'
import { WallpaperCanvas } from './WallpaperCanvas'

type WallpaperProps = {
  preset: WallpaperPreset
  interactive?: boolean
}

export function Wallpaper({ preset, interactive = true }: WallpaperProps) {
  const glowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!interactive) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight * 0.4

    const flush = () => {
      frame = 0
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = window.requestAnimationFrame(flush)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [interactive])

  return (
    <div className="wallpaper" aria-hidden="true">
      {preset === 'hyperspace' || preset === 'matrix' ? <WallpaperCanvas effect={preset} /> : null}
      {preset === 'vortex' ? (
        <div className="wallpaper__vortex">
          <span />
          <span />
          <span />
        </div>
      ) : null}
      <div className="wallpaper__blob wallpaper__blob--1" />
      <div className="wallpaper__blob wallpaper__blob--2" />
      <div className="wallpaper__blob wallpaper__blob--3" />
      <div className="wallpaper__blob wallpaper__blob--4" />
      <div className="wallpaper__stars wallpaper__stars--far" />
      <div className="wallpaper__stars" />
      <div className="wallpaper__grid" />
      {interactive ? <div ref={glowRef} className="wallpaper__glow" /> : null}
      {preset === 'darkside' ? <div className="wallpaper__saber" /> : null}
      {preset === 'stardestroyer' ? (
        <div className="wallpaper__fleet">
          <div className="wallpaper__fleet-planet" />
          <div className="wallpaper__fleet-ship wallpaper__fleet-ship--escort">
            <img src={resolveAssetPath('/easter/star-destroyer.svg')} alt="" />
          </div>
          <div className="wallpaper__fleet-ship">
            <span className="wallpaper__fleet-engines" />
            <img src={resolveAssetPath('/easter/star-destroyer.svg')} alt="" />
          </div>
        </div>
      ) : null}
      <div className="wallpaper__vignette" />
      <div className="wallpaper__grain" />
    </div>
  )
}
