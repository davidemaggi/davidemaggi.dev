import type { Locale } from '../../types'
import enCalendarEvents from './en'
import itCalendarEvents from './it'
export { getCalendarTagById, getCalendarTags } from './tags'
import type { WorkExperienceEvent } from './types'

/** Primo anno visualizzato nella timeline Gantt */
export const CALENDAR_START_YEAR = 2014

const eventsByLocale: Record<Locale, WorkExperienceEvent[]> = {
  it: itCalendarEvents,
  en: enCalendarEvents,
}

export const getCalendarEvents = (locale: Locale): WorkExperienceEvent[] => {
  return eventsByLocale[locale] ?? eventsByLocale.it
}

