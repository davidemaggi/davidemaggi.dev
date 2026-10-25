import { AboutApp } from '../apps/AboutApp'
import { ArkanoidApp } from '../apps/ArkanoidApp'
import { AppStoreApp } from '../apps/AppStoreApp'
import { CalendarApp } from '../apps/CalendarApp'
import { CertManagerApp } from '../apps/CertManagerApp'
import { SettingsApp } from '../apps/SettingsApp'
import { TerminalApp } from '../apps/TerminalApp'
import type { AppId, DesktopPlugin } from './types'

export const DESKTOP_PLUGINS: Record<AppId, DesktopPlugin> = {
  about: {
    id: 'about',
    titleKey: 'app.about.title',
    icon: {
      kind: 'image',
      src: '/icons/apps/profile.svg',
      alt: 'Profile icon',
      bare: true,
    },
    defaultBounds: {
      x: 170,
      y: 60,
      width: 920,
      height: 620,
    },
    Component: AboutApp,
  },
  calendar: {
    id: 'calendar',
    titleKey: 'app.calendar.title',
    icon: {
      kind: 'calendar',
    },
    defaultBounds: {
      x: 130,
      y: 56,
      width: 960,
      height: 640,
    },
    Component: CalendarApp,
  },
  certManager: {
    id: 'certManager',
    titleKey: 'app.certManager.title',
    icon: {
      kind: 'image',
      src: '/icons/apps/certificates.svg',
      alt: 'Certifications icon',
      bare: true,
    },
    defaultBounds: {
      x: 150,
      y: 64,
      width: 940,
      height: 620,
    },
    Component: CertManagerApp,
  },
  terminal: {
    id: 'terminal',
    titleKey: 'app.terminal.title',
    icon: {
      kind: 'image',
      src: '/icons/apps/terminal.svg',
      alt: 'Terminal icon',
      bare: true,
    },
    defaultBounds: {
      x: 92,
      y: 80,
      width: 820,
      height: 500,
    },
    Component: TerminalApp,
  },
  help: {
    id: 'help',
    titleKey: 'app.appStore.title',
    icon: {
      kind: 'image',
      src: '/icons/apps/appstore.svg',
      alt: 'App Store icon',
      bare: true,
    },
    defaultBounds: {
      x: 200,
      y: 64,
      width: 880,
      height: 640,
    },
    Component: AppStoreApp,
  },
  settings: {
    id: 'settings',
    titleKey: 'app.settings.title',
    icon: {
      kind: 'image',
      src: '/icons/apps/settings.svg',
      alt: 'Settings icon',
      bare: true,
    },
    defaultBounds: {
      x: 220,
      y: 70,
      width: 860,
      height: 620,
    },
    Component: SettingsApp,
  },
  arkanoid: {
    id: 'arkanoid',
    titleKey: 'app.arkanoid.title',
    icon: {
      kind: 'image',
      src: '/icons/apps/gitout.svg',
      alt: 'GitOut icon',
      bare: true,
    },
    defaultBounds: {
      x: 260,
      y: 56,
      width: 700,
      height: 720,
    },
    Component: ArkanoidApp,
  },
}
