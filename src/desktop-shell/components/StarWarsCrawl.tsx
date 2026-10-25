import { useEffect, useMemo, useRef, useState } from 'react'
import { getCalendarEvents } from '../../desktop/resources/calendar'
import { getCertificateFolders } from '../../desktop/resources/certManager'
import type { Locale } from '../../desktop/types'
import { resolveAssetPath } from '../../desktop/utils/assetPath'

type StarWarsCrawlProps = {
  locale: Locale
  t: (key: string, vars?: Record<string, string>) => string
  onFinish: () => void
}

/** Intro text, title shrink and crawl timings (ms) — kept in sync with the CSS animations. */
const CRAWL_START_MS = 8500
const CRAWL_DURATION_MS = 48000
const FLYOVER_MS = 11000
const LEAVE_MS = 900

type Phase = 'crawl' | 'flyover' | 'leaving'

const toRoman = (value: number) => {
  const numerals: Array<[number, string]> = [
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let rest = Math.max(1, value)
  return numerals.reduce((result, [amount, numeral]) => {
    while (rest >= amount) {
      result += numeral
      rest -= amount
    }
    return result
  }, '')
}

const joinList = (items: string[], and: string) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`

/**
 * The Konami easter egg: a full-screen opening crawl that tells the career story
 * straight from the experience and certification data.
 */
export function StarWarsCrawl({ locale, t, onFinish }: StarWarsCrawlProps) {
  const [phase, setPhase] = useState<Phase>('crawl')
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const skipRef = useRef<HTMLButtonElement | null>(null)

  const story = useMemo(() => {
    const events = getCalendarEvents(locale)
    const chronological = [...events].sort((a, b) => a.startYear * 12 + a.startMonth - (b.startYear * 12 + b.startMonth))
    const companies = [...new Set(chronological.map((event) => event.companyName).filter(Boolean))] as string[]
    const current = events.find((event) => event.ongoing) ?? events[0]
    const firstYear = Math.min(...events.map((event) => event.startYear))
    const certCount = getCertificateFolders(locale).reduce((sum, folder) => sum + folder.certificates.length, 0)

    return {
      episode: toRoman(new Date().getFullYear() - firstYear),
      paragraphs: [
        t('crawl.p1'),
        t('crawl.p2'),
        t('crawl.p3', {
          count: String(companies.length),
          companies: joinList(companies, t('crawl.and')),
          role: current?.role ?? '',
          company: current?.companyName ?? '',
        }),
        t('crawl.p4', { certs: String(certCount) }),
      ],
    }
  }, [locale, t])

  // Skipping moves forward one act: crawl → Star Destroyer flyover → back to the desktop.
  const advance = () => setPhase((current) => (current === 'crawl' ? 'flyover' : 'leaving'))

  useEffect(() => {
    skipRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setPhase((current) => (current === 'crawl' ? 'flyover' : 'leaving'))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (phase === 'leaving') {
      const timer = window.setTimeout(onFinish, LEAVE_MS)
      return () => window.clearTimeout(timer)
    }
    if (reducedMotion) return
    const delay = phase === 'crawl' ? CRAWL_START_MS + CRAWL_DURATION_MS : FLYOVER_MS
    const timer = window.setTimeout(() => setPhase(phase === 'crawl' ? 'flyover' : 'leaving'), delay)
    return () => window.clearTimeout(timer)
  }, [onFinish, phase, reducedMotion])

  const crawlText = (
    <>
      <p className="crawl__episode">{t('crawl.episode', { number: story.episode })}</p>
      <h2 className="crawl__title">{t('crawl.title')}</h2>
      {story.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  )

  return (
    <section
      className={`crawl ${reducedMotion ? 'crawl--static' : ''} ${phase === 'leaving' ? 'crawl--leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('crawl.title')}
    >
      <div className="crawl__stars" aria-hidden="true" />

      {phase !== 'crawl' ? (
        <div className={`flyover ${reducedMotion ? 'flyover--static' : ''}`} aria-hidden="true">
          <div className="flyover__planet" />
          <div className="flyover__ship">
            <img src={resolveAssetPath('/easter/star-destroyer.svg')} alt="" />
          </div>
          <span className="flyover__bolt flyover__bolt--1" />
          <span className="flyover__bolt flyover__bolt--2" />
          <span className="flyover__bolt flyover__bolt--3" />
        </div>
      ) : reducedMotion ? (
        <div className="crawl__static">{crawlText}</div>
      ) : (
        <>
          <p className="crawl__intro">{t('crawl.intro')}</p>
          <div className="crawl__logo" aria-hidden="true">
            <span>DAVIDE</span>
            <span>MAGGI</span>
          </div>
          <div className="crawl__viewport">
            <div className="crawl__plane">
              <div className="crawl__text">{crawlText}</div>
            </div>
          </div>
        </>
      )}

      <button ref={skipRef} type="button" className="crawl__skip" onClick={advance}>
        {phase === 'crawl' ? t('crawl.skip') : t('crawl.continue')} <kbd>esc</kbd>
      </button>
      <div className="crawl__flash" aria-hidden="true" />
    </section>
  )
}
