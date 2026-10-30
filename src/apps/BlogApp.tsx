import { useCallback, useState } from 'react'
import type { DesktopAppProps, Locale } from '../desktop/types'
import { BLOG } from '../desktop/resources/blog'
import type { BlogPost } from '../desktop/resources/blog'
import { Icon } from '../desktop-shell/components/Icon'
import { MonkeyIntro } from './blog/MonkeyIntro'
import { ScrambleText } from './blog/ScrambleText'
import { useBlogFeed } from './blog/useBlogFeed'

const INTRO_SESSION_KEY = 'daveos.blog.intro.v1'

const shouldPlayIntro = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.sessionStorage.getItem(INTRO_SESSION_KEY) !== '1'

type Translate = (key: string, vars?: Record<string, string>) => string

function PostCard({
  post,
  lead,
  locale,
  t,
  onOpen,
}: {
  post: BlogPost
  lead?: boolean
  locale: Locale
  t: Translate
  onOpen: () => void
}) {
  const [playKey, setPlayKey] = useState(0)
  const date = new Date(post.publishedAt)
  const stamp = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)

  return (
    <li className={lead ? 'mp-card-wrap mp-card-wrap--lead' : 'mp-card-wrap'}>
      <button
        type="button"
        className={`mp-card ${lead ? 'mp-card--lead' : ''}`}
        onClick={onOpen}
        onMouseEnter={() => setPlayKey((key) => key + 1)}
        onFocus={() => setPlayKey((key) => key + 1)}
      >
        <span className="flex items-center justify-between gap-2">
          {lead ? <span className="mp-card__kicker">{t('blog.latest')}</span> : <span />}
          <span className="app-chip">
            <Icon name="calendar" className="h-3.5 w-3.5" />
            {stamp}
          </span>
        </span>
        <ScrambleText text={post.title} playKey={playKey} className="mp-card__title" />
        <span className="mp-card__excerpt">{post.description}</span>
        <span className="mp-card__cta">
          {t('blog.read')}
          <Icon name="chevronRight" className="h-4 w-4" />
        </span>
      </button>
    </li>
  )
}

function Reader({ post, t, onBack }: { post: BlogPost; t: Translate; onBack: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const displayUrl = post.link.replace(/^https?:\/\//, '')

  return (
    <div className="mp-reader">
      <div className="mp-reader__bar">
        <button type="button" className="app-control" onClick={onBack}>
          <Icon name="chevronRight" className="h-4 w-4 rotate-180" />
          <span className="hidden @md:inline">{t('blog.back')}</span>
        </button>
        <span className="mp-reader__url" title={post.link}>
          <Icon name="lock" className="h-3.5 w-3.5 shrink-0 opacity-70" />
          <span className="truncate">{displayUrl}</span>
        </span>
        <a className="app-control" href={post.link} target="_blank" rel="noreferrer" aria-label={t('blog.openExternal')}>
          <Icon name="externalLink" className="h-4 w-4" />
          <span className="hidden @md:inline">{t('blog.openExternal')}</span>
        </a>
      </div>
      <div className="relative min-h-0 flex-1">
        {!isLoaded ? (
          <div className="mp-reader__loading" role="status">
            <span className="mp-reader__spinner" aria-hidden="true" />
            {t('blog.loading')}
          </div>
        ) : null}
        <iframe
          key={post.link}
          src={post.link}
          title={post.title}
          className="mp-reader__frame"
          onLoad={() => setIsLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  )
}

export function BlogApp({ i18nApi, launchIntent }: DesktopAppProps) {
  const t: Translate = i18nApi?.t ?? ((key: string) => key)
  const locale: Locale = i18nApi?.locale === 'en' ? 'en' : 'it'
  const { posts, isLive } = useBlogFeed()
  const [isIntroPlaying, setIsIntroPlaying] = useState(shouldPlayIntro)
  const [readingLink, setReadingLink] = useState<string | null>(null)
  const [appliedLaunchToken, setAppliedLaunchToken] = useState<number | null>(null)
  const [mastheadKey, setMastheadKey] = useState(0)

  // The command palette deep-links straight into an article.
  if (launchIntent?.appId === 'blog' && launchIntent.token !== appliedLaunchToken) {
    setAppliedLaunchToken(launchIntent.token)
    if (launchIntent.query?.startsWith(BLOG.url)) {
      setReadingLink(launchIntent.query)
      setIsIntroPlaying(false)
    }
  }

  const finishIntro = useCallback(() => {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    setIsIntroPlaying(false)
    setMastheadKey((key) => key + 1)
  }, [])

  const reading = readingLink
    ? posts.find((post) => post.link === readingLink) ?? { title: BLOG.name, link: readingLink, description: '', publishedAt: '' }
    : null
  const [lead, ...rest] = posts
  const latestDate = lead
    ? new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(lead.publishedAt),
      )
    : ''

  return (
    <div className="mp @container relative flex h-full flex-col">
      {isIntroPlaying ? (
        <MonkeyIntro
          title={BLOG.name}
          tagline={t('blog.tagline')}
          caption={t('blog.intro.caption', { count: String(posts.length) })}
          onDone={finishIntro}
        />
      ) : null}

      {reading ? (
        <Reader post={reading} t={t} onBack={() => setReadingLink(null)} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="app-header shrink-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="app-header__title" onMouseEnter={() => setMastheadKey((key) => key + 1)}>
                  <ScrambleText text={BLOG.name} playKey={mastheadKey} duration={900} />
                </h1>
                <p className="app-header__subtitle">{t('blog.tagline')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="app-control"
                  onClick={() => setIsIntroPlaying(true)}
                  title={t('blog.replay')}
                  aria-label={t('blog.replay')}
                >
                  <Icon name="refresh" className="h-4 w-4" />
                </button>
                <a className="app-control" href={`${BLOG.url}/rss.xml`} target="_blank" rel="noreferrer">
                  RSS
                </a>
                <a className="mp-visit" href={BLOG.url} target="_blank" rel="noreferrer">
                  {t('blog.visit')}
                  <Icon name="externalLink" className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="app-chip">
                <span className={`mp-live-dot ${isLive ? 'mp-live-dot--on' : ''}`} aria-hidden="true" />
                {isLive ? t('blog.live') : t('blog.offline')}
              </span>
              <span className="app-chip">{t('blog.count', { count: String(posts.length) })}</span>
              {latestDate ? (
                <span className="ml-auto text-xs text-(--app-muted)">{t('blog.updated', { date: latestDate })}</span>
              ) : null}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-auto p-4 @2xl:p-5">
            <ul className="mp-grid">
              {lead ? <PostCard post={lead} lead locale={locale} t={t} onOpen={() => setReadingLink(lead.link)} /> : null}
              {rest.map((post) => (
                <PostCard key={post.link} post={post} locale={locale} t={t} onOpen={() => setReadingLink(post.link)} />
              ))}
            </ul>
            <p className="mp-colophon">{t('blog.colophon')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
