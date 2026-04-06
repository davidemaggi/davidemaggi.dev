import type { Locale } from './types'
import en from './locales/en'
import it from './locales/it'

export const AVAILABLE_LOCALES = ['it', 'en'] as const

const translations: Record<Locale, Record<string, string>> = {
  it,
  en,
}

export const DEFAULT_LOCALE: Locale = 'it'

export const interpolate = (message: string, vars?: Record<string, string>) => {
  if (!vars) return message

  return Object.entries(vars).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, value)
  }, message)
}

export const createTranslator = (locale: Locale) => {
  return (key: string, vars?: Record<string, string>) => {
    const dictionary = translations[locale]
    const fallback = translations[DEFAULT_LOCALE]
    const message = dictionary[key] ?? fallback[key] ?? key
    return interpolate(message, vars)
  }
}


