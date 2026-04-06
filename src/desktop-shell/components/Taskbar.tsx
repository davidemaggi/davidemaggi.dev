import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { DESKTOP_PLUGINS } from '../../desktop/plugins'
import type { AppId, DesktopPreferences, Locale } from '../../desktop/types'
import { formatDesktopDateTime } from '../../desktop/utils/dateTimeFormat'
import { renderAppIcon, resolveAppIcon } from '../utils/icons'

type TaskbarWindowItem = {
  id: AppId
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
}

type TaskbarProps = {
  locale: Locale
  now: Date
  t: (key: string, vars?: Record<string, string>) => string
  preferences: DesktopPreferences
  windows: TaskbarWindowItem[]
  onLaunchFromAppleMenu: (id: AppId, query?: string) => void
  onTaskbarAppClick: (id: AppId, isOpen: boolean, isMinimized: boolean) => void
}

type AboutTab = 'overview' | 'displays' | 'storage'

type WifiNetwork = {
  id: 'tardis' | 'dalek' | 'starDestroyer' | 'alderaan'
  ssid: string
  signal: 0 | 2 | 3 | 4
  outOfRange?: boolean
}

export function Taskbar({
  locale,
  now,
  t,
  preferences,
  windows,
  onLaunchFromAppleMenu,
  onTaskbarAppClick,
}: TaskbarProps) {
  const dockAreaRef = useRef<HTMLDivElement | null>(null)
  const appleMenuRef = useRef<HTMLDivElement | null>(null)
  const aboutPanelRef = useRef<HTMLDivElement | null>(null)
  const wifiMenuRef = useRef<HTMLDivElement | null>(null)
  const spotlightRef = useRef<HTMLDivElement | null>(null)
  const spotlightInputRef = useRef<HTMLInputElement | null>(null)
  const dockAppButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [isDockVisible, setIsDockVisible] = useState(true)
  const [dockScales, setDockScales] = useState<number[]>([])
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false)
  const [isSystemAboutOpen, setIsSystemAboutOpen] = useState(false)
  const [isWifiMenuOpen, setIsWifiMenuOpen] = useState(false)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)
  const [spotlightQuery, setSpotlightQuery] = useState('')
  const [aboutTab, setAboutTab] = useState<AboutTab>('overview')
  const [wifiError, setWifiError] = useState<string | null>(null)
  const [connectedNetworkId, setConnectedNetworkId] = useState<WifiNetwork['id']>('tardis')

  const wifiNetworks: WifiNetwork[] = [
    { id: 'tardis', ssid: 'Tardis WIFI', signal: 4 },
    { id: 'dalek', ssid: 'Dalek Station', signal: 3 },
    { id: 'starDestroyer', ssid: 'Star Destroyer Network', signal: 2 },
    { id: 'alderaan', ssid: 'Royal Palace of Alderaan', signal: 0, outOfRange: true },
  ]

  const windowsById = useMemo(
    () => Object.fromEntries(windows.map((windowItem) => [windowItem.id, windowItem])),
    [windows],
  )
  const dockPlugins = useMemo(
    () => Object.values(DESKTOP_PLUGINS).filter((plugin) => !plugin.hidden),
    [],
  )
  const spotlightResults = useMemo(() => {
    const query = spotlightQuery.trim().toLowerCase()
    const candidates = dockPlugins.map((plugin) => ({
      id: plugin.id,
      title: t(plugin.titleKey),
    }))

    if (!query) return candidates.slice(0, 8)

    return candidates
      .filter((candidate) => {
        return (
          candidate.title.toLowerCase().includes(query) ||
          candidate.id.toLowerCase().includes(query)
        )
      })
      .slice(0, 8)
  }, [dockPlugins, spotlightQuery, t])
  const connectedNetwork = wifiNetworks.find((network) => network.id === connectedNetworkId) ?? wifiNetworks[0]

  const updateDockScales = (pointerX: number | null) => {
    if (pointerX === null) {
      setDockScales([])
      return
    }

    const influenceRadius = 150
    const nextScales = dockPlugins.map((_, index) => {
      const buttonElement = dockAppButtonRefs.current[index]
      if (!buttonElement) return 1
      const rect = buttonElement.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const distance = Math.abs(centerX - pointerX)
      const intensity = Math.max(0, 1 - distance / influenceRadius)
      return 1 + intensity * 0.26
    })

    setDockScales(nextScales)
  }
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const nearBottomEdge = window.innerHeight - event.clientY <= 96
      if (nearBottomEdge) {
        setIsDockVisible(true)
        return
      }

      if (!dockAreaRef.current?.matches(':hover')) {
        setIsDockVisible(false)
      }
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  useEffect(() => {
    if (!isAppleMenuOpen && !isSystemAboutOpen && !isSpotlightOpen && !isWifiMenuOpen) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (isAppleMenuOpen && appleMenuRef.current && !appleMenuRef.current.contains(target)) {
        setIsAppleMenuOpen(false)
      }

      if (isSystemAboutOpen && aboutPanelRef.current && !aboutPanelRef.current.contains(target)) {
        setIsSystemAboutOpen(false)
      }

      if (isSpotlightOpen && spotlightRef.current && !spotlightRef.current.contains(target)) {
        setIsSpotlightOpen(false)
      }

      if (isWifiMenuOpen && wifiMenuRef.current && !wifiMenuRef.current.contains(target)) {
        setIsWifiMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [isAppleMenuOpen, isSystemAboutOpen, isSpotlightOpen, isWifiMenuOpen])

  useEffect(() => {
    if (!isAppleMenuOpen && !isSystemAboutOpen && !isSpotlightOpen && !isWifiMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isSpotlightOpen) {
          setIsSpotlightOpen(false)
          return
        }

        if (isWifiMenuOpen) {
          setIsWifiMenuOpen(false)
          return
        }

        if (isSystemAboutOpen) {
          setIsSystemAboutOpen(false)
          return
        }

        if (isAppleMenuOpen) {
          setIsAppleMenuOpen(false)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isAppleMenuOpen, isSystemAboutOpen, isSpotlightOpen, isWifiMenuOpen])

  useEffect(() => {
    if (!wifiError) return
    const timeoutId = window.setTimeout(() => setWifiError(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [wifiError])

  useEffect(() => {
    if (!isSpotlightOpen) return
    spotlightInputRef.current?.focus()
    spotlightInputRef.current?.select()
  }, [isSpotlightOpen])

  const { formattedTime, formattedDate } = formatDesktopDateTime({
    now,
    locale,
    clockHourFormat: preferences.clockHourFormat,
    clockDateFormat: preferences.clockDateFormat,
  })

  const handleAppleLaunch = (id: AppId, query?: string) => {
    setIsAppleMenuOpen(false)
    onLaunchFromAppleMenu(id, query)
  }

  const handleSpotlightLaunch = (id: AppId) => {
    setIsSpotlightOpen(false)
    setSpotlightQuery('')
    onLaunchFromAppleMenu(id)
  }

  const handleWifiSelect = (network: WifiNetwork) => {
    if (network.outOfRange) {
      setWifiError(t('wifi.error.outOfRange', { ssid: network.ssid }))
      return
    }

    setConnectedNetworkId(network.id)
    setIsWifiMenuOpen(false)
  }

  const renderWifiSignal = (signal: number, muted = false) => {
    const levels = [1, 2, 3, 4]
    return (
      <span className={`wifi-signal ${muted ? 'wifi-signal--muted' : ''}`} aria-hidden="true">
        {levels.map((level) => (
          <span
            key={`wifi-level-${level}`}
            className={`wifi-signal__bar wifi-signal__bar--${level} ${level <= signal ? 'wifi-signal__bar--on' : ''}`}
          />
        ))}
      </span>
    )
  }

  const browserInfo = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown browser'
  const platformInfo = typeof navigator !== 'undefined' ? navigator.platform : 'Unknown platform'
  const resolutionInfo = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'
  const logicalResolutionInfo =
    typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Unknown'
  const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'
  const appBuildDate =
    typeof __APP_BUILD_DATE__ !== 'undefined'
      ? new Date(__APP_BUILD_DATE__).toLocaleString(locale === 'it' ? 'it-IT' : 'en-US')
      : 'Unknown'
  const usedStorageValue = Math.min(2 + windows.filter((item) => item.isOpen).length * 0.37, 14.8)

  return (
    <>
      {wifiError ? (
        <div className="wifi-toast absolute top-10 right-3 z-40 max-w-[340px] rounded-lg border px-3 py-2 text-sm">
          {wifiError}
        </div>
      ) : null}

      {isSpotlightOpen ? (
        <section className="spotlight-overlay absolute inset-0 z-28 grid items-start justify-center px-4 pt-[14vh]">
          <div ref={spotlightRef} className="spotlight-panel w-[min(92vw,680px)] rounded-2xl border">
            <div className="spotlight-input-wrap flex items-center gap-2 border-b px-4 py-3">
              <svg className="h-4.5 w-4.5 opacity-70" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6 6 0 10-.71.71l.27.28v.79L20 21.5 21.5 20l-6-6zm-5.5 0A4.5 4.5 0 1110 5a4.5 4.5 0 010 9z"
                />
              </svg>
              <input
                ref={spotlightInputRef}
                value={spotlightQuery}
                onChange={(event) => setSpotlightQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && spotlightResults[0]) {
                    handleSpotlightLaunch(spotlightResults[0].id)
                  }
                }}
                placeholder={t('desktop.search.placeholder')}
                aria-label={t('desktop.search.placeholder')}
                className="spotlight-input min-w-0 flex-1 bg-transparent outline-none"
              />
            </div>
            <div className="max-h-72 overflow-auto p-2">
              {spotlightResults.length ? (
                spotlightResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="spotlight-result w-full rounded-lg px-3 py-2 text-left"
                    onClick={() => handleSpotlightLaunch(result.id)}
                  >
                    <span className="inline-flex items-center gap-2">
                      {renderAppIcon(resolveAppIcon(result.id, preferences), 'h-4.5 w-4.5 object-contain')}
                      {result.title}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm opacity-70">{t('start.noResults')}</p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {isSystemAboutOpen ? (
        <section className="system-about-backdrop absolute inset-0 z-29 grid place-items-center px-4">
          <div ref={aboutPanelRef} className="system-about-card w-[min(92vw,520px)] rounded-2xl border p-5">
            <header className="flex items-center gap-3">
              <img src="/icons/daveos.svg" alt="" aria-hidden="true" className="system-about-logo h-9 w-9 rounded-lg" />
              <div>
                <h2 className="m-0 text-lg font-semibold">{t('about.system.title')}</h2>
                <p className="m-0 text-sm opacity-80">
                  {t('about.system.versionBuild', { version: appVersion, build: appBuildDate })}
                </p>
              </div>
            </header>

            <div className="mt-4 inline-flex rounded-lg border border-(--app-border) bg-(--app-surface-2) p-1">
              <button
                type="button"
                className={`system-about-tab rounded-md px-2.5 py-1 text-xs ${aboutTab === 'overview' ? 'system-about-tab--active' : ''}`}
                onClick={() => setAboutTab('overview')}
              >
                {t('about.system.tab.overview')}
              </button>
              <button
                type="button"
                className={`system-about-tab rounded-md px-2.5 py-1 text-xs ${aboutTab === 'displays' ? 'system-about-tab--active' : ''}`}
                onClick={() => setAboutTab('displays')}
              >
                {t('about.system.tab.displays')}
              </button>
              <button
                type="button"
                className={`system-about-tab rounded-md px-2.5 py-1 text-xs ${aboutTab === 'storage' ? 'system-about-tab--active' : ''}`}
                onClick={() => setAboutTab('storage')}
              >
                {t('about.system.tab.storage')}
              </button>
            </div>

            {aboutTab === 'overview' ? (
              <div className="system-about-grid mt-4 text-sm">
                <span>{t('about.system.field.theme')}</span><strong>{preferences.theme}</strong>
                <span>{t('about.system.field.wallpaper')}</span><strong>{preferences.wallpaper}</strong>
                <span>{t('about.system.field.language')}</span><strong>{locale.toUpperCase()}</strong>
                <span>{t('about.system.field.clock')}</span><strong>{formattedDate} {formattedTime}</strong>
                <span>{t('about.system.field.platform')}</span><strong>{platformInfo}</strong>
                <span>{t('about.system.field.browser')}</span><strong className="truncate" title={browserInfo}>{browserInfo}</strong>
                <span>{t('about.system.field.openApps')}</span><strong>{windows.filter((item) => item.isOpen).length}</strong>
              </div>
            ) : null}

            {aboutTab === 'displays' ? (
              <div className="system-about-grid mt-4 text-sm">
                <span>{t('about.system.field.display')}</span><strong>{t('about.system.value.displayName')}</strong>
                <span>{t('about.system.field.activeResolution')}</span><strong>{resolutionInfo}</strong>
                <span>{t('about.system.field.logicalResolution')}</span><strong>{logicalResolutionInfo}</strong>
                <span>{t('about.system.field.refreshRate')}</span><strong>{t('about.system.value.refreshRate')}</strong>
                <span>{t('about.system.field.colorProfile')}</span><strong>{t('about.system.value.colorProfile')}</strong>
                <span>{t('about.system.field.nightShift')}</span><strong>{t('about.system.value.off')}</strong>
              </div>
            ) : null}

            {aboutTab === 'storage' ? (
              <div className="system-about-grid mt-4 text-sm">
                <span>{t('about.system.field.systemVolume')}</span><strong>{t('about.system.value.systemVolume')}</strong>
                <span>{t('about.system.field.used')}</span><strong>{usedStorageValue.toFixed(1)} GB</strong>
                <span>{t('about.system.field.available')}</span><strong>{(64 - usedStorageValue).toFixed(1)} GB</strong>
                <span>{t('about.system.field.capacity')}</span><strong>64.0 GB</strong>
                <span>{t('about.system.field.apps')}</span><strong>{t('about.system.value.appsActive', { count: String(windows.filter((item) => item.isOpen).length) })}</strong>
                <span>{t('about.system.field.recommendedAction')}</span><strong>{t('about.system.value.recommendedAction')}</strong>
              </div>
            ) : null}

            <div className="mt-4 flex justify-end">
              <button className="system-about-close rounded-lg px-3 py-1.5" onClick={() => setIsSystemAboutOpen(false)}>
                {t('about.system.action.ok')}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <header className="menu-bar absolute top-0 right-0 left-0 z-20 flex h-8 items-center justify-between px-3 text-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div ref={appleMenuRef} className="relative">
            <button
              className="menu-bar__apple inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-sm font-semibold"
              aria-expanded={isAppleMenuOpen}
              aria-haspopup="menu"
              onClick={() => {
                setIsAppleMenuOpen((prev) => !prev)
              }}
            >
              <svg className="menu-bar__brand-icon h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22.635 3.883a1.364 1.25 0 0 0-1.363 1.25 1.364 1.25 0 0 0 1.363 1.25A1.364 1.25 0 0 0 24 5.133a1.364 1.25 0 0 0-1.365-1.25zm-16.004.418-6.027.008c-.026 0-.051-.003-.076 0-.296.036-.527.273-.528.558l.018 14.574c0 .22.06.676.682.676l5.58-.021c1.595-.003 2.664-.031 3.3-.112h.016a11.43 11.43 0 0 0 1.955-.469c1.22-.38 2.3-.944 3.23-1.697a7.854 7.854 0 0 0 2.114-2.562 6.716 6.716 0 0 0 .646-1.987 4.244 3.89 0 0 0 .26.028 4.244 3.89 0 0 0 4.244-3.89 4.244 3.89 0 0 0-4.244-3.89 4.244 3.89 0 0 0-2.9 1.082 8.838 8.838 0 0 0-2.25-1.355c-1.536-.65-3.536-.948-6.02-.943zm-.262 3.004c1.215-.003 2.079.034 2.569.101a7.32 7.32 0 0 1 1.617.436c.57.218 1.068.483 1.496.814 1.177.915 1.732 1.999 1.734 3.432.003 1.468-.534 2.611-1.68 3.57a5.582 5.582 0 0 1-1.177.742c-.409.19-.942.355-1.615.496-.636.128-1.6.2-2.856.202l-2.673.004-.012-9.793 2.598-.004z"
                />
              </svg>
              {t('menu.daveos.label')}
            </button>

            {isAppleMenuOpen ? (
              <section className="menu-bar__apple-menu absolute top-[calc(100%+6px)] left-0 z-30 min-w-56 rounded-xl border border-white/25 bg-[#0f1118ed] p-1.5 text-sm shadow-[0_14px_34px_#00000080] backdrop-blur-xl">
                <button className="menu-bar__apple-item" onClick={() => {
                  setIsAppleMenuOpen(false)
                  setAboutTab('overview')
                  setIsSystemAboutOpen(true)
                }}>{t('menu.daveos.about')}</button>
                <button className="menu-bar__apple-item" onClick={() => handleAppleLaunch('settings', 'software-update')}>{t('menu.daveos.softwareUpdate')}</button>
                <button className="menu-bar__apple-item" onClick={() => handleAppleLaunch('settings')}>{t('menu.daveos.systemSettings')}</button>
                <button className="menu-bar__apple-item" onClick={() => handleAppleLaunch('terminal')}>{t('menu.daveos.terminal')}</button>
                <div className="menu-bar__apple-separator" aria-hidden="true" />
                <button className="menu-bar__apple-item" onClick={() => setIsAppleMenuOpen(false)}>{t('start.power.sleep')}</button>
                <button className="menu-bar__apple-item" onClick={() => setIsAppleMenuOpen(false)}>{t('start.power.restart')}</button>
                <button className="menu-bar__apple-item" onClick={() => setIsAppleMenuOpen(false)}>{t('start.power.shutdown')}</button>
              </section>
            ) : null}
          </div>
          <span className="menu-bar__active-app truncate font-medium">
            {windows
              .filter((windowItem) => windowItem.isOpen && !windowItem.isMinimized)
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((windowItem) => t(DESKTOP_PLUGINS[windowItem.id].titleKey))[0] ?? 'Finder'}
          </span>
          <span className="menu-bar__item hidden md:inline">File</span>
          <span className="menu-bar__item hidden md:inline">Edit</span>
          <span className="menu-bar__item hidden md:inline">View</span>
          <span className="menu-bar__item hidden md:inline">Window</span>
          <span className="menu-bar__item hidden lg:inline">Help</span>
        </div>
        <div className="menu-bar__clock flex items-center gap-2" aria-label={t('desktop.clock.label')}>
          <button
            type="button"
            className="menu-bar__search-btn inline-grid h-6 w-6 place-items-center rounded-md"
            onClick={() => {
              setIsAppleMenuOpen(false)
              setIsSystemAboutOpen(false)
              setIsWifiMenuOpen(false)
              setIsSpotlightOpen((prev) => !prev)
            }}
            aria-label={t('desktop.search.placeholder')}
            title={t('desktop.search.placeholder')}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27a6 6 0 10-.71.71l.27.28v.79L20 21.5 21.5 20l-6-6zm-5.5 0A4.5 4.5 0 1110 5a4.5 4.5 0 010 9z"
              />
            </svg>
          </button>

          <div ref={wifiMenuRef} className="relative">
            <button
              type="button"
              className="menu-bar__search-btn inline-grid h-6 w-6 place-items-center rounded-md"
              onClick={() => {
                setIsAppleMenuOpen(false)
                setIsSystemAboutOpen(false)
                setIsSpotlightOpen(false)
                setIsWifiMenuOpen((prev) => !prev)
              }}
              aria-label="Wi-Fi"
              title={connectedNetwork.ssid}
            >
              {renderWifiSignal(connectedNetwork.signal)}
            </button>

            {isWifiMenuOpen ? (
              <section className="wifi-menu absolute top-[calc(100%+6px)] right-0 z-30 min-w-[280px] rounded-xl border p-1.5 text-sm shadow-[0_14px_34px_#00000080]">
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide opacity-70">{t('wifi.title')}</p>
                {wifiNetworks.map((network) => {
                  const isConnected = network.id === connectedNetworkId

                  return (
                    <button
                      key={network.id}
                      type="button"
                      className={`wifi-menu__item ${isConnected ? 'wifi-menu__item--connected' : ''}`}
                      onClick={() => handleWifiSelect(network)}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{network.ssid}</span>
                        <span className="block text-xs opacity-70">
                          {network.outOfRange
                            ? t('wifi.status.outOfRange')
                            : isConnected
                              ? t('wifi.status.connected')
                              : t('wifi.status.available')}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        {renderWifiSignal(network.signal, Boolean(network.outOfRange))}
                        {isConnected ? <span className="text-xs">✓</span> : null}
                      </span>
                    </button>
                  )
                })}
              </section>
            ) : null}
          </div>

          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      </header>

      <div
        ref={dockAreaRef}
        className={`mac-dock-zone absolute right-0 bottom-0 left-0 z-24 flex justify-center pb-[max(12px,var(--safe-area-bottom))] ${isDockVisible ? 'mac-dock-zone--visible' : ''}`}
        onPointerEnter={() => setIsDockVisible(true)}
      >
        <div className="relative">
          <footer
            className={`mac-dock relative flex items-end gap-2 rounded-2xl border border-white/35 px-3 py-2 ${isDockVisible ? 'mac-dock--visible' : 'mac-dock--hidden'}`}
            onPointerMove={(event) => updateDockScales(event.clientX)}
            onPointerLeave={() => updateDockScales(null)}
          >
            {dockPlugins.map((plugin, index) => {
              const state = windowsById[plugin.id]
              const isOpen = Boolean(state?.isOpen)
              const isMinimized = Boolean(state?.isMinimized)
              const style = {
                '--dock-scale': dockScales[index] ?? 1,
              } as CSSProperties

              return (
                <button
                  key={plugin.id}
                  ref={(element) => {
                    dockAppButtonRefs.current[index] = element
                  }}
                  className={`mac-dock__icon-btn ${isOpen && !isMinimized ? 'mac-dock__icon-btn--active' : ''}`}
                  onClick={() => onTaskbarAppClick(plugin.id, isOpen, isMinimized)}
                  aria-label={t(plugin.titleKey)}
                  title={t(plugin.titleKey)}
                  style={style}
                >
                  {renderAppIcon(resolveAppIcon(plugin.id, preferences), 'h-6.5 w-6.5 object-contain')}
                  {isOpen ? <span className="mac-dock__dot" aria-hidden="true" /> : null}
                </button>
              )
            })}
          </footer>
        </div>
      </div>
    </>
  )
}
