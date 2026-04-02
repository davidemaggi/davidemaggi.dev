import type { ChangeEvent } from 'react'
import type {
  AppIcon,
  ClockDateFormat,
  ClockHourFormat,
  DesktopAppProps,
  DesktopIconSize,
  Locale,
  ThemeMode,
  WallpaperPreset,
} from '../desktop/types'

const renderIcon = (icon: AppIcon, className: string) => {
  if (icon.kind === 'image') {
    return <img className={className} src={icon.src} alt={icon.alt} />
  }

  return <span className={className}>{icon.value}</span>
}

const ICON_SIZE_PREVIEW_CLASSES: Record<DesktopIconSize, { icon: string; label: string }> = {
  small: { icon: 'h-8 w-8', label: 'text-[11px]' },
  normal: { icon: 'h-10 w-10', label: 'text-xs' },
  large: { icon: 'h-12 w-12', label: 'text-sm' },
  xl: { icon: 'h-14 w-14', label: 'text-[15px]' },
}

export function SettingsApp({ desktopApi, i18nApi, preferencesApi }: DesktopAppProps) {
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

  const apps = desktopApi?.listApps() ?? []
  const previewSourceIcon = preferencesApi.appIconChoices[0]?.icon ?? { kind: 'text', value: 'Aa' }

  return (
    <div className="p-5 text-left text-(--window-text)">
      <h1 className="mb-3.5 text-[22px] font-semibold">{i18nApi.t('settings.heading')}</h1>

      <label className="mb-3 flex max-w-55 flex-col gap-1.5">
        <span>{i18nApi.t('settings.language.label')}</span>
        <select
          className="h-8.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-2) px-2.5 text-(--window-text)"
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

      <label className="mb-3 mt-4 flex max-w-55 flex-col gap-1.5">
        <span>{i18nApi.t('settings.theme.label')}</span>
        <select
          className="h-8.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-2) px-2.5 text-(--window-text)"
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

      <label className="mb-3 mt-4 flex max-w-55 flex-col gap-1.5">
        <span>{i18nApi.t('settings.wallpaper.label')}</span>
        <select
          className="h-8.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-2) px-2.5 text-(--window-text)"
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

      <label className="mb-3 mt-4 flex max-w-55 flex-col gap-1.5">
        <span>{i18nApi.t('settings.desktopIconSize.label')}</span>
        <select
          className="h-8.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-2) px-2.5 text-(--window-text)"
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

      <label className="mb-3 mt-4 flex max-w-55 flex-col gap-1.5">
        <span>{i18nApi.t('settings.clock.hourFormat.label')}</span>
        <select
          className="h-8.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-2) px-2.5 text-(--window-text)"
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

      <label className="mb-3 mt-4 flex max-w-55 flex-col gap-1.5">
        <span>{i18nApi.t('settings.clock.dateFormat.label')}</span>
        <select
          className="h-8.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-2) px-2.5 text-(--window-text)"
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
                  : 'border-[var(--app-border)] bg-(--app-surface-2) hover:bg-(--app-surface-3)'
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
                  {renderIcon(previewSourceIcon, 'h-full w-full object-contain text-center leading-none')}
                </span>
                <span className={`max-w-full break-words text-center leading-tight ${previewClasses.label}`}>
                  {i18nApi.t('app.about.title')}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <h2 className="mb-2 mt-[18px] text-lg font-semibold">{i18nApi.t('settings.icons.heading')}</h2>
      <p>{i18nApi.t('settings.icons.help')}</p>

      <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {apps.map((app) => {
          const selectedIconId = preferencesApi.preferences.appIcons[app.id] ?? ''
          const previewIcon = selectedIconId
            ? preferencesApi.appIconChoices.find((choice) => choice.id === selectedIconId)?.icon
            : null

          return (
            <label
              className="flex flex-col gap-1.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-2) p-2.5"
              key={app.id}
            >
              <span>{app.title}</span>
              <div className="grid h-10.5 w-10.5 place-items-center rounded-[10px] border border-[var(--app-border)] bg-(--app-surface-1)">
                {previewIcon ? (
                  renderIcon(previewIcon, 'h-6 w-6 object-contain')
                ) : (
                  <span className="text-xs text-(--app-muted)">Aa</span>
                )}
              </div>
              <select
                className="h-8.5 rounded-lg border border-[var(--app-border)] bg-(--app-surface-1) px-2.5 text-(--window-text)"
                value={selectedIconId}
                onChange={(event) =>
                  preferencesApi.setAppIcon(
                    app.id,
                    event.target.value || null,
                  )
                }
              >
                <option value="">{i18nApi.t('settings.icons.default')}</option>
                {preferencesApi.appIconChoices.map((choice) => (
                  <option key={choice.id} value={choice.id}>
                    {i18nApi.t(choice.labelKey)}
                  </option>
                ))}
              </select>
            </label>
          )
        })}
      </div>

      <p className="mt-3">{i18nApi.t('settings.more')}</p>
    </div>
  )
}
