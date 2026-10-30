import { useEffect, useRef, useState } from 'react'
import { ScrambleText } from './ScrambleText'

type MonkeyIntroProps = {
  title: string
  tagline: string
  caption: string
  onDone: () => void
}

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz{}[]();=<>/*+-&|!?#$%~^0123456789'
const INTRO_MS = 3600

/**
 * The Infinite Monkey Theorem, played out: a wall of random keystrokes that
 * thins out while the blog's name gets typed into place.
 */
export function MonkeyIntro({ title, tagline, caption, onDone }: MonkeyIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const fontSize = 14
    const cellW = fontSize * 0.62
    const cellH = fontSize * 1.35
    const cols = Math.ceil(width / cellW)
    const rows = Math.ceil(height / cellH)
    const cells = Array.from({ length: cols * rows }, () => ({
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      heat: Math.random(),
    }))
    const color = getComputedStyle(canvas).getPropertyValue('--mp-accent').trim() || '#f2c14e'
    const start = performance.now()
    let frame = 0

    const draw = (now: number) => {
      const t = (now - start) / INTRO_MS
      // Keystrokes are frantic at first, then the monkeys calm down and the noise fades away.
      const typingRate = Math.max(0.02, 0.22 * (1 - t))
      const fade = Math.max(0, 1 - Math.max(0, t - 0.35) / 0.55)

      ctx.clearRect(0, 0, width, height)
      ctx.font = `${fontSize}px 'JetBrains Mono', ui-monospace, monospace`
      ctx.fillStyle = color

      for (let index = 0; index < cells.length; index += 1) {
        const cell = cells[index]
        if (Math.random() < typingRate) {
          cell.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          cell.heat = 1
        } else {
          cell.heat *= 0.94
        }
        const alpha = (0.08 + cell.heat * 0.55) * fade
        if (alpha < 0.02) continue
        ctx.globalAlpha = alpha
        ctx.fillText(cell.glyph, (index % cols) * cellW, Math.floor(index / cols) * cellH + fontSize)
      }
      ctx.globalAlpha = 1

      if (t < 1) frame = window.requestAnimationFrame(draw)
    }

    frame = window.requestAnimationFrame(draw)
    const leave = window.setTimeout(() => setIsLeaving(true), INTRO_MS)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(leave)
    }
  }, [])

  useEffect(() => {
    if (!isLeaving) return
    const timer = window.setTimeout(onDone, 450)
    return () => window.clearTimeout(timer)
  }, [isLeaving, onDone])

  return (
    <button
      type="button"
      className={`mp-intro ${isLeaving ? 'mp-intro--leaving' : ''}`}
      onClick={() => setIsLeaving(true)}
      aria-label={title}
    >
      <canvas ref={canvasRef} className="mp-intro__noise" aria-hidden="true" />
      <span className="mp-intro__center">
        <ScrambleText text={title} playKey={1} duration={2600} className="mp-intro__title" />
        <ScrambleText text={tagline} playKey={1} duration={3000} className="mp-intro__tagline" />
        <span className="mp-intro__caption">{caption}</span>
      </span>
    </button>
  )
}
