import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import JSConfetti from 'js-confetti'
import './App.css'
import { APP_ICON_CHOICES } from './desktop/appIcons'
import { AVAILABLE_LOCALES, createTranslator } from './desktop/i18n'
import { DESKTOP_PLUGINS } from './desktop/plugins'
import type {
  AppId,
  DesktopCommandApi,
  DesktopIconSize,
  DesktopI18nApi,
  DesktopLaunchIntent,
  DesktopPreferences,
  DesktopPreferencesApi,
  Locale,
} from './desktop/types'
import { Taskbar } from './desktop-shell/components/Taskbar'
import { WindowLayer } from './desktop-shell/components/WindowLayer'
import { useKonamiUnlock } from './desktop-shell/hooks/useKonamiUnlock'
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
  loadPersistedDesktopState,
  loadPersistedLocale,
  loadPersistedPreferences,
} from './desktop-shell/utils/persistence'
import { renderAppIcon, resolveAppIcon } from './desktop-shell/utils/icons'
import { MobileShell } from './mobile-shell/components/MobileShell'
import { useIsPhone } from './mobile-shell/hooks/useIsPhone'

const DESKTOP_ICON_SIZE_CLASSES = {
  small: {
    column: 'w-28',
    button: 'w-full gap-1 p-1.5',
    iconWrap: 'h-8 w-8',
    label: 'text-[11px]',
  },
  normal: {
    column: 'w-36',
    button: 'w-full gap-1.5 p-2',
    iconWrap: 'h-10 w-10',
    label: 'text-xs',
  },
  large: {
    column: 'w-44',
    button: 'w-full gap-2 p-2.5',
    iconWrap: 'h-12 w-12',
    label: 'text-sm',
  },
  xl: {
    column: 'w-52',
    button: 'w-full gap-2.5 p-3',
    iconWrap: 'h-14 w-14',
    label: 'text-[15px]',
  },
} as const

const CALENDAR_ICON_TEXT_CLASSES: Record<DesktopIconSize, { weekday: string; day: string }> = {
  small: { weekday: 'text-[7px]', day: 'text-[22px]' },
  normal: { weekday: 'text-[8px]', day: 'text-[26px]' },
  large: { weekday: 'text-[10px]', day: 'text-[31px]' },
  xl: { weekday: 'text-[11px]', day: 'text-[36px]' },
}

const renderDynamicCalendarDesktopIcon = (now: Date, locale: Locale, iconSize: DesktopIconSize) => {
  const intlLocale = locale === 'en' ? 'en-US' : 'it-IT'
  const weekdayRaw = new Intl.DateTimeFormat(intlLocale, { weekday: 'short' }).format(now)
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1)
  const day = new Intl.DateTimeFormat(intlLocale, { day: 'numeric' }).format(now)
  const textClasses = CALENDAR_ICON_TEXT_CLASSES[iconSize]

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[22%] bg-[#ececec] text-black shadow-[inset_0_0_0_1px_#0000001f]">
      <span className={`truncate px-1 pt-[8%] text-center leading-none text-red-500 ${textClasses.weekday}`}>{weekday}</span>
      <span className={`grid flex-1 place-items-center leading-none ${textClasses.day}`}>{day}</span>
    </div>
  )
}

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
  const [now, setNow] = useState(() => new Date())
  const [launchIntent, setLaunchIntent] = useState<DesktopLaunchIntent | null>(null)
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
  const jsConfettiRef = useRef<JSConfetti | null>(null)
  const isConfettiRunningRef = useRef(false)
  const t = useMemo(() => createTranslator(locale), [locale])

  const discoverablePlugins = useMemo(
    () => Object.values(DESKTOP_PLUGINS).filter((plugin) => !plugin.hidden),
    [],
  )

  const i18nApi: DesktopI18nApi = {
    locale,
    locales: AVAILABLE_LOCALES,
    setLocale,
    t,
  }

  useEffect(() => {
    window.localStorage.setItem(
      DESKTOP_STATE_KEY,
      JSON.stringify({ windows, zCounter }),
    )
  }, [windows, zCounter])

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STATE_KEY, locale)
  }, [locale])

  useEffect(() => {
    window.localStorage.setItem(PREFERENCES_STATE_KEY, JSON.stringify(preferences))
  }, [preferences])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

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

  const launchKonamiConfettiWaves = useCallback(async () => {
    if (typeof window === 'undefined' || isConfettiRunningRef.current) return

    if (!jsConfettiRef.current) {
      jsConfettiRef.current = new JSConfetti()
    }

    isConfettiRunningRef.current = true

    const waves = [
      { confettiRadius: 6, confettiNumber: 70 },
      { confettiRadius: 5, confettiNumber: 110 },
      { confettiRadius: 4, confettiNumber: 140 },
      { confettiRadius: 6, confettiNumber: 90 },
    ]

    try {
      for (const wave of waves) {
        await jsConfettiRef.current.addConfetti(wave)
        await new Promise((resolve) => window.setTimeout(resolve, 140))
      }
    } finally {
      isConfettiRunningRef.current = false
    }
  }, [])

  const onKonamiUnlock = useCallback(() => {
    openWindow('easterEgg')
    void launchKonamiConfettiWaves()
  }, [launchKonamiConfettiWaves, openWindow])

  const { arm: armKonami, reset: resetKonami } = useKonamiUnlock(onKonamiUnlock)

  const resolveAppId = (name: string): AppId | null => {
    const normalized = name.trim().toLowerCase()
    if (!normalized) return null

    const byId = discoverablePlugins.find((plugin) => plugin.id.toLowerCase() === normalized)
    if (byId) return byId.id

    const byTitle = discoverablePlugins.find(
      (plugin) => t(plugin.titleKey).toLowerCase() === normalized,
    )
    return byTitle ? byTitle.id : null
  }

  const launchApp = (id: AppId, query?: string) => {
    if (query?.trim()) {
      setLaunchIntent({
        appId: id,
        query: query.trim(),
        token: Date.now(),
      })
    } else {
      setLaunchIntent(null)
    }

    openWindow(id)
  }

  const desktopApi: DesktopCommandApi = {
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
        isOpen: windows[plugin.id].isOpen,
        isMinimized: windows[plugin.id].isMinimized,
      })),
  }

  const preferencesApi: DesktopPreferencesApi = {
    preferences,
    themes: AVAILABLE_THEMES,
    wallpapers: AVAILABLE_WALLPAPERS,
    desktopIconSizes: AVAILABLE_DESKTOP_ICON_SIZES,
    clockHourFormats: AVAILABLE_CLOCK_HOUR_FORMATS,
    clockDateFormats: AVAILABLE_CLOCK_DATE_FORMATS,
    appIconChoices: APP_ICON_CHOICES,
    setTheme: (theme) => setPreferences((prev) => ({ ...prev, theme })),
    setWallpaper: (wallpaper) => setPreferences((prev) => ({ ...prev, wallpaper })),
    setDesktopIconSize: (desktopIconSize) =>
      setPreferences((prev) => ({ ...prev, desktopIconSize })),
    setClockHourFormat: (clockHourFormat) =>
      setPreferences((prev) => ({ ...prev, clockHourFormat })),
    setClockDateFormat: (clockDateFormat) =>
      setPreferences((prev) => ({ ...prev, clockDateFormat })),
    setAppIcon: (appId, iconId) => {
      setPreferences((prev) => ({
        ...prev,
        appIcons: {
          ...prev.appIcons,
          [appId]: iconId ?? undefined,
        },
      }))
    },
  }

  const visibleWindows = Object.values(windows).filter(
    (windowItem) => windowItem.isOpen && !windowItem.isMinimized,
  )

  const desktopIconClasses = DESKTOP_ICON_SIZE_CLASSES[preferences.desktopIconSize]

  const launchFromAppleMenu = (id: AppId, query?: string) => {
    launchApp(id, query)
  }

  const startPowerAction = (action: 'sleep' | 'restart' | 'shutdown') => {
    if (powerMode !== 'awake') return
    setLaunchIntent(null)

    if (action === 'sleep') {
      setPowerMode('sleepTransition')
      return
    }

    if (action === 'restart') {
      setPowerMode('restarting')
      return
    }

    setShutdownProgress(0)
    setPowerMode('shutdownUpdating')
  }

  const shellClassName = `desktop-shell desktop-shell--theme-${preferences.theme} desktop-shell--wallpaper-${preferences.wallpaper}`

  if (isPhone) {
    return (
      <div className={shellClassName} style={{ minHeight: '100dvh', height: '100dvh' }}>
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
      </div>
    )
  }

  return (
    <div
      className={shellClassName}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          armKonami()
          return
        }

        resetKonami()
      }}
    >
      <aside
        className={`flex flex-col gap-2 p-4 pt-10 ${desktopIconClasses.column}`}
        aria-label={t('desktop.icons.label')}
      >
        {discoverablePlugins.map((plugin) => (
          <button
            key={plugin.id}
            className={`flex cursor-default select-none flex-col items-center rounded-lg border border-transparent text-(--desktop-icon-color) hover:border-white/25 hover:bg-white/10 ${desktopIconClasses.button}`}
            onDoubleClick={() => openWindow(plugin.id)}
          >
            <span className={`grid place-items-center ${desktopIconClasses.iconWrap}`}>
              {plugin.id === 'calendar'
                ? renderDynamicCalendarDesktopIcon(now, locale, preferences.desktopIconSize)
                : renderAppIcon(
                    resolveAppIcon(plugin.id, preferences),
                    'h-full w-full object-contain text-center leading-none',
                  )}
            </span>
            <span
              className={`desktop-icon-label max-w-full whitespace-normal break-words text-center leading-tight ${desktopIconClasses.label}`}
            >
              {t(plugin.titleKey)}
            </span>
          </button>
        ))}
      </aside>

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
        windows={Object.values(windows)}
        onLaunchFromAppleMenu={launchFromAppleMenu}
        onTaskbarAppClick={(id, isOpen, isMinimized) => {
          if (!isOpen || isMinimized) {
            openWindow(id)
            return
          }
          minimizeWindow(id)
        }}
        onPowerAction={startPowerAction}
      />

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
    </div>
  )
}

export default App
