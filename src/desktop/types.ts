import type { ComponentType } from 'react'

export type AppId = 'terminal' | 'about' | 'help' | 'settings' | 'calendar' | 'certManager' | 'arkanoid' | 'easterEgg'
export type Locale = 'it' | 'en'
export type ThemeMode = 'dark' | 'light'
export type WallpaperPreset =
  | 'aurora'
  | 'graphite'
  | 'cobalt'
  | 'ember'
  | 'prism'
  | 'pearl'
export type DesktopIconSize = 'small' | 'normal' | 'large' | 'xl'
export type ClockHourFormat = 'locale' | '12h' | '24h'
export type ClockDateFormat = 'locale' | 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd'

export type WindowState = {
  id: AppId
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  x: number
  y: number
  width: number
  height: number
}

export type DesktopAppStatus = {
  id: AppId
  title: string
  isOpen: boolean
  isMinimized: boolean
}

export type DesktopCommandApi = {
  openApp: (name: string, query?: string) => boolean
  minimizeApp: (name: string) => boolean
  closeApp: (name: string) => boolean
  listApps: () => DesktopAppStatus[]
}

export type DesktopLaunchIntent = {
  appId: AppId
  query?: string
  token: number
}

export type DesktopI18nApi = {
  locale: Locale
  locales: readonly Locale[]
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string>) => string
}

export type DesktopPreferences = {
  theme: ThemeMode
  wallpaper: WallpaperPreset
  appIcons: Partial<Record<AppId, string>>
  desktopIconSize: DesktopIconSize
  clockHourFormat: ClockHourFormat
  clockDateFormat: ClockDateFormat
}

export type AppIconChoiceInfo = {
  id: string
  labelKey: string
  icon: AppIcon
}

export type DesktopPreferencesApi = {
  preferences: DesktopPreferences
  themes: readonly ThemeMode[]
  wallpapers: readonly WallpaperPreset[]
  desktopIconSizes: readonly DesktopIconSize[]
  clockHourFormats: readonly ClockHourFormat[]
  clockDateFormats: readonly ClockDateFormat[]
  appIconChoices: readonly AppIconChoiceInfo[]
  setTheme: (theme: ThemeMode) => void
  setWallpaper: (wallpaper: WallpaperPreset) => void
  setDesktopIconSize: (size: DesktopIconSize) => void
  setClockHourFormat: (format: ClockHourFormat) => void
  setClockDateFormat: (format: ClockDateFormat) => void
  setAppIcon: (appId: AppId, iconId: string | null) => void
}

export type DesktopAppProps = {
  desktopApi?: DesktopCommandApi
  i18nApi?: DesktopI18nApi
  preferencesApi?: DesktopPreferencesApi
  launchIntent?: DesktopLaunchIntent | null
}

export type AppIcon =
  | {
      kind: 'text'
      value: string
    }
  | {
      kind: 'image'
      src: string
      alt: string
    }

export type DesktopPlugin = {
  id: AppId
  titleKey: string
  icon: AppIcon
  hidden?: boolean
  defaultBounds: {
    x: number
    y: number
    width: number
    height: number
  }
  Component: ComponentType<DesktopAppProps>
}
