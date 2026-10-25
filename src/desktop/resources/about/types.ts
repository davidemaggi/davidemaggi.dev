export type AboutIconItem = {
  label: string
  icon: string
  /** Monochrome glyph that should follow the text color. */
  mono?: boolean
}

export type AboutLink = AboutIconItem & {
  handle: string
  href: string
}

export type AboutCause = {
  text: string
  href: string
  icon: string
}

export type AboutContent = {
  greeting: string
  headline: string
  bio: string[]
  signOff: string
  info: {
    email: string
    phone: string
    birthday: string
    location: string
    languages: AboutIconItem[]
  }
  socials: AboutLink[]
  causes: AboutCause[]
  interests: AboutIconItem[]
}
