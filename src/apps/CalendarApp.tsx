import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CALENDAR_START_YEAR,
  getCalendarEvents,
  getCalendarTagById,
  getCalendarTags,
} from '../desktop/resources/calendar'
import type { WorkExperienceEvent } from '../desktop/resources/calendar/types'
import type { DesktopAppProps, Locale } from '../desktop/types'
import { useIsPhone } from '../mobile-shell/hooks/useIsPhone'

const EVENT_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6']
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

type SortOrder = 'desc' | 'asc'
type TagOption = { id: string; label: string; icon?: { src: string; alt: string } }

const toMonthIndex = (year: number, month: number) => year * 12 + (month - 1)

const eventRange = (event: WorkExperienceEvent, now: Date) => {
  const start = toMonthIndex(event.startYear, event.startMonth)
  const end = event.ongoing
    ? toMonthIndex(now.getFullYear(), now.getMonth() + 1)
    : toMonthIndex(event.endYear ?? event.startYear, event.endMonth ?? event.startMonth)
  return { start, end }
}

const monthLabel = (locale: string, month: number) => {
  const date = new Date(2026, month - 1, 1)
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)
}

const periodLabel = (
  event: WorkExperienceEvent,
  locale: string,
  t: (key: string) => string,
) => {
  const startDate = new Date(event.startYear, event.startMonth - 1, 1)
  const start = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(startDate)
  if (event.ongoing) return `${start} – ${t('calendar.ongoing')}`
  const endDate = new Date(
    event.endYear ?? event.startYear,
    (event.endMonth ?? event.startMonth) - 1,
    1,
  )
  const end = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(endDate)
  return `${start} – ${end}`
}

export function CalendarApp({ i18nApi, launchIntent }: DesktopAppProps) {
  const isPhone = useIsPhone()
  const t = i18nApi?.t ?? ((key: string) => key)
  const contentLocale: Locale = i18nApi?.locale === 'en' ? 'en' : 'it'
  const locale = contentLocale === 'en' ? 'en-US' : 'it-IT'

  const events = useMemo(() => getCalendarEvents(contentLocale), [contentLocale])
  const tagRegistry = useMemo(() => getCalendarTags(contentLocale), [contentLocale])
  const now = useMemo(() => new Date(), [])

  const [selectedId, setSelectedId] = useState<string | null>(events[0]?.id ?? null)
  const [selectedMobileOccurrence, setSelectedMobileOccurrence] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false)
  const [activeTagIndex, setActiveTagIndex] = useState(0)
  const tagMenuRef = useRef<HTMLDivElement | null>(null)
  const tagTriggerRef = useRef<HTMLButtonElement | null>(null)
  const tagOptionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const launchQuery =
    launchIntent?.appId === 'calendar' ? launchIntent.query?.trim().toLowerCase() ?? '' : ''

  const nowIndex = toMonthIndex(now.getFullYear(), now.getMonth() + 1)

  const getEventTagIds = (event: WorkExperienceEvent) => event.tagIds ?? event.tags ?? []

  const getEventRole = (event: WorkExperienceEvent) => event.role?.trim() || event.name?.trim() || event.id

  const getEventCompanyName = (event: WorkExperienceEvent) => event.companyName?.trim() || ''

  const resolveTag = (tagId: string) => {
    return getCalendarTagById(contentLocale, tagId) ?? { id: tagId, label: tagId, icon: undefined }
  }

  const availableTags = useMemo(() => {
    const tagIds = new Set<string>()
    for (const event of events) {
      for (const tagId of getEventTagIds(event)) tagIds.add(tagId)
    }
    return [...tagIds]
      .map((tagId) => tagRegistry.find((tag) => tag.id === tagId) ?? { id: tagId, label: tagId, icon: undefined })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [events, tagRegistry])

  const tagOptions = useMemo<TagOption[]>(
    () => [{ id: 'all', label: t('calendar.filters.all') }, ...availableTags],
    [availableTags, t],
  )

  const selectedTagOption =
    tagOptions.find((option) => option.id === selectedTag) ?? { id: selectedTag, label: selectedTag, icon: undefined }

  const closeTagMenu = () => {
    setIsTagMenuOpen(false)
    setTimeout(() => tagTriggerRef.current?.focus(), 0)
  }

  const selectTagOption = (tagId: string) => {
    setSelectedTag(tagId)
    closeTagMenu()
  }

  const moveActiveTag = (delta: number) => {
    if (!tagOptions.length) return
    const next = (activeTagIndex + delta + tagOptions.length) % tagOptions.length
    setActiveTagIndex(next)
  }

  const onTagTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const selectedIndex = Math.max(0, tagOptions.findIndex((option) => option.id === selectedTag))
      const next = event.key === 'ArrowDown'
        ? (selectedIndex + 1) % tagOptions.length
        : (selectedIndex - 1 + tagOptions.length) % tagOptions.length
      setActiveTagIndex(next)
      setIsTagMenuOpen(true)
    }
  }

  const onTagMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveActiveTag(1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveActiveTag(-1)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const option = tagOptions[activeTagIndex]
      if (option) selectTagOption(option.id)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      closeTagMenu()
    }
  }

  useEffect(() => {
    if (!isTagMenuOpen) return

    const selectedIndex = Math.max(0, tagOptions.findIndex((option) => option.id === selectedTag))
    setActiveTagIndex(selectedIndex)

    const onPointerDown = (event: PointerEvent) => {
      if (!tagMenuRef.current) return
      if (tagMenuRef.current.contains(event.target as Node)) return
      setIsTagMenuOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeTagMenu()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isTagMenuOpen, selectedTag, tagOptions])

  useEffect(() => {
    if (!isTagMenuOpen) return
    tagOptionRefs.current[activeTagIndex]?.focus()
  }, [activeTagIndex, isTagMenuOpen])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventTagIds = getEventTagIds(event)
      const tagFilterOk = selectedTag === 'all' || eventTagIds.includes(selectedTag)
      const queryFilterOk =
        !launchQuery ||
        getEventRole(event).toLowerCase().includes(launchQuery) ||
        getEventCompanyName(event).toLowerCase().includes(launchQuery) ||
        event.description.toLowerCase().includes(launchQuery) ||
        event.id.toLowerCase().includes(launchQuery) ||
        eventTagIds.some((tagId) => resolveTag(tagId).label.toLowerCase().includes(launchQuery))
      return tagFilterOk && queryFilterOk
    })
  }, [contentLocale, events, launchQuery, selectedTag])

  const allYears = useMemo(() => {
    const years: number[] = []
    for (let y = CALENDAR_START_YEAR; y <= now.getFullYear(); y++) years.push(y)
    return sortOrder === 'desc' ? [...years].reverse() : years
  }, [now, sortOrder])

  const getEventColor = (event: WorkExperienceEvent) => {
    const customColor = event.barColor?.trim()
    if (customColor) return customColor
    const idx = events.findIndex((e) => e.id === event.id)
    const safeIndex = idx >= 0 ? idx : 0
    return EVENT_COLORS[safeIndex % EVENT_COLORS.length]
  }

  const selectedEvent =
    filteredEvents.find((e) => e.id === selectedId) ?? filteredEvents[0] ?? null
  const selectedRole = selectedEvent ? getEventRole(selectedEvent) : ''
  const selectedCompany = selectedEvent ? getEventCompanyName(selectedEvent) : ''

  return (
    <div className="flex h-full flex-col bg-(--app-surface-1) text-(--window-text)">
      <header className="shrink-0 border-b border-[var(--app-border)] px-5 pt-4 pb-3">
        <h1 className="mb-1 text-2xl">{t('calendar.heading')}</h1>
        <p className="text-(--app-muted)">{t('calendar.subheading')}</p>
        <div className="mt-2.5 flex flex-wrap items-end gap-2.5">
          <label className="flex flex-col gap-1 text-xs text-(--app-muted)">
            <span>{t('calendar.filters.tag')}</span>
            <div className="relative" ref={tagMenuRef}>
              <button
                ref={tagTriggerRef}
                type="button"
                className="flex h-8 min-w-40 items-center justify-between gap-2 rounded-lg border border-(--app-border) bg-(--app-surface-1) px-2 text-(--window-text)"
                aria-haspopup="listbox"
                aria-expanded={isTagMenuOpen}
                aria-controls="calendar-tag-listbox"
                onClick={() => setIsTagMenuOpen((prev) => !prev)}
                onKeyDown={onTagTriggerKeyDown}
              >
                <span className="inline-flex items-center gap-1.5 truncate">
                  {selectedTagOption.icon ? (
                    <img src={selectedTagOption.icon.src} alt={selectedTagOption.icon.alt} className="h-3.5 w-3.5 shrink-0 object-contain" />
                  ) : null}
                  {selectedTagOption.label}
                </span>
                <span className="text-[10px] text-(--app-muted)">{isTagMenuOpen ? '▲' : '▼'}</span>
              </button>

              {isTagMenuOpen ? (
                <div
                  id="calendar-tag-listbox"
                  role="listbox"
                  aria-activedescendant={`calendar-tag-option-${tagOptions[activeTagIndex]?.id ?? 'all'}`}
                  className="absolute z-20 mt-1 max-h-60 min-w-52 overflow-auto rounded-lg border border-(--app-border) bg-(--app-surface-1) p-1 shadow-lg"
                  onKeyDown={onTagMenuKeyDown}
                >
                  {tagOptions.map((tag, index) => (
                    <button
                      key={tag.id}
                      id={`calendar-tag-option-${tag.id}`}
                      ref={(el) => {
                        tagOptionRefs.current[index] = el
                      }}
                      type="button"
                      role="option"
                      aria-selected={selectedTag === tag.id}
                      className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${selectedTag === tag.id ? 'bg-(--app-surface-3)' : 'hover:bg-(--app-surface-2)'}`}
                      onClick={() => selectTagOption(tag.id)}
                    >
                      {tag.icon ? <img src={tag.icon.src} alt={tag.icon.alt} className="h-3.5 w-3.5 object-contain" /> : null}
                      {tag.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </label>
          <button
            type="button"
            className="h-8 rounded-lg border border-[var(--app-border)] bg-(--app-surface-3) px-2.5 text-(--window-text)"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
          >
            {sortOrder === 'desc' ? t('calendar.sort.desc') : t('calendar.sort.asc')}
          </button>
        </div>
      </header>

      {filteredEvents.length ? (
        isPhone ? (
          <section className="overflow-auto px-3.5 py-3" aria-label={t('calendar.timeline.label')}>
            {allYears.map((year) => {
              const yearStart = toMonthIndex(year, 1)
              const yearEnd = toMonthIndex(year, 12)
              const yearEvents = filteredEvents.filter((ev) => {
                const r = eventRange(ev, now)
                return r.start <= yearEnd && r.end >= yearStart
              })

              if (!yearEvents.length) return null

              return (
                <div key={`mobile-year-${year}`} className="mb-4 rounded-xl border border-(--app-border) bg-(--app-surface-2) p-3">
                  <h3 className="mb-2 text-base font-semibold text-(--window-text)">{year}</h3>

                  <div className="flex flex-col gap-2">
                    {yearEvents.map((event) => {
                      const occurrenceId = `${year}-${event.id}`
                      const isSelected = selectedMobileOccurrence === occurrenceId
                      const color = getEventColor(event)
                      const role = getEventRole(event)
                      const companyName = getEventCompanyName(event)

                      return (
                        <button
                          key={`mobile-event-${event.id}`}
                          type="button"
                          className={`rounded-lg border p-2 text-left ${isSelected ? 'border-blue-400/60 bg-blue-500/15' : 'border-(--app-border) bg-(--app-surface-1)'}`}
                          onClick={() => {
                            setSelectedId(event.id)
                            setSelectedMobileOccurrence((prev) => (prev === occurrenceId ? null : occurrenceId))
                          }}
                        >
                          <span className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-(--window-text)">
                            <img src={event.icon.src} alt={event.icon.alt} className="h-4 w-4 object-contain" />
                            <span className="truncate">{companyName || role}</span>
                          </span>
                          <span className="mb-1 inline-block rounded-sm px-1.5 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: color }}>
                            {role}
                          </span>
                          <span className="block text-xs font-semibold" style={{ color }}>
                            {periodLabel(event, locale, t)}
                          </span>
                          {isSelected ? (
                            <>
                              <span className="mt-1.5 block text-xs leading-5 text-(--window-text)">
                                {event.description}
                              </span>
                              {getEventTagIds(event).length > 0 ? (
                                <span className="mt-1.5 flex flex-wrap gap-1.5">
                                  {getEventTagIds(event).map((tagId) => {
                                    const tag = resolveTag(tagId)
                                    return (
                                      <span key={`mobile-tag-${event.id}-${tag.id}`} className="inline-flex items-center gap-1 rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-[11px] text-(--app-muted)">
                                        {tag.icon ? <img src={tag.icon.src} alt={tag.icon.alt} className="h-3.5 w-3.5 object-contain" /> : null}
                                        {tag.label}
                                      </span>
                                    )
                                  })}
                                </span>
                              ) : null}
                            </>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_260px]">
          <section className="overflow-auto px-3.5 py-3" aria-label={t('calendar.timeline.label')}>
            {allYears.map((year) => {
              const yearStart = toMonthIndex(year, 1)
              const yearEnd = toMonthIndex(year, 12)
              const yearEvents = filteredEvents.filter((ev) => {
                const r = eventRange(ev, now)
                return r.start <= yearEnd && r.end >= yearStart
              })
              if (!yearEvents.length) return null

              return (
                <div key={year} className="mb-5">
                  <div className="calendar-gantt-header mb-0.5 border-b border-[var(--app-border)] bg-(--app-surface-2) pb-1">
                    <div className="self-center px-2 py-1 text-[15px] font-bold text-(--window-text)">{year}</div>
                    {MONTHS.map((m) => (
                      <div key={m} className="px-0.5 py-1 text-center text-[10px] tracking-[0.04em] text-(--app-muted) uppercase">
                        {monthLabel(locale, m)}
                      </div>
                    ))}
                  </div>

                  {yearEvents.map((event) => {
                    const range = eventRange(event, now)
                    const segStart = Math.max(range.start, yearStart)
                    const segEnd = Math.min(range.end, yearEnd)
                    const activeStart = segStart - yearStart + 1
                    const activeEnd = segEnd - yearStart + 1
                    const color = getEventColor(event)
                    const isSelected = event.id === selectedEvent?.id
                    const role = getEventRole(event)
                    const companyName = getEventCompanyName(event)

                    return (
                      <button
                        key={event.id}
                        type="button"
                        className={`calendar-gantt-row relative mb-0.5 min-h-8.5 items-center rounded border border-transparent p-0 text-left ${isSelected ? 'border-blue-400/60 bg-blue-500/20' : 'bg-transparent hover:border-[var(--app-border)] hover:bg-(--app-surface-2)'}`}
                        style={{ '--event-color': color } as React.CSSProperties}
                        onClick={() => setSelectedId(event.id)}
                      >
                        <div
                          className="flex items-center gap-1.5 overflow-hidden px-2 py-1 text-xs text-(--window-text)"
                          style={{ gridColumn: '1 / 2', gridRow: 1 }}
                        >
                          <img src={event.icon.src} alt={event.icon.alt} className="h-4 w-4 shrink-0 object-contain" />
                          <span className="truncate whitespace-nowrap">{companyName || role}</span>
                        </div>

                        <div
                          className="calendar-gantt-rolebar self-center"
                          style={{ gridColumn: `${activeStart + 1} / ${activeEnd + 2}`, gridRow: 1 }}
                        >
                          <span className="truncate">{role}</span>
                          <span className="calendar-gantt-tooltip" role="tooltip">{role}</span>
                        </div>

                        {MONTHS.map((m) => {
                          const mi = toMonthIndex(year, m)
                          const isFuture = mi > nowIndex
                          const cls = [
                            'gantt-cell',
                            isFuture ? 'gantt-cell--future' : '',
                          ].filter(Boolean).join(' ')
                          return <div key={m} className={cls} style={{ gridColumn: m + 1, gridRow: 1 }} />
                        })}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </section>

          {selectedEvent ? (
            <aside
              className="overflow-auto border-l border-[var(--app-border)] border-t-[3px] border-t-transparent p-4.5"
              aria-live="polite"
              style={{ borderTopColor: getEventColor(selectedEvent) } as React.CSSProperties}
            >
              <img
                src={selectedEvent.icon.src}
                alt={selectedEvent.icon.alt}
                className="h-18 w-18 rounded-[10px] border-2 border-transparent object-cover"
                style={{ borderColor: getEventColor(selectedEvent) } as React.CSSProperties}
              />
              <h2 className="mt-3 mb-1.5 text-base">{selectedRole}</h2>
              {selectedCompany ? (
                <p className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-(--app-muted)">
                  <img src={selectedEvent.icon.src} alt={selectedEvent.icon.alt} className="h-3.5 w-3.5 object-contain" />
                  {selectedCompany}
                </p>
              ) : null}
              <p
                className="mb-2.5 text-[13px] font-semibold"
                style={{ color: getEventColor(selectedEvent) }}
              >
                {periodLabel(selectedEvent, locale, t)}
              </p>
              <p className="mb-3 text-[13px] leading-[1.55] text-(--window-text)">{selectedEvent.description}</p>
              {getEventTagIds(selectedEvent).length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {getEventTagIds(selectedEvent).map((tagId) => {
                    const tag = resolveTag(tagId)
                    return (
                      <span key={tag.id} className="inline-flex items-center gap-1 rounded-full border border-[var(--app-border)] bg-(--app-surface-2) px-2 py-0.5 text-[11px] text-(--app-muted)">
                        {tag.icon ? <img src={tag.icon.src} alt={tag.icon.alt} className="h-3.5 w-3.5 object-contain" /> : null}
                        {tag.label}
                      </span>
                    )
                  })}
                </div>
              )}
            </aside>
          ) : null}
        </div>
        )
      ) : (
        <p className="m-5 text-(--app-muted)">{t('calendar.empty')}</p>
      )}
    </div>
  )
}
