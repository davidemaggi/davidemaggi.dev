import type { ClockDateFormat, ClockHourFormat, Locale } from '../types'

type FormatDesktopDateTimeParams = {
  now: Date
  locale: Locale
  clockHourFormat: ClockHourFormat
  clockDateFormat: ClockDateFormat
}

const resolveLocaleTag = (locale: Locale) => (locale === 'en' ? 'en-US' : 'it-IT')

const formatTime = (now: Date, locale: Locale, clockHourFormat: ClockHourFormat) => {
  return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: clockHourFormat === 'locale' ? undefined : clockHourFormat === '12h',
  }).format(now)
}

const formatDate = (now: Date, locale: Locale, clockDateFormat: ClockDateFormat) => {
  if (clockDateFormat === 'locale') {
    return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(now)
  }

  const pad = (value: number) => value.toString().padStart(2, '0')
  const day = pad(now.getDate())
  const month = pad(now.getMonth() + 1)
  const year = now.getFullYear().toString()

  if (clockDateFormat === 'dd/mm/yyyy') return `${day}/${month}/${year}`
  if (clockDateFormat === 'mm/dd/yyyy') return `${month}/${day}/${year}`
  return `${year}-${month}-${day}`
}

export const formatDesktopDateTime = ({
  now,
  locale,
  clockHourFormat,
  clockDateFormat,
}: FormatDesktopDateTimeParams) => {
  return {
    formattedTime: formatTime(now, locale, clockHourFormat),
    formattedDate: formatDate(now, locale, clockDateFormat),
  }
}

