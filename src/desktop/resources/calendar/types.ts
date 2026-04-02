export type CalendarTag = {
  id: string
  label: string
  icon?: {
    src: string
    alt: string
  }
}

export type CalendarTagRegistryEntry = {
  id: string
  labels: {
    it: string
    en: string
  }
  icon?: {
    src: string
    alt: string
  }
}

export type WorkExperienceEvent = {
  id: string
  role?: string
  companyName?: string
  /** Legacy fallback: prefer `role` + `companyName` */
  name?: string
  description: string
  barColor?: string
  tagIds?: string[]
  /** Legacy fallback: prefer `tagIds` */
  tags?: string[]
  icon: {
    src: string
    alt: string
  }
  startMonth: number
  startYear: number
  endMonth?: number
  endYear?: number
  ongoing?: boolean
}


