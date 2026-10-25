import { useEffect, useRef } from 'react'

export type CanvasEffect = 'hyperspace' | 'matrix'

type Star = { x: number; y: number; z: number; pz: number }

const MATRIX_GLYPHS = 'アカサタナハマヤラワ0123456789ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ:・."=*+-<>¦'

/**
 * Procedural animated wallpapers. Rendering pauses while the tab is hidden and
 * collapses to a single static frame when the user prefers reduced motion.
 */
export function WallpaperCanvas({ effect }: { effect: CanvasEffect }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let frame = 0
    let stars: Star[] = []
    let drops: number[] = []
    const fontSize = 16

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (effect === 'hyperspace') {
        const count = Math.round((width * height) / 2600)
        stars = Array.from({ length: count }, () => {
          const z = Math.random() * width
          return { x: (Math.random() - 0.5) * width * 2, y: (Math.random() - 0.5) * height * 2, z, pz: z }
        })
        context.fillStyle = '#02030a'
        context.fillRect(0, 0, width, height)
      } else {
        drops = Array.from({ length: Math.ceil(width / fontSize) }, () => Math.random() * -height / fontSize)
        context.fillStyle = '#010702'
        context.fillRect(0, 0, width, height)
      }
    }

    const drawHyperspace = (speed: number) => {
      context.fillStyle = 'rgba(2, 3, 10, 0.32)'
      context.fillRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2

      for (const star of stars) {
        star.pz = star.z
        star.z -= speed
        if (star.z < 1) {
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
          star.z = width
          star.pz = width
        }

        const sx = (star.x / star.z) * cx + cx
        const sy = (star.y / star.z) * cy + cy
        const px = (star.x / star.pz) * cx + cx
        const py = (star.y / star.pz) * cy + cy
        const depth = 1 - star.z / width

        context.strokeStyle = `rgba(${180 + depth * 75}, ${210 + depth * 45}, 255, ${0.25 + depth * 0.75})`
        context.lineWidth = 0.4 + depth * 2
        context.beginPath()
        context.moveTo(px, py)
        context.lineTo(sx, sy)
        context.stroke()
      }
    }

    const drawMatrix = () => {
      context.fillStyle = 'rgba(1, 7, 2, 0.09)'
      context.fillRect(0, 0, width, height)
      context.font = `${fontSize}px 'JetBrains Mono', monospace`

      drops.forEach((drop, column) => {
        const glyph = MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)]
        const x = column * fontSize
        const y = drop * fontSize
        context.fillStyle = Math.random() > 0.975 ? '#d9ffe4' : '#22c55e'
        context.fillText(glyph, x, y)
        drops[column] = y > height && Math.random() > 0.975 ? 0 : drop + 0.5
      })
    }

    const draw = () => {
      if (effect === 'hyperspace') drawHyperspace(reducedMotion ? 0 : 6)
      else drawMatrix()
    }

    const loop = () => {
      draw()
      frame = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (frame || reducedMotion) return
      frame = window.requestAnimationFrame(loop)
    }

    const stop = () => {
      if (!frame) return
      window.cancelAnimationFrame(frame)
      frame = 0
    }

    const onVisibilityChange = () => (document.hidden ? stop() : start())

    resize()
    if (reducedMotion) {
      // Paint enough frames to produce a meaningful still image.
      for (let index = 0; index < 120; index += 1) draw()
    }
    start()

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [effect])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
