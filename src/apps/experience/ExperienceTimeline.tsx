import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { CalendarTag, WorkExperienceEvent } from '../../desktop/resources/calendar/types'
import { resolveAssetPath } from '../../desktop/utils/assetPath'
import { Icon } from '../../desktop-shell/components/Icon'

type ExperienceTimelineProps = {
  events: WorkExperienceEvent[]
  locale: string
  now: Date
  t: (key: string, vars?: Record<string, string>) => string
  getColor: (event: WorkExperienceEvent) => string
  getRole: (event: WorkExperienceEvent) => string
  getCompany: (event: WorkExperienceEvent) => string
  getTags: (event: WorkExperienceEvent) => CalendarTag[]
  onSelectTag: (tagId: string) => void
}

const monthsBetween = (event: WorkExperienceEvent, now: Date) => {
  const endYear = event.ongoing ? now.getFullYear() : event.endYear ?? event.startYear
  const endMonth = event.ongoing ? now.getMonth() + 1 : event.endMonth ?? event.startMonth
  return Math.max(1, (endYear - event.startYear) * 12 + endMonth - event.startMonth + 1)
}

export function ExperienceTimeline({
  events,
  locale,
  now,
  t,
  getColor,
  getRole,
  getCompany,
  getTags,
  onSelectTag,
}: ExperienceTimelineProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(events.slice(0, 1).map((event) => event.id)))
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' })

  const toggle = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <ol className="experience-timeline min-h-0 flex-1 overflow-auto px-4 py-5 @2xl:px-8" aria-label={t('calendar.timeline.label')}>
      {events.map((event, index) => {
        const color = getColor(event)
        const months = monthsBetween(event, now)
        const duration = t('calendar.duration', { years: String(Math.floor(months / 12)), months: String(months % 12) })
        const start = monthFormatter.format(new Date(event.startYear, event.startMonth - 1, 1))
        const end = event.ongoing
          ? t('calendar.ongoing')
          : monthFormatter.format(new Date(event.endYear ?? event.startYear, (event.endMonth ?? event.startMonth) - 1, 1))
        const tags = getTags(event)
        const isExpanded = expandedIds.has(event.id)
        const company = getCompany(event)

        return (
          <li
            key={event.id}
            className="experience-item"
            style={{ '--event-color': color, '--i': index } as CSSProperties}
          >
            <div className="experience-item__rail" aria-hidden="true">
              <span className="experience-item__node">
                <img src={resolveAssetPath(event.icon.src)} alt="" />
              </span>
            </div>

            <article className="experience-card">
              <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <h2 className="m-0 font-display text-[17px] font-semibold tracking-tight">{getRole(event)}</h2>
                  {company ? <p className="m-0 mt-0.5 text-sm text-(--app-muted)">{company}</p> : null}
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  {event.ongoing ? <span className="experience-badge">{t('calendar.current')}</span> : null}
                  <span className="text-xs font-medium tabular-nums" style={{ color }}>
                    {start} – {end}
                  </span>
                  <span className="text-[11px] text-(--app-muted)">{duration}</span>
                </div>
              </header>

              <p className={`m-0 mt-3 text-[13.5px] leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                {event.description}
              </p>
              <button type="button" className="experience-more" onClick={() => toggle(event.id)} aria-expanded={isExpanded}>
                {isExpanded ? t('calendar.less') : t('calendar.more')}
                <Icon name="chevronDown" className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {tags.length ? (
                <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <button type="button" className="app-chip" onClick={() => onSelectTag(tag.id)}>
                        {tag.icon ? <img src={resolveAssetPath(tag.icon.src)} alt="" className="h-3.5 w-3.5 object-contain" /> : null}
                        {tag.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          </li>
        )
      })}
    </ol>
  )
}
