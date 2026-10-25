import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { DesktopAppProps } from '../desktop/types'
import { getAboutContent } from '../desktop/resources/about'
import { resolveAssetPath } from '../desktop/utils/assetPath'
import { Icon } from '../desktop-shell/components/Icon'
import type { IconName } from '../desktop-shell/components/Icon'

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="profile-card">
    <h2 className="profile-card__title">{title}</h2>
    {children}
  </section>
)

const InfoRow = ({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) => (
  <div className="flex items-start gap-3 py-2">
    <span className="profile-info-icon" aria-hidden="true">
      <Icon name={icon} className="h-4 w-4" />
    </span>
    <div className="min-w-0 flex-1">
      <dt className="text-[11px] uppercase tracking-wider text-(--app-muted)">{label}</dt>
      <dd className="m-0 text-sm break-words">{children}</dd>
    </div>
  </div>
)

export function AboutApp({ i18nApi }: DesktopAppProps) {
  const t = i18nApi?.t ?? ((key: string) => key)
  const locale = i18nApi?.locale ?? 'it'
  const content = getAboutContent(locale)
  const intlLocale = locale === 'en' ? 'en-US' : 'it-IT'
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false)

  useEffect(() => {
    if (!hasCopiedEmail) return
    const timer = window.setTimeout(() => setHasCopiedEmail(false), 1800)
    return () => window.clearTimeout(timer)
  }, [hasCopiedEmail])

  const birthday = new Date(content.info.birthday)
  const now = new Date()
  const age =
    now.getFullYear() -
    birthday.getFullYear() -
    (now < new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate()) ? 1 : 0)
  const birthdayLabel = new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'long', year: 'numeric' }).format(birthday)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(content.info.email.replace('[at]', '@'))
      setHasCopiedEmail(true)
    } catch {
      setHasCopiedEmail(false)
    }
  }

  return (
    <div className="@container h-full overflow-auto bg-(--app-surface-1) text-(--window-text)">
      <header className="profile-cover" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-5 pb-8 @2xl:px-8">
        <div className="-mt-12 flex flex-col items-start gap-3 @lg:flex-row @lg:items-end @lg:gap-4">
          <div className="profile-avatar">
            <img src={resolveAssetPath('/profile/avatar.jpg')} alt="Davide Maggi" width={96} height={96} />
          </div>
          <div className="w-full min-w-0 flex-1 pb-1">
            <h1 className="m-0 font-display text-2xl font-semibold tracking-tight @2xl:text-3xl">Davide Maggi</h1>
            <p className="m-0 mt-1 text-sm text-(--app-muted)">{content.headline}</p>
          </div>
          <div className="flex gap-2 pb-1">
            {content.socials.slice(0, 3).map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="profile-icon-btn"
                aria-label={social.label}
                title={social.label}
              >
                <img src={resolveAssetPath(social.icon)} alt="" className="h-5 w-5 object-contain" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 @2xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-4">
            <Section title={content.greeting}>
              <div className="flex flex-col gap-3 text-[14.5px] leading-relaxed">
                {content.bio.map((paragraph) => (
                  <p key={paragraph} className="m-0">{paragraph}</p>
                ))}
              </div>
              <p className="profile-signoff m-0 mt-4">{content.signOff}</p>
            </Section>

            <Section title={t('profile.section.interests')}>
              <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 @lg:grid-cols-2">
                {content.interests.map((interest) => (
                  <li key={interest.label} className="profile-chip">
                    <img
                      src={resolveAssetPath(interest.icon)}
                      alt=""
                      className={`h-6 w-6 shrink-0 object-contain ${interest.mono ? 'profile-mono-icon' : ''}`}
                    />
                    <span className="text-sm">{interest.label}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={t('profile.section.causes')}>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {content.causes.map((cause) => (
                  <li key={cause.href}>
                    <a href={cause.href} target="_blank" rel="noreferrer" className="profile-link-row">
                      <img src={resolveAssetPath(cause.icon)} alt="" className="h-6 w-8 shrink-0 object-contain" />
                      <span className="flex-1 text-sm">{cause.text}</span>
                      <Icon name="externalLink" className="h-4 w-4 opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <aside className="flex min-w-0 flex-col gap-4">
            <Section title={t('profile.section.info')}>
              <dl className="m-0 divide-y divide-(--app-border)">
                <InfoRow icon="mail" label={t('profile.field.email')}>
                  <span className="inline-flex flex-wrap items-center gap-2">
                    {content.info.email}
                    <button type="button" className="profile-copy-btn" onClick={copyEmail}>
                      <Icon name={hasCopiedEmail ? 'check' : 'copy'} className="h-3.5 w-3.5" />
                      {hasCopiedEmail ? t('profile.copied') : t('profile.action.copy')}
                    </button>
                  </span>
                </InfoRow>
                <InfoRow icon="mapPin" label={t('profile.field.location')}>{content.info.location}</InfoRow>
                <InfoRow icon="cake" label={t('profile.field.birthday')}>
                  {birthdayLabel} <span className="text-(--app-muted)">· {t('profile.age', { age: String(age) })}</span>
                </InfoRow>
                <InfoRow icon="lock" label={t('profile.field.phone')}>{content.info.phone}</InfoRow>
              </dl>
            </Section>

            <Section title={t('profile.section.languages')}>
              <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
                {content.info.languages.map((language) => (
                  <li key={language.label} className="profile-chip">
                    <img src={resolveAssetPath(language.icon)} alt="" className="h-4 w-6 shrink-0 rounded-[3px] object-cover" />
                    <span className="text-sm">{language.label}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={t('profile.section.socials')}>
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {content.socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer" className="profile-link-row">
                      <img src={resolveAssetPath(social.icon)} alt="" className="h-5 w-5 shrink-0 object-contain" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{social.label}</span>
                        <span className="block truncate text-xs text-(--app-muted)">{social.handle}</span>
                      </span>
                      <Icon name="externalLink" className="h-4 w-4 opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          </aside>
        </div>
      </div>
    </div>
  )
}
