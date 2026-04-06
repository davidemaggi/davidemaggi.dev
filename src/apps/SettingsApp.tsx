import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIsPhone } from '../mobile-shell/hooks/useIsPhone'
import type {
  ClockDateFormat,
  ClockHourFormat,
  DesktopAppProps,
  DesktopIconSize,
  Locale,
  ThemeMode,
  WallpaperPreset,
} from '../desktop/types'
import { resolveAssetPath } from '../desktop/utils/assetPath'

type SettingsPage = 'theme' | 'localization' | 'softwareUpdate'

const ICON_SIZE_PREVIEW_CLASSES: Record<DesktopIconSize, { icon: string; label: string }> = {
  small: { icon: 'h-8 w-8', label: 'text-[11px]' },
  normal: { icon: 'h-10 w-10', label: 'text-xs' },
  large: { icon: 'h-12 w-12', label: 'text-sm' },
  xl: { icon: 'h-14 w-14', label: 'text-[15px]' },
}

export function SettingsApp({ i18nApi, preferencesApi, launchIntent }: DesktopAppProps) {
  const [activePage, setActivePage] = useState<SettingsPage>('theme')
  const [isNavOpen, setIsNavOpen] = useState(false)
  const isPhone = useIsPhone()

  useEffect(() => {
    if (launchIntent?.appId !== 'settings') return
    if (launchIntent.query === 'software-update') {
      setActivePage('softwareUpdate')
      setIsNavOpen(false)
    }
  }, [launchIntent])

  if (!i18nApi || !preferencesApi) {
    return <div className="p-5 text-left text-(--window-text)">Settings APIs unavailable.</div>
  }

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18nApi.setLocale(event.target.value as Locale)
  }

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    preferencesApi.setTheme(event.target.value as ThemeMode)
  }

  const handleWallpaperChange = (event: ChangeEvent<HTMLSelectElement>) => {
    preferencesApi.setWallpaper(event.target.value as WallpaperPreset)
  }

  const handleDesktopIconSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    preferencesApi.setDesktopIconSize(event.target.value as DesktopIconSize)
  }

  const handleClockHourFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    preferencesApi.setClockHourFormat(event.target.value as ClockHourFormat)
  }

  const handleClockDateFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    preferencesApi.setClockDateFormat(event.target.value as ClockDateFormat)
  }
  return (
    <div className="relative flex h-full bg-(--app-surface-1) text-(--window-text)">
      {isPhone && isNavOpen ? (
        <button
          type="button"
          className="absolute inset-0 z-10 bg-black/30"
          aria-label={i18nApi.t('settings.nav.close')}
          onClick={() => setIsNavOpen(false)}
        />
      ) : null}

      <aside className={`${isPhone ? 'absolute inset-y-0 left-0 z-20 transition-transform duration-200' : 'relative shrink-0'} w-64 border-r border-(--app-border) bg-(--app-surface-2) p-3 ${isPhone ? (isNavOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">{i18nApi.t('settings.heading')}</h1>
          <button
            type="button"
            className={`rounded border border-(--app-border) px-2 py-1 text-xs ${isPhone ? '' : 'hidden'}`}
            onClick={() => setIsNavOpen(false)}
          >
            {i18nApi.t('settings.nav.close')}
          </button>
        </div>
        <nav className="space-y-1" aria-label={i18nApi.t('settings.heading')}>
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm ${activePage === 'theme' ? 'bg-(--app-surface-3) font-semibold' : 'hover:bg-(--app-surface-3)'}`}
            onClick={() => {
              setActivePage('theme')
              setIsNavOpen(false)
            }}
          >
            <img src={resolveAssetPath('/icons/gear.svg')} alt="Theme section icon" className="h-4 w-4 object-contain" />
            {i18nApi.t('settings.nav.theme')}
          </button>
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm ${activePage === 'localization' ? 'bg-(--app-surface-3) font-semibold' : 'hover:bg-(--app-surface-3)'}`}
            onClick={() => {
              setActivePage('localization')
              setIsNavOpen(false)
            }}
          >
            <img src={resolveAssetPath('/icons/translate.svg')} alt="Localization section icon" className="h-4 w-4 object-contain" />
            {i18nApi.t('settings.nav.localization')}
          </button>
          <button
            type="button"
            className={`flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm ${activePage === 'softwareUpdate' ? 'bg-(--app-surface-3) font-semibold' : 'hover:bg-(--app-surface-3)'}`}
            onClick={() => {
              setActivePage('softwareUpdate')
              setIsNavOpen(false)
            }}
          >
            <img src={resolveAssetPath('/icons/spark.svg')} alt="Software update section icon" className="h-4 w-4 object-contain" />
            {i18nApi.t('settings.nav.softwareUpdate')}
          </button>
        </nav>
      </aside>

      <section className="min-w-0 flex-1 overflow-auto p-5 text-left">
        <div className={`mb-3 ${isPhone ? '' : 'hidden'}`}>
          <button
            type="button"
            className="rounded border border-(--app-border) bg-(--app-surface-2) px-2.5 py-1.5 text-xs"
            onClick={() => setIsNavOpen(true)}
          >
            {i18nApi.t('settings.nav.open')}
          </button>
        </div>

        {activePage === 'theme' ? (
          <>
            <h2 className="mb-1 text-xl font-semibold">{i18nApi.t('settings.page.theme.title')}</h2>
            <p className="mb-4 text-(--app-muted)">{i18nApi.t('settings.page.theme.subtitle')}</p>

            <label className="mb-3 flex max-w-64 flex-col gap-1.5">
              <span>{i18nApi.t('settings.theme.label')}</span>
              <select
                className="h-8.5 rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2.5 text-(--window-text)"
                value={preferencesApi.preferences.theme}
                onChange={handleThemeChange}
              >
                {preferencesApi.themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {i18nApi.t(`theme.${theme}`)}
                  </option>
                ))}
              </select>
            </label>
            <p>{i18nApi.t('settings.theme.help')}</p>

            <label className="mb-3 mt-4 flex max-w-64 flex-col gap-1.5">
              <span>{i18nApi.t('settings.wallpaper.label')}</span>
              <select
                className="h-8.5 rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2.5 text-(--window-text)"
                value={preferencesApi.preferences.wallpaper}
                onChange={handleWallpaperChange}
              >
                {preferencesApi.wallpapers.map((wallpaper) => (
                  <option key={wallpaper} value={wallpaper}>
                    {i18nApi.t(`wallpaper.${wallpaper}`)}
                  </option>
                ))}
              </select>
            </label>
            <p>{i18nApi.t('settings.wallpaper.help')}</p>

            <label className="mb-3 mt-4 flex max-w-64 flex-col gap-1.5">
              <span>{i18nApi.t('settings.desktopIconSize.label')}</span>
              <select
                className="h-8.5 rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2.5 text-(--window-text)"
                value={preferencesApi.preferences.desktopIconSize}
                onChange={handleDesktopIconSizeChange}
              >
                {preferencesApi.desktopIconSizes.map((size) => (
                  <option key={size} value={size}>
                    {i18nApi.t(`settings.desktopIconSize.${size}`)}
                  </option>
                ))}
              </select>
            </label>
            <p>{i18nApi.t('settings.desktopIconSize.help')}</p>

            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5">
              {preferencesApi.desktopIconSizes.map((size) => {
                const previewClasses = ICON_SIZE_PREVIEW_CLASSES[size]
                const isActive = preferencesApi.preferences.desktopIconSize === size

                return (
                  <button
                    type="button"
                    key={size}
                    className={`rounded-lg border p-3 text-left transition ${
                      isActive
                        ? 'border-blue-500 bg-blue-500/15'
                        : 'border-(--app-border) bg-(--app-surface-2) hover:bg-(--app-surface-3)'
                    }`}
                    onClick={() => preferencesApi.setDesktopIconSize(size)}
                    aria-pressed={isActive}
                  >
                    <span className="mb-2 flex items-center justify-between gap-2 text-xs text-(--app-muted)">
                      <span>{i18nApi.t(`settings.desktopIconSize.${size}`)}</span>
                      {isActive ? (
                        <span className="rounded-full border border-blue-400/60 bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-200">
                          {i18nApi.t('settings.desktopIconSize.active')}
                        </span>
                      ) : null}
                    </span>
                    <span className="flex w-full flex-col items-center gap-1.5 rounded-md border border-transparent p-1 text-(--window-text)">
                      <span className={`grid place-items-center ${previewClasses.icon}`}>
                        <img src={resolveAssetPath('/icons/about.svg')} alt="Desktop icon preview" className="h-full w-full object-contain" />
                      </span>
                      <span className={`max-w-full break-words text-center leading-tight ${previewClasses.label}`}>
                        {i18nApi.t('app.about.title')}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        ) : activePage === 'localization' ? (
          <>
            <h2 className="mb-1 text-xl font-semibold">{i18nApi.t('settings.page.localization.title')}</h2>
            <p className="mb-4 text-(--app-muted)">{i18nApi.t('settings.page.localization.subtitle')}</p>

            <label className="mb-3 flex max-w-64 flex-col gap-1.5">
              <span>{i18nApi.t('settings.language.label')}</span>
              <select
                className="h-8.5 rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2.5 text-(--window-text)"
                value={i18nApi.locale}
                onChange={handleLocaleChange}
              >
                {i18nApi.locales.map((locale) => (
                  <option key={locale} value={locale}>
                    {locale.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
            <p>{i18nApi.t('settings.language.help')}</p>

            <label className="mb-3 mt-4 flex max-w-64 flex-col gap-1.5">
              <span>{i18nApi.t('settings.clock.hourFormat.label')}</span>
              <select
                className="h-8.5 rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2.5 text-(--window-text)"
                value={preferencesApi.preferences.clockHourFormat}
                onChange={handleClockHourFormatChange}
              >
                {preferencesApi.clockHourFormats.map((format) => (
                  <option key={format} value={format}>
                    {i18nApi.t(`settings.clock.hourFormat.${format}`)}
                  </option>
                ))}
              </select>
            </label>
            <p>{i18nApi.t('settings.clock.hourFormat.help')}</p>

            <label className="mb-3 mt-4 flex max-w-64 flex-col gap-1.5">
              <span>{i18nApi.t('settings.clock.dateFormat.label')}</span>
              <select
                className="h-8.5 rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2.5 text-(--window-text)"
                value={preferencesApi.preferences.clockDateFormat}
                onChange={handleClockDateFormatChange}
              >
                {preferencesApi.clockDateFormats.map((format) => (
                  <option key={format} value={format}>
                    {i18nApi.t(`settings.clock.dateFormat.${format}`)}
                  </option>
                ))}
              </select>
            </label>
            <p>{i18nApi.t('settings.clock.dateFormat.help')}</p>
          </>
        ) : (
          <>
            <h2 className="mb-1 text-xl font-semibold">{i18nApi.t('settings.page.softwareUpdate.title')}</h2>
            <p className="mb-4 text-(--app-muted)">{i18nApi.t('settings.page.softwareUpdate.subtitle')}</p>

            <div className="max-w-xl rounded-xl border border-(--app-border) bg-(--app-surface-2) p-4">
              <div className="flex items-center gap-3">
                <img src={resolveAssetPath('/icons/daveos.svg')} alt="DaveOS icon" className="h-10 w-10 rounded-lg object-contain" />
                <div>
                  <p className="m-0 font-semibold">DaveOS {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'}</p>
                  <p className="m-0 text-sm text-(--app-muted)">{i18nApi.t('settings.page.softwareUpdate.latest')}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-(--app-border) bg-(--app-surface-1) p-3 text-sm">
                <span>{i18nApi.t('settings.page.softwareUpdate.lastCheck')}</span>
                <strong>{new Date().toLocaleString(i18nApi.locale === 'it' ? 'it-IT' : 'en-US')}</strong>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
