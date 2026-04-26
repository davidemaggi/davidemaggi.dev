import { useMemo, useState } from 'react'
import { DESKTOP_PLUGINS } from '../desktop/plugins'
import type { AppId, DesktopAppProps } from '../desktop/types'
import { resolveAssetPath } from '../desktop/utils/assetPath'
import { renderAppIcon, resolveAppIcon } from '../desktop-shell/utils/icons'

type CatalogApp = {
  id: AppId | 'gradius'
  title: string
  description: string
  iconSrc?: string
}

const DESCRIPTIONS = {
  it: {
    terminal: 'Console comandi per aprire app, cambiare tema e navigare i contenuti.',
    about: 'Profilo personale in formato editor con contenuti e timeline.',
    help: 'Store applicazioni con catalogo disponibile su DaveOS.',
    settings: 'Impostazioni di sistema: tema, lingua, orologio e wallpaper.',
    calendar: 'Timeline esperienze lavorative con filtri e vista temporale.',
    certManager: 'Gestione certificati e competenze con dettaglio metadati.',
    arkanoid: 'GitOut: parodia di Breakout in versione SVG animata, visualizzata a piena finestra.',
    easterEgg: 'Contenuto segreto sbloccabile con combinazione speciale.',
    gradius: 'Konami 1986. Arcade shooter orizzontale classico. Non installato.',
  },
  en: {
    terminal: 'Command console to open apps, change theme and browse content.',
    about: 'Personal profile in editor-style layout with rich content and timeline.',
    help: 'App marketplace showing the DaveOS catalog.',
    settings: 'System settings: theme, language, clock and wallpaper.',
    calendar: 'Work experience timeline with filters and time views.',
    certManager: 'Certificates and skills manager with detailed metadata.',
    arkanoid: 'GitOut: a Breakout parody rendered as an animated SVG in fullscreen style.',
    easterEgg: 'Secret unlockable content triggered by a special combo.',
    gradius: 'Konami 1986. Classic horizontal arcade shooter. Not installed.',
  },
} as const

export function AppStoreApp({ desktopApi, i18nApi, preferencesApi }: DesktopAppProps) {
  const locale = i18nApi?.locale === 'en' ? 'en' : 'it'
  const [status, setStatus] = useState<string | null>(null)

  const installedApps = useMemo(() => desktopApi?.listApps() ?? [], [desktopApi])
  const installedSet = useMemo(() => new Set(installedApps.map((app) => app.id)), [installedApps])

  const catalog = useMemo<CatalogApp[]>(() => {
    const discoverable = Object.values(DESKTOP_PLUGINS)
      .filter((plugin) => !plugin.hidden)
      .map((plugin) => ({
        id: plugin.id,
        title: i18nApi?.t(plugin.titleKey) ?? plugin.id,
        description: DESCRIPTIONS[locale][plugin.id],
      }))

    return [
      ...discoverable,
      {
        id: 'gradius',
        title: 'Gradius',
        description: DESCRIPTIONS[locale].gradius,
        iconSrc: '/icons/gradius.svg',
      },
    ]
  }, [i18nApi, locale])

  if (!i18nApi || !preferencesApi || !desktopApi) {
    return <div className="p-5 text-left text-(--window-text)">App Store APIs unavailable.</div>
  }

  return (
    <div className="h-full overflow-auto bg-(--app-surface-1) p-4 text-(--window-text)">
      <header className="mb-4">
        <h1 className="m-0 text-xl font-semibold">{i18nApi.t('appStore.heading')}</h1>
        <p className="m-0 mt-1 text-sm text-(--app-muted)">{i18nApi.t('appStore.subheading')}</p>
      </header>

      {status ? (
        <p className="mb-3 rounded-lg border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm">{status}</p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {catalog.map((item) => {
          const isInstalled = item.id !== 'gradius' && installedSet.has(item.id)

          return (
            <article key={item.id} className="rounded-xl border border-(--app-border) bg-(--app-surface-2) p-3">
              <div className="mb-2 flex items-start gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-(--app-surface-1)">
                  {item.id === 'gradius' || item.iconSrc
                    ? <img src={resolveAssetPath(item.iconSrc ?? '/icons/gradius.svg')} alt={`${item.title} icon`} className="h-10 w-10 object-contain" />
                    : renderAppIcon(resolveAppIcon(item.id, preferencesApi.preferences), 'h-10 w-10 object-contain')}
                </span>
                <div className="min-w-0">
                  <strong className="block leading-tight">{item.title}</strong>
                  <p className="m-0 mt-1 text-sm text-(--app-muted)">{item.description}</p>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                {isInstalled ? (
                  <span className="rounded-full border border-(--app-border) px-2 py-1 text-xs text-(--app-muted)">
                    {i18nApi.t('appStore.installed')}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg border border-(--app-border) bg-(--app-surface-1) px-3 py-1.5 text-xs"
                    onClick={() => setStatus(i18nApi.t('appStore.installUnavailable', { title: item.title }))}
                  >
                    {i18nApi.t('appStore.install')}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
