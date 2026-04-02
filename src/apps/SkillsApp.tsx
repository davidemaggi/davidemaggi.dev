import { useEffect, useMemo, useState } from 'react'
import { getSkillTracks } from '../desktop/resources/skills'
import type { SkillTrack } from '../desktop/resources/skills/types'
import type { DesktopAppProps } from '../desktop/types'

const TRACK_DURATION_SECONDS = 180

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function SkillsApp({ i18nApi, launchIntent }: DesktopAppProps) {
  const t = i18nApi?.t ?? ((key: string) => key)
  const locale = i18nApi?.locale ?? 'it'

  const tracks = useMemo(() => getSkillTracks(locale), [locale])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progressSeconds, setProgressSeconds] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const timer = window.setInterval(() => {
      setProgressSeconds((prev) => {
        if (prev >= TRACK_DURATION_SECONDS) {
          return TRACK_DURATION_SECONDS
        }
        return prev + 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [isPlaying])

  const launchQuery = launchIntent?.appId === 'skills' ? launchIntent.query?.trim().toLowerCase() : ''

  const queriedTrack = useMemo(() => {
    if (!launchQuery) return null

    return tracks.find((track) => {
      return (
        track.title.toLowerCase().includes(launchQuery) ||
        track.description.toLowerCase().includes(launchQuery) ||
        track.id.toLowerCase().includes(launchQuery) ||
        (track.tags ?? []).some((tag) => tag.toLowerCase().includes(launchQuery))
      )
    })
  }, [launchQuery, tracks])

  useEffect(() => {
    if (!queriedTrack) return

    const raf = window.requestAnimationFrame(() => {
      setActiveId(queriedTrack.id)
      setIsPlaying(true)
      setProgressSeconds(0)
    })

    return () => {
      window.cancelAnimationFrame(raf)
    }
  }, [queriedTrack])

  const activeTrack: SkillTrack | null =
    tracks.find((track) => track.id === activeId) ?? tracks[0] ?? null

  const progressPercent = Math.min(100, (progressSeconds / TRACK_DURATION_SECONDS) * 100)

  return (
    <div className="flex h-full flex-col bg-(--app-surface-1) text-(--window-text)">
      <header className="px-5 pt-4 pb-2.5">
        <h1 className="mb-1 text-2xl">{t('skills.heading')}</h1>
        <p className="text-(--app-muted)">{t('skills.subheading')}</p>
      </header>

      {tracks.length ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[260px_1fr]">
          <aside className="overflow-auto border-b border-(--app-border) p-3 md:border-r md:border-b-0" aria-label={t('skills.list.label')}>
            {tracks.map((track) => (
              <button
                key={track.id}
                className={`inline-flex h-10.5 w-full items-center gap-2.5 rounded-lg border px-2 text-left ${track.id === activeTrack?.id ? 'border-(--skills-accent-border) bg-(--skills-accent-bg)' : 'border-transparent bg-transparent hover:bg-(--app-surface-3)'}`}
                onClick={() => {
                  setActiveId(track.id)
                  setProgressSeconds(0)
                }}
              >
                <img src={track.icon.src} alt={track.icon.alt} className="h-6.5 w-6.5 shrink-0 object-contain" />
                <span>{track.title}</span>
              </button>
            ))}
          </aside>

          {activeTrack ? (
            <section className="overflow-auto p-5" aria-live="polite">
              <img
                src={activeTrack.icon.src}
                alt={activeTrack.icon.alt}
                className="h-30 w-30 rounded-xl border border-(--skills-cover-border) bg-(--skills-cover-bg) object-cover"
                style={{ boxShadow: 'var(--skills-cover-shadow)' }}
              />
              <h2 className="mt-3.5 mb-2">{activeTrack.title}</h2>
              <p className="max-w-[60ch] text-(--window-text)">{activeTrack.description}</p>

              <dl className="mt-3.5 grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5">
                {activeTrack.level ? (
                  <>
                    <dt className="text-(--app-muted)">{t('skills.meta.level')}</dt>
                    <dd className="m-0">{activeTrack.level}</dd>
                  </>
                ) : null}

                {typeof activeTrack.years === 'number' ? (
                  <>
                    <dt className="text-(--app-muted)">{t('skills.meta.years')}</dt>
                    <dd className="m-0">{t('skills.meta.years.value', { years: String(activeTrack.years) })}</dd>
                  </>
                ) : null}

                {activeTrack.tags?.length ? (
                  <>
                    <dt className="text-(--app-muted)">{t('skills.meta.tags')}</dt>
                    <dd className="m-0">{activeTrack.tags.join(' • ')}</dd>
                  </>
                ) : null}
              </dl>

              <section className="mt-4 rounded-[10px] border border-(--app-border) bg-(--app-surface-2) p-3" aria-label={t('skills.player.label')}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    className="h-7.5 rounded-full border border-(--skills-accent-border) bg-(--skills-accent-bg) px-3 text-(--skills-accent-text)"
                    onClick={() => setIsPlaying((prev) => !prev)}
                  >
                    {isPlaying ? t('skills.player.pause') : t('skills.player.play')}
                  </button>
                  <span className="text-[13px] text-(--app-muted)">{t('skills.player.nowPlaying')}</span>
                </div>

                <div className="mt-2.5 grid grid-cols-[42px_1fr_42px] items-center gap-2 text-xs text-(--app-muted)">
                  <span>{formatDuration(progressSeconds)}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-(--app-surface-3)" role="progressbar" aria-valuenow={Math.round(progressPercent)} aria-valuemin={0} aria-valuemax={100}>
                    <span className="block h-full bg-linear-to-r from-green-500 to-green-400" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span>{formatDuration(TRACK_DURATION_SECONDS)}</span>
                </div>
              </section>
            </section>
          ) : null}
        </div>
      ) : (
        <p className="m-5 text-(--app-muted)">{t('skills.empty')}</p>
      )}
    </div>
  )
}
