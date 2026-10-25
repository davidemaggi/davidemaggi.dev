import { useMemo } from 'react'
import { getCalendarEvents, getCalendarTagById } from '../../desktop/resources/calendar'
import { getCertificateFolders } from '../../desktop/resources/certManager'
import type { Locale } from '../../desktop/types'

/** Derives the headline numbers shown on the desktop hero and the mobile profile card. */
export function useProfileSummary(locale: Locale, now: Date, t: (key: string) => string) {
  const events = useMemo(() => getCalendarEvents(locale), [locale])
  const certificateCount = useMemo(
    () => getCertificateFolders(locale).reduce((count, folder) => count + folder.certificates.length, 0),
    [locale],
  )

  const skills = useMemo(() => {
    const ids = new Set(events.flatMap((event) => event.tagIds ?? []))
    return [...ids]
      .map((id) => getCalendarTagById(locale, id))
      .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag?.icon))
  }, [events, locale])

  const currentRole = events.find((event) => event.ongoing) ?? events[0]
  const firstYear = Math.min(...events.map((event) => event.startYear))
  const yearsCoding = now.getFullYear() - firstYear

  const stats = [
    { value: `${yearsCoding}+`, label: t('hero.stat.years') },
    { value: String(events.length), label: t('hero.stat.roles') },
    { value: String(skills.length), label: t('hero.stat.tech') },
    { value: String(certificateCount), label: t('hero.stat.certs') },
  ]

  return { currentRole, firstYear, skills, stats }
}
