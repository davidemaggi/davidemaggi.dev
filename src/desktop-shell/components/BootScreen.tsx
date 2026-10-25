import { useEffect, useState } from 'react'
import { DaveOsLogo } from './DaveOsLogo'

import { BOOT_SESSION_KEY } from '../utils/boot'

const BOOT_LINES = [
  'Mounting /dev/coffee',
  'Loading hyperdrive modules',
  'Calibrating the Force',
  'Replaying decades of git history',
  'Arming Konami listener (↑↑↓↓←→←→BA)',
  'Starting DaveOS window server',
]
const BOOT_DURATION_MS = 1700
const LEAVE_DURATION_MS = 500

type BootScreenProps = {
  onDone: () => void
  skipHint: string
}

export function BootScreen({ onDone, skipHint }: BootScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    window.sessionStorage.setItem(BOOT_SESSION_KEY, '1')
    const startedAt = performance.now()
    const interval = window.setInterval(() => {
      const next = Math.min(100, ((performance.now() - startedAt) / BOOT_DURATION_MS) * 100)
      setProgress(next)
      if (next >= 100) {
        window.clearInterval(interval)
        setIsLeaving(true)
      }
    }, 60)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isLeaving) return
    const skip = () => setIsLeaving(true)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [isLeaving])

  useEffect(() => {
    if (!isLeaving) return
    const timer = window.setTimeout(onDone, LEAVE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [isLeaving, onDone])

  const visibleLines = Math.ceil((progress / 100) * BOOT_LINES.length)

  return (
    <div className={`boot ${isLeaving ? 'boot--leaving' : ''}`} role="status" aria-label="DaveOS is booting">
      <div className="flex flex-col items-center gap-7">
        <DaveOsLogo className="boot__logo" />
        <div className="boot__bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="boot__log w-[300px]" aria-hidden="true">
          {BOOT_LINES.slice(0, visibleLines).map((line) => (
            <div key={line}>
              <b>[ OK ]</b> {line}
            </div>
          ))}
        </div>
        <p className="m-0 text-[11px] text-[#5d6480]">{skipHint}</p>
      </div>
    </div>
  )
}
