import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { DesktopAppProps } from '../desktop/types'
import { DaveOsLogo } from '../desktop-shell/components/DaveOsLogo'
import { Icon } from '../desktop-shell/components/Icon'
import type { IconName } from '../desktop-shell/components/Icon'

type SettingsPage = 'theme' | 'localization' | 'softwareUpdate'
type UpdateState = 'idle' | 'checking' | 'done'

const PAGES: ReadonlyArray<{ id: SettingsPage; icon: IconName; labelKey: string }> = [
  { id: 'theme', icon: 'palette', labelKey: 'settings.nav.theme' },
  { id: 'localization', icon: 'globe', labelKey: 'settings.nav.localization' },
  { id: 'softwareUpdate', icon: 'sparkles', labelKey: 'settings.nav.softwareUpdate' },
]

const LOCALE_FLAGS: Record<string, string> = { it: '/flags/italy.svg', en: '/flags/uk.svg' }
const LOCALE_NAMES: Record<string, string> = { it: 'Italiano', en: 'English' }

const Group = ({ title, help, children }: { title: string; help?: string; children: ReactNode }) => (
  <section className="settings-group">
    <h3 className="settings-group__title">{title}</h3>
    {help ? <p className="settings-group__help">{help}</p> : null}
    <div className="mt-3">{children}</div>
  </section>
)

export function SettingsApp({ i18nApi, preferencesApi, launchIntent }: DesktopAppProps) {
  const [activePage, setActivePage] = useState<SettingsPage>('theme')
  const [appliedLaunchToken, setAppliedLaunchToken] = useState<number | null>(null)
  const [updateState, setUpdateState] = useState<UpdateState>('idle')
  const [lastCheck, setLastCheck] = useState(() => new Date())

  if (launchIntent?.appId === 'settings' && launchIntent.token !== appliedLaunchToken) {
    setAppliedLaunchToken(launchIntent.token)
    if (launchIntent.query === 'software-update') setActivePage('softwareUpdate')
  }

  useEffect(() => {
    if (updateState !== 'checking') return
    const timer = window.setTimeout(() => {
      setUpdateState('done')
      setLastCheck(new Date())
    }, 1600)
    return () => window.clearTimeout(timer)
  }, [updateState])

  if (!i18nApi || !preferencesApi) {
    return <div className="p-5 text-left text-(--window-text)">Settings APIs unavailable.</div>
  }

  const { t } = i18nApi
  const { preferences } = preferencesApi
  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'
  const dateLocale = i18nApi.locale === 'it' ? 'it-IT' : 'en-US'
  const activeMeta = PAGES.find((page) => page.id === activePage) ?? PAGES[0]

  return (
    <div className="@container flex h-full bg-(--app-surface-1) text-(--window-text)">
      <nav className="settings-nav hidden @2xl:flex" aria-label={t('settings.heading')}>
        <p className="settings-nav__heading">{t('settings.heading')}</p>
        {PAGES.map((page) => (
          <button
            key={page.id}
            type="button"
            className="settings-nav__item"
            aria-current={activePage === page.id ? 'page' : undefined}
            onClick={() => setActivePage(page.id)}
          >
            <span className={`settings-nav__icon settings-nav__icon--${page.id}`}>
              <Icon name={page.icon} className="h-4 w-4" />
            </span>
            {t(page.labelKey)}
          </button>
        ))}
      </nav>

      <section className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl px-5 py-5 @2xl:px-7">
          <div className="segmented mb-4 flex w-full @2xl:hidden" role="tablist" aria-label={t('settings.heading')}>
            {PAGES.map((page) => (
              <button
                key={page.id}
                type="button"
                role="tab"
                aria-selected={activePage === page.id}
                className="segmented__item min-w-0 flex-1 justify-center"
                aria-label={t(page.labelKey)}
                onClick={() => setActivePage(page.id)}
              >
                <Icon name={page.icon} className="h-3.5 w-3.5" />
                <span className="hidden truncate @lg:inline">{t(page.labelKey)}</span>
              </button>
            ))}
          </div>

          <h2 className="app-header__title">{t(activeMeta.labelKey)}</h2>
          <p className="app-header__subtitle mb-5">{t(`settings.page.${activePage}.subtitle`)}</p>

          {activePage === 'theme' ? (
            <div className="flex flex-col gap-4">
              <Group title={t('settings.theme.label')} help={t('settings.theme.help')}>
                <div className="grid grid-cols-2 gap-3">
                  {preferencesApi.themes.map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      className="settings-option"
                      aria-pressed={preferences.theme === theme}
                      onClick={() => preferencesApi.setTheme(theme)}
                    >
                      <span className={`theme-preview theme-preview--${theme}`} aria-hidden="true">
                        <span className="theme-preview__bar" />
                        <span className="theme-preview__window" />
                      </span>
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Icon name={theme === 'dark' ? 'moon' : 'sun'} className="h-4 w-4" />
                        {t(`theme.${theme}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </Group>

              <Group title={t('settings.wallpaper.label')} help={t('settings.wallpaper.help')}>
                <div className="grid grid-cols-2 gap-3 @lg:grid-cols-3">
                  {preferencesApi.wallpapers.map((wallpaper) => (
                    <button
                      key={wallpaper}
                      type="button"
                      className="settings-option"
                      aria-pressed={preferences.wallpaper === wallpaper}
                      onClick={() => preferencesApi.setWallpaper(wallpaper)}
                    >
                      <span
                        className={`wallpaper-swatch wallpaper-swatch--${wallpaper} desktop-shell--wallpaper-${wallpaper}`}
                        aria-hidden="true"
                      />
                      <span className="flex items-center justify-between gap-2 text-sm">
                        {t(`wallpaper.${wallpaper}`)}
                        {preferences.wallpaper === wallpaper ? <Icon name="check" className="h-4 w-4 text-(--accent)" /> : null}
                      </span>
                    </button>
                  ))}
                </div>
              </Group>

              <Group title={t('settings.desktopIconSize.label')} help={t('settings.desktopIconSize.help')}>
                <div className="segmented flex w-full" role="radiogroup" aria-label={t('settings.desktopIconSize.label')}>
                  {preferencesApi.desktopIconSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={preferences.desktopIconSize === size}
                      aria-pressed={preferences.desktopIconSize === size}
                      className="segmented__item flex-1 justify-center"
                      onClick={() => preferencesApi.setDesktopIconSize(size)}
                    >
                      {t(`settings.desktopIconSize.${size}`)}
                    </button>
                  ))}
                </div>
              </Group>
            </div>
          ) : null}

          {activePage === 'localization' ? (
            <div className="flex flex-col gap-4">
              <Group title={t('settings.language.label')} help={t('settings.language.help')}>
                <div className="grid grid-cols-2 gap-3">
                  {i18nApi.locales.map((locale) => (
                    <button
                      key={locale}
                      type="button"
                      className="settings-option flex-row! items-center gap-3"
                      aria-pressed={i18nApi.locale === locale}
                      onClick={() => i18nApi.setLocale(locale)}
                    >
                      <img src={LOCALE_FLAGS[locale]} alt="" className="h-6 w-9 rounded-[4px] object-cover" />
                      <span className="flex-1 text-left text-sm font-medium">{LOCALE_NAMES[locale] ?? locale}</span>
                      {i18nApi.locale === locale ? <Icon name="check" className="h-4 w-4 text-(--accent)" /> : null}
                    </button>
                  ))}
                </div>
              </Group>

              <Group title={t('settings.clock.hourFormat.label')} help={t('settings.clock.hourFormat.help')}>
                <div className="segmented flex w-full flex-wrap" role="radiogroup" aria-label={t('settings.clock.hourFormat.label')}>
                  {preferencesApi.clockHourFormats.map((format) => (
                    <button
                      key={format}
                      type="button"
                      role="radio"
                      aria-checked={preferences.clockHourFormat === format}
                      aria-pressed={preferences.clockHourFormat === format}
                      className="segmented__item flex-1 justify-center"
                      onClick={() => preferencesApi.setClockHourFormat(format)}
                    >
                      {t(`settings.clock.hourFormat.${format}`)}
                    </button>
                  ))}
                </div>
              </Group>

              <Group title={t('settings.clock.dateFormat.label')} help={t('settings.clock.dateFormat.help')}>
                <div className="segmented flex w-full flex-wrap" role="radiogroup" aria-label={t('settings.clock.dateFormat.label')}>
                  {preferencesApi.clockDateFormats.map((format) => (
                    <button
                      key={format}
                      type="button"
                      role="radio"
                      aria-checked={preferences.clockDateFormat === format}
                      aria-pressed={preferences.clockDateFormat === format}
                      className="segmented__item flex-1 justify-center"
                      onClick={() => preferencesApi.setClockDateFormat(format)}
                    >
                      {t(`settings.clock.dateFormat.${format}`)}
                    </button>
                  ))}
                </div>
              </Group>
            </div>
          ) : null}

          {activePage === 'softwareUpdate' ? (
            <section className="settings-update">
              <div className="settings-update__logo" aria-hidden="true">
                <DaveOsLogo className="h-9 w-9" />
              </div>
              <p className="m-0 font-display text-xl font-semibold tracking-tight">DaveOS {version}</p>
              <p className="m-0 mt-1 text-sm text-(--app-muted)" aria-live="polite">
                {updateState === 'checking'
                  ? t('settings.update.checking')
                  : updateState === 'done'
                    ? t('settings.update.none')
                    : t('settings.page.softwareUpdate.latest')}
              </p>
              <button
                type="button"
                className="hero-action hero-action--primary mt-5 px-5 text-sm"
                disabled={updateState === 'checking'}
                onClick={() => setUpdateState('checking')}
              >
                <Icon name="refresh" className={`h-4 w-4 ${updateState === 'checking' ? 'animate-spin' : ''}`} />
                {t('settings.update.check')}
              </button>
              <p className="m-0 mt-4 text-xs text-(--app-muted)">
                {t('settings.page.softwareUpdate.lastCheck')}: {lastCheck.toLocaleString(dateLocale)}
              </p>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  )
}
