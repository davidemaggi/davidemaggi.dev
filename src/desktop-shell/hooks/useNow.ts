import { useEffect, useState } from 'react'

/** Current time, refreshed on interval boundaries (e.g. every minute on the minute). */
export function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        setNow(new Date())
        schedule()
      }, intervalMs - (Date.now() % intervalMs) + 20)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [intervalMs])

  return now
}
