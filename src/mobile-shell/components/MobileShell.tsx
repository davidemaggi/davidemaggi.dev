import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type {
  AppId,
  AppIcon,
  DesktopCommandApi,
  DesktopI18nApi,
  DesktopLaunchIntent,
  Locale,
  DesktopPlugin,
  DesktopPreferences,
  DesktopPreferencesApi,
  WindowState,
} from '../../desktop/types'
import { renderAppIcon, resolveAppIcon } from '../../desktop-shell/utils/icons'

type MobileShellProps = {
  now: Date
  t: (key: string, vars?: Record<string, string>) => string
  windows: Record<AppId, WindowState>
  discoverablePlugins: DesktopPlugin[]
  preferences: DesktopPreferences
  desktopApi: DesktopCommandApi
  i18nApi: DesktopI18nApi
  preferencesApi: DesktopPreferencesApi
  launchIntent: DesktopLaunchIntent | null
  onOpenApp: (id: AppId) => void
  onCloseApp: (id: AppId) => void
  onMinimizeApp: (id: AppId) => void
}

const formatMobileTime = (now: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now)
}

const formatMobileDate = (now: Date, locale: Locale) => {
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now)
}

const EDGE_SWIPE_START = 28
const SWIPE_CLOSE_THRESHOLD = 90
const SWIPE_SWITCH_THRESHOLD = 72

const MOBILE_ICON_OVERRIDES: Record<AppId, AppIcon> = {
  terminal: { kind: 'image', src: '/icons/terminal.svg', alt: 'Terminal icon' },
  about: { kind: 'image', src: '/icons/about.svg', alt: 'About icon' },
  help: { kind: 'image', src: '/icons/app-store.svg', alt: 'App Store icon' },
  settings: { kind: 'image', src: '/icons/gear.svg', alt: 'Settings icon' },
  calendar: { kind: 'image', src: '/icons/calendar.svg', alt: 'Calendar icon' },
  certManager: { kind: 'image', src: '/icons/certificate.svg', alt: 'Certificate icon' },
  easterEgg: { kind: 'image', src: '/icons/spark.svg', alt: 'Secret access icon' },
}

export function MobileShell({
  now,
  t,
  windows,
  discoverablePlugins,
  preferences,
  desktopApi,
  i18nApi,
  preferencesApi,
  launchIntent,
  onOpenApp,
  onCloseApp,
  onMinimizeApp,
}: MobileShellProps) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const swipeStartXRef = useRef<number | null>(null)
  const isSwipeActiveRef = useRef(false)
  const headerSwipeStartXRef = useRef<number | null>(null)
  const isHeaderSwipeActiveRef = useRef(false)

  const recentApps = useMemo(() => {
    return discoverablePlugins
      .filter((plugin) => windows[plugin.id].isOpen)
      .sort((a, b) => windows[b.id].zIndex - windows[a.id].zIndex)
  }, [discoverablePlugins, windows])

  const foregroundApps = useMemo(() => {
    return recentApps.filter((plugin) => !windows[plugin.id].isMinimized)
  }, [recentApps, windows])

  const activeApp = foregroundApps[0] ?? null

  const resolveMobileIcon = (id: AppId): AppIcon => {
    const forcedIcon = MOBILE_ICON_OVERRIDES[id]
    if (forcedIcon) return forcedIcon

    return resolveAppIcon(id, preferences)
  }

  const resetSwipe = () => {
    swipeStartXRef.current = null
    isSwipeActiveRef.current = false
    setSwipeOffset(0)
  }

  const handleAppPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (!activeApp) return
    if (event.pointerType === 'mouse') return
    if (event.clientX > EDGE_SWIPE_START) return

    swipeStartXRef.current = event.clientX
    isSwipeActiveRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleAppPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isSwipeActiveRef.current || swipeStartXRef.current === null) return
    const delta = Math.max(0, event.clientX - swipeStartXRef.current)
    setSwipeOffset(Math.min(220, delta))
  }

  const handleAppPointerEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isSwipeActiveRef.current || !activeApp) {
      resetSwipe()
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (swipeOffset >= SWIPE_CLOSE_THRESHOLD) {
      handleBackAction()
    }

    resetSwipe()
  }

  const handleHeaderPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (!activeApp) return
    if (event.pointerType === 'mouse') return

    headerSwipeStartXRef.current = event.clientX
    isHeaderSwipeActiveRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleHeaderPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isHeaderSwipeActiveRef.current || headerSwipeStartXRef.current === null) return
    const delta = event.clientX - headerSwipeStartXRef.current
    setSwipeOffset(Math.max(-180, Math.min(180, delta)))
  }

  const handleHeaderPointerEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isHeaderSwipeActiveRef.current || headerSwipeStartXRef.current === null || !activeApp) {
      isHeaderSwipeActiveRef.current = false
      headerSwipeStartXRef.current = null
      setSwipeOffset(0)
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const delta = swipeOffset
    const activeIndex = foregroundApps.findIndex((plugin) => plugin.id === activeApp.id)

    if (Math.abs(delta) >= SWIPE_SWITCH_THRESHOLD && activeIndex >= 0) {
      if (delta < 0 && activeIndex < foregroundApps.length - 1) {
        onOpenApp(foregroundApps[activeIndex + 1].id)
      } else if (delta > 0 && activeIndex > 0) {
        onOpenApp(foregroundApps[activeIndex - 1].id)
      }
    }

    isHeaderSwipeActiveRef.current = false
    headerSwipeStartXRef.current = null
    setSwipeOffset(0)
  }

  const handleBackAction = () => {
    if (isSwitcherOpen) {
      setIsSwitcherOpen(false)
      return
    }

    if (!activeApp) return

    const activeIndex = foregroundApps.findIndex((plugin) => plugin.id === activeApp.id)
    const previousApp = activeIndex >= 0 ? foregroundApps[activeIndex + 1] : null

    if (previousApp) {
      onOpenApp(previousApp.id)
      return
    }

    onCloseApp(activeApp.id)
  }

  return (
    <div className="mobile-safe-root relative flex h-dvh min-h-dvh flex-col overflow-hidden text-(--window-text)">
      <header className="mobile-safe-header mobile-status-bar flex items-center justify-between px-5 py-2 text-xs text-(--desktop-icon-color)">
        <span className="font-semibold">{formatMobileTime(now)}</span>
        <span className="inline-flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-current/80" />
          <span className="h-2 w-2 rounded-full bg-current/65" />
          <span className="h-2 w-2 rounded-full bg-current/50" />
        </span>
      </header>

      <section className="mobile-safe-content px-4">
        <div className="mb-5 px-1 text-(--desktop-icon-color)">
          <p className="m-0 text-sm capitalize opacity-85">{formatMobileDate(now, i18nApi.locale)}</p>
          <h1 className="m-0 text-[1.7rem] leading-tight font-semibold">{formatMobileTime(now)}</h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {discoverablePlugins.map((plugin) => (
            <button
              key={plugin.id}
              className="mobile-home-app flex flex-col items-center gap-1.5 rounded-2xl p-1.5 text-(--desktop-icon-color)"
              onClick={() => onOpenApp(plugin.id)}
            >
              <span className="mobile-home-app__icon grid h-12 w-12 place-items-center rounded-[1rem]">
                {renderAppIcon(resolveMobileIcon(plugin.id), 'h-8.5 w-8.5 object-contain')}
              </span>
              <span className="max-w-full truncate text-[11px] leading-tight">{t(plugin.titleKey)}</span>
            </button>
          ))}
        </div>
      </section>

      <footer
        className="mobile-safe-dock mobile-home-dock absolute flex items-center gap-2 rounded-3xl px-3 py-2"
        aria-label={t('mobile.dock.label')}
      >
        {discoverablePlugins.slice(0, 5).map((plugin) => (
          <button
            key={plugin.id}
            className={`mobile-home-dock__app grid h-10 w-10 place-items-center rounded-xl ${windows[plugin.id].isOpen ? 'mobile-home-dock__app--active' : ''}`}
            onClick={() => onOpenApp(plugin.id)}
            aria-label={t(plugin.titleKey)}
          >
            {renderAppIcon(resolveMobileIcon(plugin.id), 'h-6 w-6 object-contain')}
          </button>
        ))}
        <button
          type="button"
          className="mobile-home-dock__switcher ml-auto rounded-lg border border-white/20 bg-white/10 px-2.5 py-2 text-xs text-(--desktop-icon-color)"
          onClick={() => setIsSwitcherOpen((prev) => !prev)}
          aria-label={t('mobile.action.switcher')}
        >
          {t('mobile.action.switcher')}
        </button>
      </footer>

      {isSwitcherOpen ? (
        <section className="mobile-safe-overlay fixed inset-0 z-40 flex flex-col bg-black/60 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">{t('mobile.switcher.title')}</h2>
            <button
              type="button"
              className="rounded-md border border-white/25 bg-white/10 px-2 py-1 text-xs text-white"
              onClick={() => setIsSwitcherOpen(false)}
            >
              {t('mobile.action.home')}
            </button>
          </div>
          <div className="mobile-switcher-track flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">
            {recentApps.length ? (
              recentApps.map((plugin) => (
                <article
                  key={`switcher-${plugin.id}`}
                  className="min-w-[82%] snap-center rounded-xl border border-white/15 bg-black/35 p-3 text-white"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onOpenApp(plugin.id)
                    setIsSwitcherOpen(false)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onOpenApp(plugin.id)
                      setIsSwitcherOpen(false)
                    }
                  }}
                >
                  <div
                    className="mobile-switcher-preview relative mb-2.5"
                    onClick={() => {
                      onOpenApp(plugin.id)
                      setIsSwitcherOpen(false)
                    }}
                  >
                    <span className="pointer-events-none absolute top-2 right-2 z-10 rounded-md border border-white/30 bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                      {t('mobile.switcher.preview')}
                    </span>
                    <div className="mobile-switcher-preview-scale">
                      <plugin.Component
                        desktopApi={desktopApi}
                        i18nApi={i18nApi}
                        preferencesApi={preferencesApi}
                        launchIntent={{ appId: plugin.id, query: 'preview', token: 0 }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mb-2 inline-flex w-full items-center gap-2 text-left"
                    onClick={() => {
                      onOpenApp(plugin.id)
                      setIsSwitcherOpen(false)
                    }}
                  >
                    {renderAppIcon(resolveMobileIcon(plugin.id), 'h-5 w-5 object-contain')}
                    <span className="text-sm font-semibold">{t(plugin.titleKey)}</span>
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs"
                    onClick={(event) => {
                      event.stopPropagation()
                      onCloseApp(plugin.id)
                    }}
                  >
                    {t('window.action.close', { title: t(plugin.titleKey) })}
                  </button>
                </article>
              ))
            ) : (
              <p className="text-sm text-white/80">{t('mobile.switcher.empty')}</p>
            )}
          </div>
          {recentApps.length > 1 ? (
            <div className="mb-20 mt-1 inline-flex items-center justify-center gap-1.5">
              {recentApps.map((plugin) => (
                <span
                  key={`switcher-dot-${plugin.id}`}
                  className={`h-1.5 w-1.5 rounded-full ${plugin.id === activeApp?.id ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {activeApp ? (
        <section
          className="mobile-app-frame fixed inset-0 z-30 flex flex-col bg-(--window-bg)"
          style={{ transform: `translateX(${swipeOffset}px)` }}
          onPointerDown={handleAppPointerDown}
          onPointerMove={handleAppPointerMove}
          onPointerUp={handleAppPointerEnd}
          onPointerCancel={handleAppPointerEnd}
        >
          <header
            className="mobile-safe-app-header mobile-app-header flex items-center justify-between px-3 py-2"
            onPointerDown={handleHeaderPointerDown}
            onPointerMove={handleHeaderPointerMove}
            onPointerUp={handleHeaderPointerEnd}
            onPointerCancel={handleHeaderPointerEnd}
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-(--window-text)">
              {renderAppIcon(resolveMobileIcon(activeApp.id), 'h-4.5 w-4.5 object-contain')}
              {t(activeApp.titleKey)}
            </p>
            <button
              type="button"
              className="mobile-app-header__switcher rounded-full px-2 py-1 text-[11px]"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setIsSwitcherOpen(true)}
            >
              {t('mobile.action.switcher')}
            </button>
          </header>
          <div className="mobile-app-content min-h-0 flex-1 overflow-auto">
            <activeApp.Component
              desktopApi={desktopApi}
              i18nApi={i18nApi}
              preferencesApi={preferencesApi}
              launchIntent={launchIntent}
            />
          </div>
          <nav className="mobile-nav" aria-label={t('mobile.nav.label')}>
            <button
              type="button"
              className="mobile-nav-btn"
              onClick={handleBackAction}
              aria-label={t('mobile.action.back')}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M15.5 4.5 8 12l7.5 7.5-1.4 1.4L5.2 12l8.9-8.9z" />
              </svg>
            </button>
            <button
              type="button"
              className="mobile-nav-btn mobile-nav-btn--home"
              onClick={() => onMinimizeApp(activeApp.id)}
              aria-label={t('mobile.action.home')}
            />
            <button
              type="button"
              className="mobile-nav-btn"
              onClick={() => setIsSwitcherOpen(true)}
              aria-label={t('mobile.action.switcher')}
            >
              <span className="mobile-nav-recents mobile-nav-recents--ios" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            </button>
          </nav>
        </section>
      ) : null}
    </div>
  )
}







