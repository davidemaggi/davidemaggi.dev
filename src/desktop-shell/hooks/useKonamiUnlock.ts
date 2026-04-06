import { useEffect, useState } from 'react'

const KONAMI_CODE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
] as const

export function useKonamiUnlock(onUnlock: () => void) {
  const [isArmed, setIsArmed] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!isArmed) return

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const expected = KONAMI_CODE[index]

      if (key === expected) {
        const nextIndex = index + 1
        if (nextIndex === KONAMI_CODE.length) {
          onUnlock()
          setIsArmed(false)
          setIndex(0)
          return
        }

        setIndex(nextIndex)
        return
      }

      setIndex(key === KONAMI_CODE[0] ? 1 : 0)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [index, isArmed, onUnlock])

  return {
    arm: () => {
      setIsArmed(true)
      setIndex(0)
    },
    reset: () => {
      setIsArmed(false)
      setIndex(0)
    },
  }
}

