import type { Locale } from '../../types'
import enSkills from './en'
import itSkills from './it'
import type { SkillTrack } from './types'

const skillTracksByLocale: Record<Locale, SkillTrack[]> = {
  it: itSkills,
  en: enSkills,
}

export const getSkillTracks = (locale: Locale): SkillTrack[] => {
  return skillTracksByLocale[locale] ?? skillTracksByLocale.it
}

