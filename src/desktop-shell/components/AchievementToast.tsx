import { useEffect } from 'react'
import { Icon } from './Icon'

type AchievementToastProps = {
  title: string
  body: string
  onDismiss: () => void
}

export function AchievementToast({ title, body, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 7000)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="achievement" role="status" aria-live="polite">
      <span className="achievement__badge" aria-hidden="true">
        <Icon name="star" className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10.5px] tracking-[0.12em] text-(--app-muted) uppercase">{title}</span>
        <span className="block text-sm font-medium">{body}</span>
      </span>
      <button type="button" className="profile-copy-btn" onClick={onDismiss} aria-label="Dismiss">
        <Icon name="x" className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
