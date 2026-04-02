import type { Locale } from '../../types'
import type { CalendarTag, CalendarTagRegistryEntry } from './types'

const calendarTagRegistry: CalendarTagRegistryEntry[] = [
  {
    id: 'frontend',
    labels: { it: 'Frontend', en: 'Frontend' },
    icon: { src: '/icons/calendar/frontend.svg', alt: 'Frontend tag icon' },
  },
  {
    id: 'react',
    labels: { it: 'React', en: 'React' },
    icon: { src: '/icons/skills/react-architecture.svg', alt: 'React tag icon' },
  },
  {
    id: 'accessibility',
    labels: { it: 'Accessibilita', en: 'Accessibility' },
    icon: { src: '/icons/skills/ui-ux-craft.svg', alt: 'Accessibility tag icon' },
  },
  {
    id: 'fullstack',
    labels: { it: 'Full Stack', en: 'Full Stack' },
    icon: { src: '/icons/calendar/fullstack.svg', alt: 'Full stack tag icon' },
  },
  {
    id: 'api',
    labels: { it: 'API', en: 'API' },
    icon: { src: '/icons/terminal.svg', alt: 'API tag icon' },
  },
  {
    id: 'ux',
    labels: { it: 'UX', en: 'UX' },
    icon: { src: '/icons/skills/ui-ux-craft.svg', alt: 'UX tag icon' },
  },
  {
    id: 'lead',
    labels: { it: 'Leadership', en: 'Lead' },
    icon: { src: '/icons/spark.svg', alt: 'Lead tag icon' },
  },
  {
    id: 'architecture',
    labels: { it: 'Architettura', en: 'Architecture' },
    icon: { src: '/icons/gear.svg', alt: 'Architecture tag icon' },
  },
  {
    id: 'design-system',
    labels: { it: 'Design System', en: 'Design System' },
    icon: { src: '/icons/skills/typescript-engineering.svg', alt: 'Design system tag icon' },
  },
]

export const getCalendarTags = (locale: Locale): CalendarTag[] => {
  return calendarTagRegistry.map((tag) => ({
    id: tag.id,
    label: tag.labels[locale] ?? tag.labels.it,
    icon: tag.icon,
  }))
}

export const getCalendarTagById = (locale: Locale, tagId: string): CalendarTag | null => {
  const tag = calendarTagRegistry.find((entry) => entry.id === tagId)
  if (!tag) return null
  return {
    id: tag.id,
    label: tag.labels[locale] ?? tag.labels.it,
    icon: tag.icon,
  }
}

