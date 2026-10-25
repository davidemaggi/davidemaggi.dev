import { useEffect, useRef } from 'react'

const KONAMI_CODE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'] as const

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || target.closest('[data-konami-ignore]')) return true
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'
}

/** Listens for ↑↑↓↓←→←→BA anywhere on the desktop, except while typing or playing. */
export function useKonamiUnlock(onUnlock: () => void) {
  const indexRef = useRef(0)
  const onUnlockRef = useRef(onUnlock)

  useEffect(() => {
    onUnlockRef.current = onUnlock
  }, [onUnlock])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      const key = event.key.toLowerCase()

      if (key === KONAMI_CODE[indexRef.current]) {
        indexRef.current += 1
        if (indexRef.current === KONAMI_CODE.length) {
          indexRef.current = 0
          onUnlockRef.current()
        }
        return
      }

      indexRef.current = key === KONAMI_CODE[0] ? 1 : 0
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
