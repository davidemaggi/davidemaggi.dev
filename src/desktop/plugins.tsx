import { AboutApp } from '../apps/AboutApp'
import { AppStoreApp } from '../apps/AppStoreApp'
import { CalendarApp } from '../apps/CalendarApp'
import { CertManagerApp } from '../apps/CertManagerApp'
import { EasterEggApp } from '../apps/EasterEggApp'
import { SettingsApp } from '../apps/SettingsApp'
import { TerminalApp } from '../apps/TerminalApp'
import type { AppId, DesktopPlugin } from './types'

export const DESKTOP_PLUGINS: Record<AppId, DesktopPlugin> = {
  terminal: {
    id: 'terminal',
    titleKey: 'app.terminal.title',
    icon: {
      kind: 'image',
      src: '/icons/terminal.svg',
      alt: 'About icon',
    },
    defaultBounds: {
      x: 92,
      y: 80,
      width: 700,
      height: 430,
    },
    Component: TerminalApp,
  },
  about: {
    id: 'about',
    titleKey: 'app.about.title',
    icon: {
      kind: 'image',
      src: '/icons/about.svg',
      alt: 'About icon',
    },
    defaultBounds: {
      x: 180,
      y: 120,
      width: 760,
      height: 500,
    },
    Component: AboutApp,
  },
  help: {
    id: 'help',
    titleKey: 'app.appStore.title',
    icon: {
      kind: 'image',
      src: '/icons/app-store.svg',
      alt: 'App Store icon',
    },
    defaultBounds: {
      x: 220,
      y: 100,
      width: 760,
      height: 500,
    },
    Component: AppStoreApp,
  },
  settings: {
    id: 'settings',
    titleKey: 'app.settings.title',
    icon: {
      kind: 'image',
      src: '/icons/gear.svg',
      alt: 'Settings icon',
    },
    defaultBounds: {
      x: 240,
      y: 140,
      width: 480,
      height: 320,
    },
    Component: SettingsApp,
  },
  calendar: {
    id: 'calendar',
    titleKey: 'app.calendar.title',
    icon: {
      kind: 'image',
      src: '/icons/calendar.svg',
      alt: 'Calendar icon',
    },
    defaultBounds: {
      x: 120,
      y: 70,
      width: 860,
      height: 520,
    },
    Component: CalendarApp,
  },
  certManager: {
    id: 'certManager',
    titleKey: 'app.certManager.title',
    icon: {
      kind: 'image',
      src: '/icons/certificate.svg',
      alt: 'Certificate manager icon',
    },
    defaultBounds: {
      x: 150,
      y: 80,
      width: 900,
      height: 540,
    },
    Component: CertManagerApp,
  },
  easterEgg: {
    id: 'easterEgg',
    titleKey: 'app.easter.title',
    hidden: true,
    icon: {
      kind: 'text',
      value: '*',
    },
    defaultBounds: {
      x: 280,
      y: 110,
      width: 520,
      height: 320,
    },
    Component: EasterEggApp,
  },
}


