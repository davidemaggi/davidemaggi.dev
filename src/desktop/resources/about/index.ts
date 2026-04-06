import type { Locale } from '../../types'
import enAboutContent from './en'
import itAboutContent from './it'
import type { AboutContent } from './types'

const aboutContentByLocale: Record<Locale, AboutContent> = {
  it: itAboutContent,
  en: enAboutContent,
}

export const getAboutContent = (locale: Locale): AboutContent => {
  return aboutContentByLocale[locale] ?? aboutContentByLocale.it
}

