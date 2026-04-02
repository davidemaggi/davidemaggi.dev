import type { DesktopAppProps } from '../desktop/types'

export function EasterEggApp({ i18nApi }: DesktopAppProps) {
  const t = i18nApi?.t ?? ((key: string) => key)

  return (
    <div className="p-6 text-left text-(--window-text)">
      <h1 className="mb-2.5 text-2xl font-semibold">{t('easter.heading')}</h1>
      <p className="text-(--app-muted)">{t('easter.body')}</p>
    </div>
  )
}
