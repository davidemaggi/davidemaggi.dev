import { useEffect, useState } from 'react'

const PHONE_MAX_WIDTH = 767

export const useIsPhone = () => {
  const getMatch = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`).matches
  }

  const [isPhone, setIsPhone] = useState(getMatch)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(`(max-width: ${PHONE_MAX_WIDTH}px)`)
    const onChange = (event: MediaQueryListEvent) => {
      setIsPhone(event.matches)
    }

    mediaQuery.addEventListener('change', onChange)

    return () => {
      mediaQuery.removeEventListener('change', onChange)
    }
  }, [])

  return isPhone
}


