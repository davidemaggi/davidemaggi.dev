import type { Locale } from '../../types'

export type Localized<T = string> = Record<Locale, T>

export type ProjectPlatform = 'macos' | 'windows' | 'linux'

/**
 * One open source project shown in the App Store.
 * Static fields live here; stars, forks and the latest release are fetched live from GitHub.
 */
export type OpenSourceProject = {
  /** Stable id, also used by the command palette to deep-link the project page. */
  id: string
  name: string
  /** `owner/repo` on GitHub. */
  repo: string
  /** Path under /public. */
  icon: string
  /** Two colors for the hero banner gradient. */
  accent: [string, string]
  category: Localized
  tagline: Localized
  description: Localized
  features: Localized<string[]>
  /** Calendar tag ids (shown with their icon) or plain labels. */
  stack: string[]
  platforms: ProjectPlatform[]
  license: string
  /** Optional package-manager one-liners shown on the project page. */
  install?: string[]
  /** Shown as the App Store "app of the day" banner. */
  featured?: boolean
}
