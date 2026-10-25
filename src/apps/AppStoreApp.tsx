import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { DesktopAppProps, Locale } from '../desktop/types'
import { getCalendarTagById } from '../desktop/resources/calendar'
import { OPEN_SOURCE_PROJECTS, getProjectById } from '../desktop/resources/projects'
import type { OpenSourceProject, ProjectPlatform } from '../desktop/resources/projects/types'
import { resolveAssetPath } from '../desktop/utils/assetPath'
import { Icon } from '../desktop-shell/components/Icon'
import { useGitHubStats } from './appstore/useGitHubStats'

type Translate = (key: string, vars?: Record<string, string>) => string

const PLATFORM_LABELS: Record<ProjectPlatform, string> = {
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
}

const GITHUB_PROFILE = 'https://github.com/davidemaggi'

const accentStyle = (project: OpenSourceProject) =>
  ({ '--project-a': project.accent[0], '--project-b': project.accent[1] }) as CSSProperties

const ProjectIcon = ({ project, className }: { project: OpenSourceProject; className: string }) => (
  <img src={resolveAssetPath(project.icon)} alt="" className={`object-contain ${className}`} />
)

function ProjectCard({ project, locale, t, onOpen }: { project: OpenSourceProject; locale: Locale; t: Translate; onOpen: () => void }) {
  const stats = useGitHubStats(project.repo)

  return (
    <li>
      <button type="button" className="store-card w-full text-left" onClick={onOpen}>
        <ProjectIcon project={project} className="store-card__icon" />
        <span className="min-w-0 flex-1">
          <strong className="block font-display text-[15px] font-semibold">{project.name}</strong>
          <span className="block text-[11px] tracking-wide text-(--app-muted) uppercase">{project.category[locale]}</span>
          <span className="mt-1.5 block text-[13px] leading-snug text-(--app-muted)">{project.tagline[locale]}</span>
          <span className="mt-2 flex flex-wrap items-center gap-3 text-[11.5px] text-(--app-muted)">
            {stats?.version ? <span className="font-mono">{stats.version}</span> : null}
            {stats ? (
              <span className="inline-flex items-center gap-1">
                <Icon name="star" className="h-3.5 w-3.5" />
                {stats.stars}
              </span>
            ) : null}
            <span>{project.license}</span>
          </span>
        </span>
        <span className="store-get">{t('appStore.view')}</span>
      </button>
    </li>
  )
}

function ProjectPage({ project, locale, t, onBack }: { project: OpenSourceProject; locale: Locale; t: Translate; onBack: () => void }) {
  const stats = useGitHubStats(project.repo)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const dateLocale = locale === 'en' ? 'en-US' : 'it-IT'

  useEffect(() => {
    if (!copiedCommand) return
    const timer = window.setTimeout(() => setCopiedCommand(null), 1600)
    return () => window.clearTimeout(timer)
  }, [copiedCommand])

  const copy = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
    } catch {
      setCopiedCommand(null)
    }
  }

  const releaseUrl = stats?.releaseUrl ?? `https://github.com/${project.repo}/releases/latest`
  const facts = [
    { label: t('appStore.fact.version'), value: stats?.version ?? '—' },
    {
      label: t('appStore.fact.released'),
      value: stats?.releasedAt
        ? new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(stats.releasedAt))
        : '—',
    },
    { label: t('appStore.fact.stars'), value: stats ? String(stats.stars) : '—' },
    { label: t('appStore.fact.forks'), value: stats ? String(stats.forks) : '—' },
    { label: t('appStore.fact.license'), value: project.license },
    { label: t('appStore.fact.platforms'), value: project.platforms.map((platform) => PLATFORM_LABELS[platform]).join(' · ') },
  ]

  return (
    <article style={accentStyle(project)}>
      <button type="button" className="store-back" onClick={onBack}>
        <Icon name="chevronRight" className="h-4 w-4 rotate-180" />
        {t('appStore.heading')}
      </button>

      <header className="store-hero mt-3">
        <ProjectIcon project={project} className="h-24 w-24 shrink-0 drop-shadow-[0_16px_24px_#00000066]" />
        <div className="min-w-0 flex-1">
          <p className="store-feature__eyebrow">{project.category[locale]}</p>
          <h1 className="m-0 mt-1 font-display text-3xl font-semibold tracking-tight">{project.name}</h1>
          <p className="m-0 mt-1 text-sm opacity-90">{project.tagline[locale]}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="store-get store-get--light" href={releaseUrl} target="_blank" rel="noreferrer">
              <Icon name="download" className="h-4 w-4" />
              {t('appStore.download')}
            </a>
            <a className="store-get store-get--glass" href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer">
              <img src={resolveAssetPath('/icons/github.svg')} alt="" className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      <dl className="store-facts">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 @2xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="flex min-w-0 flex-col gap-4">
          <section className="profile-card">
            <h2 className="profile-card__title">{t('appStore.about')}</h2>
            <p className="m-0 text-[14px] leading-relaxed">{project.description[locale]}</p>
          </section>
          <section className="profile-card">
            <h2 className="profile-card__title">{t('appStore.features')}</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {project.features[locale].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                  <span className="store-check" aria-hidden="true">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          {project.install?.length ? (
            <section className="profile-card">
              <h2 className="profile-card__title">{t('appStore.install.title')}</h2>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {project.install.map((command) => (
                  <li key={command} className="store-command">
                    <code className="min-w-0 flex-1 [overflow-wrap:anywhere]">{command}</code>
                    <button
                      type="button"
                      className="profile-copy-btn"
                      onClick={() => copy(command)}
                      aria-label={`${t('profile.action.copy')}: ${command}`}
                    >
                      <Icon name={copiedCommand === command ? 'check' : 'copy'} className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section className="profile-card">
            <h2 className="profile-card__title">{t('appStore.stack')}</h2>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {project.stack.map((item) => {
                const tag = getCalendarTagById(locale, item)
                return (
                  <li key={item} className="app-chip">
                    {tag?.icon ? <img src={resolveAssetPath(tag.icon.src)} alt="" className="h-3.5 w-3.5 object-contain" /> : null}
                    {tag?.label ?? item}
                  </li>
                )
              })}
            </ul>
          </section>
        </aside>
      </div>
    </article>
  )
}

export function AppStoreApp({ i18nApi, launchIntent }: DesktopAppProps) {
  const t: Translate = i18nApi?.t ?? ((key: string) => key)
  const locale: Locale = i18nApi?.locale === 'en' ? 'en' : 'it'
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [appliedLaunchToken, setAppliedLaunchToken] = useState<number | null>(null)

  // The command palette deep-links projects as `help` + project id.
  if (launchIntent?.appId === 'help' && launchIntent.token !== appliedLaunchToken) {
    setAppliedLaunchToken(launchIntent.token)
    setSelectedId(launchIntent.query && getProjectById(launchIntent.query) ? launchIntent.query : null)
  }

  const selected = selectedId ? getProjectById(selectedId) : null
  const featured = OPEN_SOURCE_PROJECTS.find((project) => project.featured) ?? OPEN_SOURCE_PROJECTS[0]

  return (
    <div className="@container h-full overflow-auto bg-(--app-surface-1) text-(--window-text)">
      <div className="mx-auto max-w-4xl px-5 py-5">
        {selected ? (
          <ProjectPage project={selected} locale={locale} t={t} onBack={() => setSelectedId(null)} />
        ) : (
          <>
            <h1 className="app-header__title">{t('appStore.heading')}</h1>
            <p className="app-header__subtitle">{t('appStore.subheading')}</p>

            {featured ? (
              <section className="store-feature mt-5" style={accentStyle(featured)} aria-labelledby="store-feature-title">
                <div className="min-w-0 flex-1">
                  <p className="store-feature__eyebrow">{t('appStore.featured')}</p>
                  <h2 id="store-feature-title" className="m-0 mt-1 font-display text-2xl font-semibold tracking-tight">
                    {featured.name}
                  </h2>
                  <p className="m-0 mt-1.5 max-w-md text-sm opacity-90">{featured.tagline[locale]}</p>
                  <button type="button" className="store-get store-get--light mt-4" onClick={() => setSelectedId(featured.id)}>
                    {t('appStore.view')}
                  </button>
                </div>
                <ProjectIcon project={featured} className="store-feature__icon" />
              </section>
            ) : null}

            <h2 className="mt-6 mb-3 font-display text-base font-semibold">{t('appStore.all')}</h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 @xl:grid-cols-2">
              {OPEN_SOURCE_PROJECTS.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                  t={t}
                  onOpen={() => setSelectedId(project.id)}
                />
              ))}
              <li>
                <a className="store-card store-card--more h-full" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
                  <span className="store-card__icon store-card__icon--more" aria-hidden="true">
                    <Icon name="sparkles" className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block font-display text-[15px] font-semibold">{t('appStore.more.title')}</strong>
                    <span className="mt-1 block text-[13px] leading-snug text-(--app-muted)">{t('appStore.more.body')}</span>
                  </span>
                  <Icon name="externalLink" className="h-4 w-4 self-center text-(--app-muted)" />
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
