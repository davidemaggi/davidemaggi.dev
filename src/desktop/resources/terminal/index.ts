import type { Locale } from '../../types'
import enTerminalContent from './en'
import itTerminalContent from './it'
import type { TerminalContent } from './types'

const terminalContentByLocale: Record<Locale, TerminalContent> = {
  it: itTerminalContent,
  en: enTerminalContent,
}

export const getTerminalContent = (locale: Locale): TerminalContent => {
  return terminalContentByLocale[locale] ?? terminalContentByLocale.it
}

