import { AboutApp } from '../apps/AboutApp'
import { CalendarApp } from '../apps/CalendarApp'
import { EasterEggApp } from '../apps/EasterEggApp'
import { SettingsApp } from '../apps/SettingsApp'
import { SkillsApp } from '../apps/SkillsApp'
import { TerminalApp } from '../apps/TerminalApp'
import type { AppId, DesktopPlugin } from './types'

export const DESKTOP_PLUGINS: Record<AppId, DesktopPlugin> = {
  terminal: {
    id: 'terminal',
    titleKey: 'app.terminal.title',
    icon: {
      kind: 'text',
      value: '>_',
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
  settings: {
    id: 'settings',
    titleKey: 'app.settings.title',
    icon: {
      kind: 'image',
      src: '/favicon.svg',
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
  skills: {
    id: 'skills',
    titleKey: 'app.skills.title',
    icon: {
      kind: 'image',
      src: '/icons/skills.svg',
      alt: 'Skills icon',
    },
    defaultBounds: {
      x: 140,
      y: 90,
      width: 760,
      height: 460,
    },
    Component: SkillsApp,
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


