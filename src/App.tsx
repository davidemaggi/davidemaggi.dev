import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import { APP_ICON_CHOICES } from './desktop/appIcons'
import { AVAILABLE_LOCALES, createTranslator } from './desktop/i18n'
import { DESKTOP_PLUGINS } from './desktop/plugins'
import type {
  AppId,
  DesktopCommandApi,
  DesktopI18nApi,
  DesktopLaunchIntent,
  DesktopPreferences,
  DesktopPreferencesApi,
  Locale,
} from './desktop/types'
import { BootScreen } from './desktop-shell/components/BootScreen'
import { DesktopHero } from './desktop-shell/components/DesktopHero'
import { AchievementToast } from './desktop-shell/components/AchievementToast'
import { StarWarsCrawl } from './desktop-shell/components/StarWarsCrawl'
import { Taskbar } from './desktop-shell/components/Taskbar'
import { Wallpaper } from './desktop-shell/components/Wallpaper'
import { WindowLayer } from './desktop-shell/components/WindowLayer'
import { useKonamiUnlock } from './desktop-shell/hooks/useKonamiUnlock'
import { useNow } from './desktop-shell/hooks/useNow'
import { useWindowManager } from './desktop-shell/hooks/useWindowManager'
import {
  AVAILABLE_CLOCK_DATE_FORMATS,
  AVAILABLE_CLOCK_HOUR_FORMATS,
  AVAILABLE_DESKTOP_ICON_SIZES,
  AVAILABLE_THEMES,
  AVAILABLE_WALLPAPERS,
  DESKTOP_STATE_KEY,
  LOCALE_STATE_KEY,
  PREFERENCES_STATE_KEY,
  DEFAULT_PREFERENCES,
  loadPersistedDesktopState,
  loadPersistedLocale,
  loadPersistedPreferences,
} from './desktop-shell/utils/persistence'
import { resetBootFlag, shouldShowBoot } from './desktop-shell/utils/boot'
import { EASTER_EGG_EVENT, isStarDestroyerUnlocked, resetEasterEgg, unlockStarDestroyer } from './desktop-shell/utils/easterEgg'
import { isBareIcon, renderAppIcon, resolveAppIcon } from './desktop-shell/utils/icons'
import { MobileShell } from './mobile-shell/components/MobileShell'
import { useIsPhone } from './mobile-shell/hooks/useIsPhone'

const DESKTOP_ICON_SIZE_CLASSES = {
  small: {
    column: 'w-28',
    button: 'w-full gap-1.5 p-1.5',
    tile: 'h-11 w-11 p-2',
    label: 'text-[11px]',
  },
  normal: {
    column: 'w-32',
    button: 'w-full gap-1.5 p-2',
    tile: 'h-13 w-13 p-2.5',
    label: 'text-xs',
  },
  large: {
    column: 'w-36',
    button: 'w-full gap-2 p-2',
    tile: 'h-15 w-15 p-3',
    label: 'text-[13px]',
  },
  xl: {
    column: 'w-44',
    button: 'w-full gap-2 p-2.5',
    tile: 'h-18 w-18 p-3.5',
    label: 'text-sm',
  },
} as const

function App() {
  const isPhone = useIsPhone()
  const initialDesktopState = useMemo(() => loadPersistedDesktopState(), [])
  const {
    windows,
    zCounter,
    isDragging,
    isResizing,
    snapPreviewTarget,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    bringToFront,
    handleHeaderPointerDown,
    handleHeaderPointerMove,
    stopDragging,
    handleResizePointerDown,
    handleResizePointerMove,
    stopResizing,
    toggleHorizontalSnap,
  } = useWindowManager({
    initialWindows: initialDesktopState.windows,
    initialZCounter: initialDesktopState.zCounter,
  })
  const [locale, setLocale] = useState<Locale>(loadPersistedLocale)
  const [preferences, setPreferences] = useState<DesktopPreferences>(loadPersistedPreferences)
  // Every clock on screen shows minutes, so the shell only needs to re-render once a minute.
  const now = useNow(60_000)
  const [launchIntent, setLaunchIntent] = useState<DesktopLaunchIntent | null>(null)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)
  const [isBooting, setIsBooting] = useState(shouldShowBoot)
  const finishBoot = useCallback(() => setIsBooting(false), [])
  const [powerMode, setPowerMode] = useState<
    | 'awake'
    | 'sleepTransition'
    | 'sleeping'
    | 'waking'
    | 'restarting'
    | 'shutdownUpdating'
    | 'shutdownFailed'
    | 'shutdownRebooting'
  >('awake')
  const [shutdownProgress, setShutdownProgress] = useState(0)
  const [isSleepWakeArmed, setIsSleepWakeArmed] = useState(false)
  const [isCrawlOpen, setIsCrawlOpen] = useState(false)
  const [isStarDestroyerAvailable, setIsStarDestroyerAvailable] = useState(isStarDestroyerUnlocked)
  const [showAchievement, setShowAchievement] = useState(false)
  const t = useMemo(() => createTranslator(locale), [locale])

  const discoverablePlugins = useMemo(
    () => Object.values(DESKTOP_PLUGINS).filter((plugin) => !plugin.hidden),
    [],
  )

  const i18nApi = useMemo<DesktopI18nApi>(
    () => ({
      locale,
      locales: AVAILABLE_LOCALES,
      setLocale,
      t,
    }),
    [locale, t],
  )

  // Window state changes on every drag frame: persist it lazily instead of synchronously each time.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(DESKTOP_STATE_KEY, JSON.stringify({ windows, zCounter }))
    }, 400)
    return () => window.clearTimeout(timer)
  }, [windows, zCounter])

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STATE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    window.localStorage.setItem(PREFERENCES_STATE_KEY, JSON.stringify(preferences))
  }, [preferences])

  useEffect(() => {
    if (powerMode !== 'sleepTransition') return

    const toSleeping = window.setTimeout(() => {
      setPowerMode('sleeping')
      setIsSleepWakeArmed(false)
    }, 680)

    return () => window.clearTimeout(toSleeping)
  }, [powerMode])

  useEffect(() => {
    if (powerMode !== 'sleeping') return

    const armWake = window.setTimeout(() => {
      setIsSleepWakeArmed(true)
    }, 520)

    return () => window.clearTimeout(armWake)
  }, [powerMode])

  useEffect(() => {
    if (powerMode !== 'sleeping' || !isSleepWakeArmed) return

    const wake = () => {
      setPowerMode('waking')
      setIsSleepWakeArmed(false)
    }

    window.addEventListener('pointermove', wake, { once: true })
    window.addEventListener('keydown', wake, { once: true })
    window.addEventListener('touchstart', wake, { once: true })
    return () => {
      window.removeEventListener('pointermove', wake)
      window.removeEventListener('keydown', wake)
      window.removeEventListener('touchstart', wake)
    }
  }, [powerMode, isSleepWakeArmed])

  useEffect(() => {
    if (powerMode !== 'waking') return

    const toAwake = window.setTimeout(() => {
      setPowerMode('awake')
    }, 520)

    return () => window.clearTimeout(toAwake)
  }, [powerMode])

  useEffect(() => {
    if (powerMode !== 'restarting') return

    const rebootTimer = window.setTimeout(() => {
      window.location.reload()
    }, 2200)

    return () => window.clearTimeout(rebootTimer)
  }, [powerMode])

  useEffect(() => {
    if (powerMode !== 'shutdownUpdating') return

    const interval = window.setInterval(() => {
      setShutdownProgress((prev) => {
        const next = Math.min(88, prev + 5 + Math.floor(Math.random() * 8))
        if (next >= 88) {
          window.clearInterval(interval)
          setPowerMode('shutdownFailed')
        }
        return next
      })
    }, 260)

    return () => window.clearInterval(interval)
  }, [powerMode])

  useEffect(() => {
    if (powerMode !== 'shutdownFailed') return

    const toReboot = window.setTimeout(() => {
      setPowerMode('shutdownRebooting')
    }, 1800)

    return () => window.clearTimeout(toReboot)
  }, [powerMode])

  useEffect(() => {
    if (powerMode !== 'shutdownRebooting') return

    const rebootTimer = window.setTimeout(() => {
      window.location.reload()
    }, 1800)

    return () => window.clearTimeout(rebootTimer)
  }, [powerMode])

  const openCrawl = useCallback(() => setIsCrawlOpen(true), [])
  useKonamiUnlock(openCrawl)

  useEffect(() => {
    window.addEventListener(EASTER_EGG_EVENT, openCrawl)
    return () => window.removeEventListener(EASTER_EGG_EVENT, openCrawl)
  }, [openCrawl])

  // Finishing (or skipping) the crawl unlocks the Imperial Fleet wallpaper and switches to it.
  const finishCrawl = useCallback(() => {
    setIsCrawlOpen(false)
    unlockStarDestroyer()
    setIsStarDestroyerAvailable(true)
    setPreferences((prev) => ({ ...prev, wallpaper: 'stardestroyer' }))
    setShowAchievement(true)
  }, [])

  const dismissAchievement = useCallback(() => setShowAchievement(false), [])

  const easterEggLayer = (
    <>
      {isCrawlOpen ? <StarWarsCrawl locale={locale} t={t} onFinish={finishCrawl} /> : null}
      {showAchievement ? (
        <AchievementToast title={t('achievement.title')} body={t('achievement.stardestroyer')} onDismiss={dismissAchievement} />
      ) : null}
    </>
  )

  // Window contents are memoized, so the APIs handed to apps must keep a stable identity.
  const windowsRef = useRef(windows)
  useEffect(() => {
    windowsRef.current = windows
  }, [windows])

  const resolveAppId = useCallback(
    (name: string): AppId | null => {
      const normalized = name.trim().toLowerCase()
      if (!normalized) return null

      const byId = discoverablePlugins.find((plugin) => plugin.id.toLowerCase() === normalized)
      if (byId) return byId.id

      const byTitle = discoverablePlugins.find((plugin) => t(plugin.titleKey).toLowerCase() === normalized)
      return byTitle ? byTitle.id : null
    },
    [discoverablePlugins, t],
  )

  const launchApp = useCallback(
    (id: AppId, query?: string) => {
      setLaunchIntent(query?.trim() ? { appId: id, query: query.trim(), token: Date.now() } : null)
      openWindow(id)
    },
    [openWindow],
  )

  const desktopApi = useMemo<DesktopCommandApi>(
    () => ({
      openApp: (name, query) => {
        const id = resolveAppId(name)
        if (!id) return false
        launchApp(id, query)
        return true
      },
      minimizeApp: (name) => {
        const id = resolveAppId(name)
        if (!id) return false
        minimizeWindow(id)
        return true
      },
      closeApp: (name) => {
        const id = resolveAppId(name)
        if (!id) return false
        closeWindow(id)
        return true
      },
      listApps: () =>
        discoverablePlugins.map((plugin) => ({
          id: plugin.id,
          title: t(plugin.titleKey),
          isOpen: windowsRef.current[plugin.id].isOpen,
          isMinimized: windowsRef.current[plugin.id].isMinimized,
        })),
    }),
    [closeWindow, discoverablePlugins, launchApp, minimizeWindow, resolveAppId, t],
  )

  const preferencesApi = useMemo<DesktopPreferencesApi>(
    () => ({
      preferences,
      themes: AVAILABLE_THEMES,
      wallpapers: isStarDestroyerAvailable
        ? AVAILABLE_WALLPAPERS
        : AVAILABLE_WALLPAPERS.filter((wallpaper) => wallpaper !== 'stardestroyer'),
      desktopIconSizes: AVAILABLE_DESKTOP_ICON_SIZES,
      clockHourFormats: AVAILABLE_CLOCK_HOUR_FORMATS,
      clockDateFormats: AVAILABLE_CLOCK_DATE_FORMATS,
      appIconChoices: APP_ICON_CHOICES,
      setTheme: (theme) => setPreferences((prev) => ({ ...prev, theme })),
      setWallpaper: (wallpaper) => setPreferences((prev) => ({ ...prev, wallpaper })),
      setDesktopIconSize: (desktopIconSize) => setPreferences((prev) => ({ ...prev, desktopIconSize })),
      setClockHourFormat: (clockHourFormat) => setPreferences((prev) => ({ ...prev, clockHourFormat })),
      setClockDateFormat: (clockDateFormat) => setPreferences((prev) => ({ ...prev, clockDateFormat })),
      setAppIcon: (appId, iconId) => {
        setPreferences((prev) => ({
          ...prev,
          appIcons: {
            ...prev.appIcons,
            [appId]: iconId ?? undefined,
          },
        }))
      },
    }),
    [isStarDestroyerAvailable, preferences],
  )

  const visibleWindows = Object.values(windows).filter(
    (windowItem) => windowItem.isOpen && !windowItem.isMinimized,
  )

  // The taskbar only cares about open/minimized/focus state, not positions: keep its input stable while dragging.
  const taskbarKey = Object.values(windows)
    .map((windowItem) => `${windowItem.id}:${Number(windowItem.isOpen)}:${Number(windowItem.isMinimized)}:${windowItem.zIndex}`)
    .join('|')
  const taskbarWindows = useMemo(
    () =>
      taskbarKey.split('|').map((entry) => {
        const [id, isOpen, isMinimized, zIndex] = entry.split(':')
        return { id: id as AppId, isOpen: isOpen === '1', isMinimized: isMinimized === '1', zIndex: Number(zIndex) }
      }),
    [taskbarKey],
  )

  const desktopIconClasses = DESKTOP_ICON_SIZE_CLASSES[preferences.desktopIconSize]

  const handleTaskbarAppClick = useCallback(
    (id: AppId, isOpen: boolean, isMinimized: boolean) => {
      if (!isOpen || isMinimized) {
        openWindow(id)
        return
      }
      minimizeWindow(id)
    },
    [minimizeWindow, openWindow],
  )

  const openSearch = useCallback(() => setIsSpotlightOpen(true), [])

  const startPowerAction = useCallback(
    (action: 'sleep' | 'restart' | 'shutdown') => {
      if (powerMode !== 'awake') return
      setLaunchIntent(null)

      if (action === 'sleep') {
        setPowerMode('sleepTransition')
        return
      }

      // A restart or shutdown is a fresh start: forget the easter egg unlock and replay the boot.
      resetEasterEgg()
      resetBootFlag()
      setIsStarDestroyerAvailable(false)
      if (preferences.wallpaper === 'stardestroyer') {
        const next = { ...preferences, wallpaper: DEFAULT_PREFERENCES.wallpaper }
        window.localStorage.setItem(PREFERENCES_STATE_KEY, JSON.stringify(next))
        setPreferences(next)
      }

      if (action === 'restart') {
        setPowerMode('restarting')
        return
      }

      setShutdownProgress(0)
      setPowerMode('shutdownUpdating')
    },
    [powerMode, preferences],
  )

  const shellClassName = `desktop-shell desktop-shell--theme-${preferences.theme} desktop-shell--wallpaper-${preferences.wallpaper}`

  if (isPhone) {
    return (
      <div className={shellClassName} style={{ minHeight: '100dvh', height: '100dvh' }}>
        <Wallpaper preset={preferences.wallpaper} interactive={false} />
        <MobileShell
          now={now}
          t={t}
          windows={windows}
          discoverablePlugins={discoverablePlugins}
          preferences={preferences}
          desktopApi={desktopApi}
          i18nApi={i18nApi}
          preferencesApi={preferencesApi}
          launchIntent={launchIntent}
          onOpenApp={openWindow}
          onCloseApp={closeWindow}
          onMinimizeApp={minimizeWindow}
        />
        {easterEggLayer}
      </div>
    )
  }

  return (
    <div className={shellClassName}>
      <Wallpaper preset={preferences.wallpaper} />

      <DesktopHero
        locale={locale}
        now={now}
        t={t}
        preferences={preferences}
        onOpenApp={launchApp}
        onOpenSearch={openSearch}
        isDimmed={visibleWindows.length > 0}
      />

      <nav
        className={`relative z-[6] flex max-h-[calc(100svh-6rem)] flex-col flex-wrap gap-1 p-3 pt-11 ${desktopIconClasses.column}`}
        aria-label={t('desktop.icons.label')}
      >
        {discoverablePlugins.map((plugin, index) => {
          const isOpen = windows[plugin.id].isOpen
          const appIcon = resolveAppIcon(plugin.id, preferences)
          return (
            <button
              key={plugin.id}
              type="button"
              className={`desktop-icon flex select-none flex-col items-center rounded-xl ${desktopIconClasses.button}`}
              style={{ '--i': index } as CSSProperties}
              onClick={() => openWindow(plugin.id)}
            >
              <span
                className={`desktop-icon__tile grid place-items-center ${desktopIconClasses.tile} ${isBareIcon(appIcon) ? 'desktop-icon__tile--bare' : ''}`}
              >
                {renderAppIcon(appIcon, 'h-full w-full object-contain text-center leading-none')}
                {isOpen ? <span className="desktop-icon__badge" aria-hidden="true" /> : null}
              </span>
              <span
                className={`desktop-icon-label max-w-full whitespace-normal break-words text-center leading-tight ${desktopIconClasses.label}`}
              >
                {t(plugin.titleKey)}
              </span>
            </button>
          )
        })}
      </nav>

      <WindowLayer
        isDragging={isDragging}
        isResizing={isResizing}
        snapPreviewTarget={snapPreviewTarget}
        visibleWindows={visibleWindows}
        preferences={preferences}
        desktopApi={desktopApi}
        i18nApi={i18nApi}
        preferencesApi={preferencesApi}
        onBringToFront={bringToFront}
        onMinimizeWindow={minimizeWindow}
        onToggleMaximizeWindow={toggleMaximizeWindow}
        onCloseWindow={closeWindow}
        onHeaderPointerDown={handleHeaderPointerDown}
        onHeaderPointerMove={handleHeaderPointerMove}
        onStopDragging={stopDragging}
        onResizePointerDown={handleResizePointerDown}
        onResizePointerMove={handleResizePointerMove}
        onStopResizing={stopResizing}
        onToggleHorizontalSnap={toggleHorizontalSnap}
        launchIntent={launchIntent}
        t={t}
      />

      <Taskbar
        locale={locale}
        now={now}
        t={t}
        preferences={preferences}
        windows={taskbarWindows}
        onLaunchFromAppleMenu={launchApp}
        onTaskbarAppClick={handleTaskbarAppClick}
        onPowerAction={startPowerAction}
        isSpotlightOpen={isSpotlightOpen}
        onSpotlightOpenChange={setIsSpotlightOpen}
      />

      {isBooting ? <BootScreen onDone={finishBoot} skipHint={t('boot.skip')} /> : null}

      {powerMode !== 'awake' ? (
        <section className="power-overlay absolute inset-0 z-60">
          {powerMode === 'sleepTransition' || powerMode === 'sleeping' || powerMode === 'waking' ? (
            <div className={`sleep-scene ${powerMode === 'sleepTransition' ? 'sleep-scene--closing' : ''} ${powerMode === 'sleeping' ? 'sleep-scene--asleep' : ''} ${powerMode === 'waking' ? 'sleep-scene--opening' : ''}`}>
              <div className="sleep-scene__veil" />
              <div className="sleep-scene__lid sleep-scene__lid--top" />
              <div className="sleep-scene__lid sleep-scene__lid--bottom" />
              <div className="sleep-scene__hint">
                <p className="m-0 text-base font-semibold">{t('power.sleep.title')}</p>
                <p className="m-0 mt-1 text-xs opacity-80">{t('power.sleep.hint')}</p>
              </div>
            </div>
          ) : null}

          {powerMode === 'restarting' ? (
            <div className="power-screen power-screen--restart">
              <div className="power-screen__spinner" aria-hidden="true" />
              <p className="m-0 text-lg font-semibold">{t('power.restart.title')}</p>
              <p className="m-0 mt-2 text-sm opacity-80">{t('power.restart.body')}</p>
            </div>
          ) : null}

          {powerMode === 'shutdownUpdating' || powerMode === 'shutdownFailed' || powerMode === 'shutdownRebooting' ? (
            <div className="power-screen power-screen--shutdown">
              <p className="m-0 text-lg font-semibold">{t('power.shutdown.title')}</p>
              <p className="m-0 mt-2 text-sm opacity-85">
                {powerMode === 'shutdownUpdating'
                  ? t('power.shutdown.updating')
                  : powerMode === 'shutdownFailed'
                    ? t('power.shutdown.failed')
                    : t('power.shutdown.rebooting')}
              </p>

              <div className="power-screen__progress mt-5 w-[min(72vw,480px)] rounded-full">
                <div className="power-screen__progress-fill rounded-full" style={{ width: `${shutdownProgress}%` }} />
              </div>
              <p className="m-0 mt-2 text-xs opacity-70">{shutdownProgress}%</p>
            </div>
          ) : null}
        </section>
      ) : null}
      {easterEggLayer}
    </div>
  )
}

export default App
