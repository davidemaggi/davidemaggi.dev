import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { DESKTOP_PLUGINS } from '../../desktop/plugins'
import { getCalendarEvents } from '../../desktop/resources/calendar'
import { getCertificateFolders } from '../../desktop/resources/certManager'
import { OPEN_SOURCE_PROJECTS } from '../../desktop/resources/projects'
import { FALLBACK_POSTS } from '../../desktop/resources/blog'
import type { AppId, DesktopPreferences, Locale } from '../../desktop/types'
import { resolveAssetPath } from '../../desktop/utils/assetPath'
import { renderAppIcon, resolveAppIcon } from '../utils/icons'

type PaletteGroup = 'apps' | 'blog' | 'projects' | 'experience' | 'certificates'

type PaletteItem = {
  key: string
  group: PaletteGroup
  title: string
  subtitle?: string
  keywords: string
  icon: ReactNode
  appId: AppId
  query?: string
}

type CommandPaletteProps = {
  locale: Locale
  t: (key: string, vars?: Record<string, string>) => string
  preferences: DesktopPreferences
  onClose: () => void
  onLaunch: (id: AppId, query?: string) => void
}

const GROUP_ORDER: PaletteGroup[] = ['apps', 'blog', 'projects', 'experience', 'certificates']
const MAX_PER_GROUP = 6

const imageIcon = (src: string) => (
  <img src={resolveAssetPath(src)} alt="" className="h-5 w-5 object-contain" />
)

export function CommandPalette({ locale, t, preferences, onClose, onLaunch }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const allItems = useMemo<PaletteItem[]>(() => {
    const apps = Object.values(DESKTOP_PLUGINS)
      .filter((plugin) => !plugin.hidden)
      .map<PaletteItem>((plugin) => ({
        key: `app-${plugin.id}`,
        group: 'apps',
        title: t(plugin.titleKey),
        keywords: `${plugin.id} ${t(plugin.titleKey)}`,
        icon: renderAppIcon(resolveAppIcon(plugin.id, preferences), 'h-5 w-5 object-contain'),
        appId: plugin.id,
      }))

    const experiences = getCalendarEvents(locale).map<PaletteItem>((event) => ({
      key: `exp-${event.id}`,
      group: 'experience',
      title: event.role ?? event.name ?? event.id,
      subtitle: `${event.companyName ?? ''} · ${event.startYear}–${event.ongoing ? t('calendar.ongoing') : event.endYear ?? ''}`,
      keywords: `${event.role ?? ''} ${event.companyName ?? ''} ${(event.tagIds ?? []).join(' ')}`,
      icon: imageIcon(event.icon.src),
      appId: 'calendar',
      query: event.companyName,
    }))

    const certificates = getCertificateFolders(locale)
      .flatMap((folder) => folder.certificates)
      .map<PaletteItem>((cert) => ({
        key: `cert-${cert.id}`,
        group: 'certificates',
        title: cert.commonName,
        subtitle: cert.issuedBy,
        keywords: `${cert.commonName} ${cert.issuedBy}`,
        icon: imageIcon(cert.issuedByLogo?.src ?? '/icons/certificate.svg'),
        appId: 'certManager',
        query: cert.id,
      }))

    const projects = OPEN_SOURCE_PROJECTS.map<PaletteItem>((project) => ({
      key: `project-${project.id}`,
      group: 'projects',
      title: project.name,
      subtitle: project.tagline[locale],
      keywords: `${project.name} ${project.repo} ${project.stack.join(' ')} open source github`,
      icon: imageIcon(project.icon),
      appId: 'help',
      query: project.id,
    }))

    const posts = FALLBACK_POSTS.map<PaletteItem>((post) => ({
      key: `post-${post.link}`,
      group: 'blog',
      title: post.title,
      subtitle: 'monkeyproof.dev',
      keywords: `${post.title} ${post.description} blog monkeyproof`,
      icon: imageIcon('/icons/apps/monkeyproof.svg'),
      appId: 'blog',
      query: post.link,
    }))

    return [...apps, ...posts, ...projects, ...experiences, ...certificates]
  }, [locale, preferences, t])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const matches = normalized
      ? allItems.filter((item) => item.keywords.toLowerCase().includes(normalized))
      : allItems.filter((item) => item.group === 'apps')

    return GROUP_ORDER.flatMap((group) =>
      matches.filter((item) => item.group === group).slice(0, MAX_PER_GROUP),
    )
  }, [allItems, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-palette-toggle]')) return
      if (panelRef.current && !panelRef.current.contains(target)) onClose()
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [onClose])

  const launch = (item: PaletteItem | undefined) => {
    if (!item) return
    onClose()
    onLaunch(item.appId, item.query)
  }

  return (
    <section className="spotlight-overlay absolute inset-0 z-28 grid items-start justify-center px-4 pt-[14vh]">
      <div
        ref={panelRef}
        className="spotlight-panel w-[min(92vw,640px)] overflow-hidden rounded-2xl border"
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.label')}
      >
        <div className="spotlight-input-wrap flex items-center gap-3 border-b px-4 py-3.5">
          <svg className="h-5 w-5 shrink-0 opacity-60" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27a6 6 0 10-.71.71l.27.28v.79L20 21.5 21.5 20l-6-6zm-5.5 0A4.5 4.5 0 1110 5a4.5 4.5 0 010 9z"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0))
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0))
              } else if (event.key === 'Enter') {
                event.preventDefault()
                launch(results[activeIndex])
              } else if (event.key === 'Escape') {
                event.preventDefault()
                onClose()
              }
            }}
            placeholder={t('palette.placeholder')}
            aria-label={t('palette.placeholder')}
            aria-controls="command-palette-results"
            aria-activedescendant={results[activeIndex] ? `palette-${results[activeIndex].key}` : undefined}
            role="combobox"
            aria-expanded="true"
            className="spotlight-input min-w-0 flex-1 bg-transparent outline-none"
          />
          <kbd className="spotlight-kbd">esc</kbd>
        </div>

        <div ref={listRef} id="command-palette-results" role="listbox" className="max-h-[min(56vh,420px)] overflow-auto p-2">
          {results.length ? (
            results.map((item, index) => {
              const isFirstOfGroup = index === 0 || results[index - 1].group !== item.group
              const isActive = index === activeIndex
              return (
                <div key={item.key}>
                  {isFirstOfGroup ? (
                    <p className="spotlight-group m-0 px-3 pt-3 pb-1.5">{t(`palette.group.${item.group}`)}</p>
                  ) : null}
                  <button
                    id={`palette-${item.key}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-index={index}
                    className={`spotlight-result flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${isActive ? 'spotlight-result--active' : ''}`}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => launch(item)}
                  >
                    <span className="spotlight-result__icon" aria-hidden="true">{item.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.title}</span>
                      {item.subtitle ? (
                        <span className="block truncate text-xs text-(--app-muted)">{item.subtitle}</span>
                      ) : null}
                    </span>
                    {isActive ? <kbd className="spotlight-kbd">↵</kbd> : null}
                  </button>
                </div>
              )
            })
          ) : (
            <p className="m-0 px-3 py-6 text-center text-sm text-(--app-muted)">{t('palette.empty', { query })}</p>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-(--app-border)/60 px-4 py-2 text-[11px] text-(--app-muted)">
          <span className="inline-flex items-center gap-1.5"><kbd className="spotlight-kbd">↑</kbd><kbd className="spotlight-kbd">↓</kbd>{t('palette.hint.navigate')}</span>
          <span className="inline-flex items-center gap-1.5"><kbd className="spotlight-kbd">↵</kbd>{t('palette.hint.open')}</span>
        </div>
      </div>
    </section>
  )
}
