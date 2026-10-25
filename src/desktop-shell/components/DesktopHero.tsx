import { memo, useEffect, useMemo, useState } from 'react'
import { SOCIAL_LINKS } from '../../desktop/resources/profile'
import type { AppId, DesktopPreferences, Locale } from '../../desktop/types'
import { formatDesktopDateTime } from '../../desktop/utils/dateTimeFormat'
import { resolveAssetPath } from '../../desktop/utils/assetPath'
import { useProfileSummary } from '../hooks/useProfileSummary'
import { renderAppIcon, resolveAppIcon } from '../utils/icons'

type DesktopHeroProps = {
  locale: Locale
  now: Date
  t: (key: string, vars?: Record<string, string>) => string
  preferences: DesktopPreferences
  onOpenApp: (id: AppId, query?: string) => void
  onOpenSearch: () => void
  isDimmed: boolean
}

const QUICK_ACTIONS: ReadonlyArray<{ id: AppId; labelKey: string; primary?: boolean }> = [
  { id: 'calendar', labelKey: 'hero.action.experience', primary: true },
  { id: 'about', labelKey: 'hero.action.about' },
  { id: 'certManager', labelKey: 'hero.action.skills' },
  { id: 'terminal', labelKey: 'hero.action.terminal' },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Types each role, waits, deletes it and moves to the next one. */
const useTypewriter = (words: string[]) => {
  const [wordIndex, setWordIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reduced] = useState(prefersReducedMotion)

  useEffect(() => {
    if (reduced || words.length === 0) return
    const word = words[wordIndex % words.length]

    const delay = isDeleting ? 38 : length === word.length ? 2200 : 70
    const timer = window.setTimeout(() => {
      if (!isDeleting && length === word.length) {
        setIsDeleting(true)
        return
      }
      if (isDeleting && length === 0) {
        setIsDeleting(false)
        setWordIndex((index) => (index + 1) % words.length)
        return
      }
      setLength((value) => value + (isDeleting ? -1 : 1))
    }, delay)

    return () => window.clearTimeout(timer)
  }, [isDeleting, length, reduced, wordIndex, words])

  if (reduced || words.length === 0) return words[0] ?? ''
  return words[wordIndex % words.length].slice(0, length)
}

/** Isolated so the typing ticks only re-render this span, not the whole hero. */
function TypedRole({ words }: { words: string[] }) {
  const typed = useTypewriter(words)
  return (
    <span className="text-gradient" aria-hidden="true">
      {typed}
    </span>
  )
}

export const DesktopHero = memo(function DesktopHero({ locale, now, t, preferences, onOpenApp, onOpenSearch, isDimmed }: DesktopHeroProps) {
  const roles = useMemo(() => t('hero.roles').split('|'), [t])
  const { currentRole, skills, stats } = useProfileSummary(locale, now, t)

  const intlLocale = locale === 'en' ? 'en-US' : 'it-IT'
  const { formattedTime } = formatDesktopDateTime({
    now,
    locale,
    clockHourFormat: preferences.clockHourFormat,
    clockDateFormat: preferences.clockDateFormat,
  })
  const longDate = new Intl.DateTimeFormat(intlLocale, { weekday: 'long', day: 'numeric', month: 'long' }).format(now)

  const tenureMonths = currentRole
    ? (now.getFullYear() - currentRole.startYear) * 12 + now.getMonth() + 1 - currentRole.startMonth
    : 0
  const tenureLabel = t('hero.now.tenure', {
    years: String(Math.floor(tenureMonths / 12)),
    months: String(tenureMonths % 12),
  })
  const sinceLabel = currentRole
    ? new Intl.DateTimeFormat(intlLocale, { month: 'short', year: 'numeric' }).format(
        new Date(currentRole.startYear, currentRole.startMonth - 1, 1),
      )
    : ''

  const isMac = typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform)

  return (
    <>
      <section
        className={`hero pointer-events-none absolute top-8 bottom-24 left-52 right-6 z-[5] flex items-center xl:right-[360px] ${isDimmed ? 'hero--dimmed' : ''}`}
        aria-labelledby="hero-name"
      >
        <div className="flex max-w-[760px] flex-col gap-6 pl-4">
          <p className="hero__eyebrow hero__reveal m-0 inline-flex items-center gap-2.5 text-xs opacity-80">
            <span className="hero__status-dot" aria-hidden="true" />
            {t('hero.status')}
          </p>

          <div>
            <p className="hero__reveal m-0 mb-2 font-display text-lg opacity-80">{t('hero.greeting')}</p>
            <h1 id="hero-name" className="hero__name m-0 text-[clamp(3.5rem,8.2vw,8.5rem)]">
              <span className="hero__name-line">Davide</span>
              <span className="hero__name-line hero__name-outline">Maggi</span>
            </h1>
          </div>

          <p className="hero__role m-0 text-[clamp(1.2rem,2vw,1.6rem)] font-medium" aria-label={roles.join(', ')}>
            <span className="opacity-60">~/</span>
            <TypedRole words={roles} />
            <span className="hero__caret" aria-hidden="true" />
          </p>

          <p className="hero__reveal m-0 max-w-[56ch] text-[15px] leading-relaxed opacity-80" style={{ animationDelay: '260ms' }}>
            {t('hero.tagline')}
          </p>

          <dl className="hero__reveal m-0 grid max-w-[620px] grid-cols-2 gap-2.5 sm:grid-cols-4" style={{ animationDelay: '340ms' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat glass">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <span className="hero-stat__value block text-2xl">{stat.value}</span>
                  <span className="block text-xs opacity-70">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="hero__reveal pointer-events-auto flex flex-wrap items-center gap-2.5" style={{ animationDelay: '420ms' }}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`hero-action ${action.primary ? 'hero-action--primary' : 'glass'}`}
                onClick={() => onOpenApp(action.id)}
              >
                <span className="hero-action__icon" aria-hidden="true">
                  {renderAppIcon(resolveAppIcon(action.id, preferences), 'h-5 w-5 object-contain')}
                </span>
                {t(action.labelKey)}
              </button>
            ))}
          </div>

          <div className="hero__reveal pointer-events-auto flex flex-wrap items-center gap-2.5" style={{ animationDelay: '500ms' }}>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.id}
                className="hero-social glass"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
              >
                <img src={resolveAssetPath(link.icon)} alt="" />
              </a>
            ))}
            <button
              type="button"
              className="hero-action glass ml-1 text-sm"
              onClick={onOpenSearch}
            >
              <span className="opacity-80">{t('hero.search')}</span>
              <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
            </button>
          </div>
        </div>
      </section>

      <aside
        className={`hero absolute top-12 right-6 z-[5] hidden w-[316px] flex-col gap-4 xl:flex ${isDimmed ? 'hero--dimmed' : ''}`}
        aria-label={t('hero.widgets.label')}
      >
        <div className="widget glass p-5" style={{ animationDelay: '250ms' }}>
          <p className="widget__label m-0">{longDate}</p>
          <p className="widget__clock m-0 mt-2 text-[56px]">{formattedTime}</p>
          <p className="m-0 mt-2 text-xs opacity-70">{t('hero.clock.location')}</p>
        </div>

        {currentRole ? (
          <button
            type="button"
            className="widget glass block w-full p-5 text-left transition-transform duration-200 hover:-translate-y-0.5"
            style={{ animationDelay: '350ms' }}
            onClick={() => onOpenApp('calendar', currentRole.companyName)}
          >
            <p className="widget__label m-0">{t('hero.now.label')}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white p-2">
                <img src={resolveAssetPath(currentRole.icon.src)} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="min-w-0">
                <strong className="block truncate font-display text-base font-semibold">{currentRole.role}</strong>
                <span className="block truncate text-sm opacity-75">{currentRole.companyName}</span>
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs opacity-75">
              <span>{t('hero.now.since', { date: sinceLabel })}</span>
              <span>{tenureLabel}</span>
            </div>
          </button>
        ) : null}

        <div className="widget glass overflow-hidden py-5" style={{ animationDelay: '450ms' }}>
          <p className="widget__label m-0 px-5">{t('hero.stack.label')}</p>
          <div className="skill-marquee mt-3">
            <div className="skill-marquee__track">
              {[...skills, ...skills].map((skill, index) => (
                <span
                  key={`${skill.id}-${index}`}
                  className="skill-chip glass"
                  aria-hidden={index >= skills.length ? 'true' : undefined}
                >
                  {skill.icon ? <img src={resolveAssetPath(skill.icon.src)} alt="" /> : null}
                  {skill.label}
                </span>
              ))}
            </div>
          </div>
          <div className="skill-marquee mt-2">
            <div className="skill-marquee__track" style={{ animationDirection: 'reverse', animationDuration: '52s' }}>
              {[...skills].reverse().concat([...skills].reverse()).map((skill, index) => (
                <span key={`r-${skill.id}-${index}`} className="skill-chip glass" aria-hidden="true">
                  {skill.icon ? <img src={resolveAssetPath(skill.icon.src)} alt="" /> : null}
                  {skill.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
})
