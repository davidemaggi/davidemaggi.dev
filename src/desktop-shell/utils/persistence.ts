import { APP_ICON_CHOICES_BY_ID } from '../../desktop/appIcons'
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '../../desktop/i18n'
import { DESKTOP_PLUGINS } from '../../desktop/plugins'
import type {
  AppId,
  ClockDateFormat,
  ClockHourFormat,
  DesktopIconSize,
  DesktopPreferences,
  Locale,
  ThemeMode,
  WallpaperPreset,
  WindowState,
} from '../../desktop/types'

export const DESKTOP_STATE_KEY = 'desktop.windows.v1'
export const LOCALE_STATE_KEY = 'desktop.locale.v1'
export const PREFERENCES_STATE_KEY = 'desktop.preferences.v1'

export const AVAILABLE_THEMES: readonly ThemeMode[] = ['dark', 'light'] as const
export const AVAILABLE_WALLPAPERS: readonly WallpaperPreset[] = [
  'aurora',
  'graphite',
  'cobalt',
  'ember',
  'prism',
  'pearl',
] as const
export const AVAILABLE_DESKTOP_ICON_SIZES: readonly DesktopIconSize[] = ['small', 'normal', 'large', 'xl'] as const
export const AVAILABLE_CLOCK_HOUR_FORMATS: readonly ClockHourFormat[] = ['locale', '12h', '24h'] as const
export const AVAILABLE_CLOCK_DATE_FORMATS: readonly ClockDateFormat[] = [
  'locale',
  'dd/mm/yyyy',
  'mm/dd/yyyy',
  'yyyy-mm-dd',
] as const

export const PLUGIN_IDS = Object.keys(DESKTOP_PLUGINS) as AppId[]

export const DEFAULT_PREFERENCES: DesktopPreferences = {
  theme: 'dark',
  wallpaper: 'aurora',
  appIcons: {},
  desktopIconSize: 'normal',
  clockHourFormat: 'locale',
  clockDateFormat: 'locale',
}

type PersistedDesktopState = {
  windows: Partial<Record<AppId, Partial<WindowState>>>
  zCounter: number
}

const sanitizeWindow = (
  fallback: WindowState,
  value: Partial<WindowState> | undefined,
): WindowState => {
  if (!value) return fallback

  return {
    ...fallback,
    isOpen: typeof value.isOpen === 'boolean' ? value.isOpen : fallback.isOpen,
    isMinimized:
      typeof value.isMinimized === 'boolean'
        ? value.isMinimized
        : fallback.isMinimized,
    isMaximized:
      typeof value.isMaximized === 'boolean'
        ? value.isMaximized
        : fallback.isMaximized,
    zIndex: typeof value.zIndex === 'number' ? value.zIndex : fallback.zIndex,
    x: typeof value.x === 'number' ? value.x : fallback.x,
    y: typeof value.y === 'number' ? value.y : fallback.y,
    width: typeof value.width === 'number' ? value.width : fallback.width,
    height: typeof value.height === 'number' ? value.height : fallback.height,
  }
}

export const createInitialWindows = (): Record<AppId, WindowState> => {
  return PLUGIN_IDS.reduce((result, id) => {
    result[id] = {
      id,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      ...DESKTOP_PLUGINS[id].defaultBounds,
    }
    return result
  }, {} as Record<AppId, WindowState>)
}

export const loadPersistedDesktopState = (): {
  windows: Record<AppId, WindowState>
  zCounter: number
} => {
  const defaults = createInitialWindows()

  if (typeof window === 'undefined') {
    return {
      windows: defaults,
      zCounter: 10,
    }
  }

  const raw = window.localStorage.getItem(DESKTOP_STATE_KEY)
  if (!raw) {
    return {
      windows: defaults,
      zCounter: 10,
    }
  }

  try {
    const parsed = JSON.parse(raw) as PersistedDesktopState
    const windows = PLUGIN_IDS.reduce((result, id) => {
      result[id] = sanitizeWindow(defaults[id], parsed?.windows?.[id])
      return result
    }, {} as Record<AppId, WindowState>)

    const persistedZ = parsed?.zCounter
    const computedZ = Math.max(...Object.values(windows).map((item) => item.zIndex), 10)

    return {
      windows,
      zCounter: typeof persistedZ === 'number' ? Math.max(persistedZ, computedZ) : computedZ,
    }
  } catch {
    return {
      windows: defaults,
      zCounter: 10,
    }
  }
}

export const loadPersistedLocale = (): Locale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  const raw = window.localStorage.getItem(LOCALE_STATE_KEY)
  if (!raw) return DEFAULT_LOCALE

  if (AVAILABLE_LOCALES.includes(raw as Locale)) {
    return raw as Locale
  }

  return DEFAULT_LOCALE
}

export const loadPersistedPreferences = (): DesktopPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES

  const raw = window.localStorage.getItem(PREFERENCES_STATE_KEY)
  if (!raw) return DEFAULT_PREFERENCES

  try {
    const parsed = JSON.parse(raw) as Partial<DesktopPreferences>
    const theme = AVAILABLE_THEMES.includes(parsed.theme as ThemeMode)
      ? (parsed.theme as ThemeMode)
      : DEFAULT_PREFERENCES.theme
    const wallpaper = AVAILABLE_WALLPAPERS.includes(parsed.wallpaper as WallpaperPreset)
      ? (parsed.wallpaper as WallpaperPreset)
      : DEFAULT_PREFERENCES.wallpaper
    const desktopIconSize = AVAILABLE_DESKTOP_ICON_SIZES.includes(parsed.desktopIconSize as DesktopIconSize)
      ? (parsed.desktopIconSize as DesktopIconSize)
      : DEFAULT_PREFERENCES.desktopIconSize
    const clockHourFormat = AVAILABLE_CLOCK_HOUR_FORMATS.includes(parsed.clockHourFormat as ClockHourFormat)
      ? (parsed.clockHourFormat as ClockHourFormat)
      : DEFAULT_PREFERENCES.clockHourFormat
    const clockDateFormat = AVAILABLE_CLOCK_DATE_FORMATS.includes(parsed.clockDateFormat as ClockDateFormat)
      ? (parsed.clockDateFormat as ClockDateFormat)
      : DEFAULT_PREFERENCES.clockDateFormat

    const rawIcons = parsed.appIcons
    const appIcons = PLUGIN_IDS.reduce((result, id) => {
      const iconId = rawIcons?.[id]
      if (iconId && APP_ICON_CHOICES_BY_ID[iconId]) {
        result[id] = iconId
      }
      return result
    }, {} as Partial<Record<AppId, string>>)

    return {
      theme,
      wallpaper,
      appIcons,
      desktopIconSize,
      clockHourFormat,
      clockDateFormat,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}
