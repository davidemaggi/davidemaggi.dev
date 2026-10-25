import { useRef } from 'react'
import { SOCIAL_LINKS } from '../../desktop/resources/profile'
import type { AppId, Locale } from '../../desktop/types'
import { resolveAssetPath } from '../../desktop/utils/assetPath'
import { useProfileSummary } from '../../desktop-shell/hooks/useProfileSummary'
import { triggerEasterEgg } from '../../desktop-shell/utils/easterEgg'

type MobileProfileCardProps = {
  locale: Locale
  now: Date
  t: (key: string, vars?: Record<string, string>) => string
  onOpenApp: (id: AppId) => void
}

export function MobileProfileCard({ locale, now, t, onOpenApp }: MobileProfileCardProps) {
  const { currentRole, stats } = useProfileSummary(locale, now, t)
  // No keyboard on phones: five quick taps on the name stand in for the Konami code.
  const tapsRef = useRef<number[]>([])
  const onNameTap = () => {
    const now = Date.now()
    tapsRef.current = [...tapsRef.current.filter((time) => now - time < 2500), now]
    if (tapsRef.current.length >= 5) {
      tapsRef.current = []
      triggerEasterEgg()
    }
  }

  return (
    <article className="widget glass mb-6 p-4" aria-labelledby="mobile-profile-name">
      <p className="hero__eyebrow m-0 inline-flex items-center gap-2 text-[10.5px] opacity-80">
        <span className="hero__status-dot" aria-hidden="true" />
        {t('hero.status')}
      </p>
      <h1 id="mobile-profile-name" className="hero__name m-0 mt-3 text-[2.6rem] select-none" onClick={onNameTap}>
        Davide <span className="hero__name-outline">Maggi</span>
      </h1>
      {currentRole ? (
        <p className="m-0 mt-2 font-display text-[15px]">
          <span className="text-gradient font-semibold">{currentRole.role}</span>
          <span className="opacity-70"> @ {currentRole.companyName}</span>
        </p>
      ) : null}

      <dl className="m-0 mt-4 grid grid-cols-4 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="m-0">
              <span className="hero-stat__value block text-xl">{stat.value}</span>
              <span className="block text-[10.5px] leading-tight opacity-70">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="hero-action hero-action--primary flex-1 justify-center text-sm"
          onClick={() => onOpenApp('calendar')}
        >
          {t('hero.action.experience')}
        </button>
        {SOCIAL_LINKS.slice(0, 2).map((link) => (
          <a
            key={link.id}
            className="hero-social glass shrink-0"
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
          >
            <img src={resolveAssetPath(link.icon)} alt="" />
          </a>
        ))}
      </div>
    </article>
  )
}
