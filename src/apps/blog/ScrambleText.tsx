import { useEffect, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=<>?/~{}[]$@!'

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

type ScrambleTextProps = {
  text: string
  /** Changing this value replays the effect. */
  playKey: number
  duration?: number
  className?: string
}

/**
 * Infinite-monkey typing: every character cycles through random glyphs and
 * settles on the right one at its own moment. Screen readers get the plain text.
 */
export function ScrambleText({ text, playKey, duration = 650, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (playKey === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const start = performance.now()
    const lockAt = [...text].map((_, index) => (index / text.length) * duration * 0.7 + Math.random() * duration * 0.3)
    let frame = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const next = [...text].map((char, index) => (char === ' ' || elapsed >= lockAt[index] ? char : randomGlyph())).join('')
      setDisplay(next)
      if (elapsed < duration) frame = window.requestAnimationFrame(tick)
      else setDisplay(text)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [duration, playKey, text])

  return (
    <span className={className}>
      <span aria-hidden="true">{playKey === 0 ? text : display}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
