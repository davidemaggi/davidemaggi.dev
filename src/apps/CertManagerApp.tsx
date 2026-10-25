import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { getCertificateFolders } from '../desktop/resources/certManager'
import type { CertificateItem } from '../desktop/resources/certManager/types'
import type { DesktopAppProps, Locale } from '../desktop/types'
import { resolveAssetPath } from '../desktop/utils/assetPath'
import { Icon } from '../desktop-shell/components/Icon'

const ALL_FOLDERS = 'all'

type CertificateWithFolder = CertificateItem & { folderId: string; folderLabel: string }

export function CertManagerApp({ i18nApi, launchIntent }: DesktopAppProps) {
  const t = i18nApi?.t ?? ((key: string) => key)
  const contentLocale: Locale = i18nApi?.locale === 'en' ? 'en' : 'it'
  const dateLocale = contentLocale === 'en' ? 'en-US' : 'it-IT'

  const folders = useMemo(() => getCertificateFolders(contentLocale), [contentLocale])
  const certificates = useMemo<CertificateWithFolder[]>(
    () =>
      folders
        .flatMap((folder) =>
          folder.certificates.map((cert) => ({ ...cert, folderId: folder.id, folderLabel: folder.label })),
        )
        .sort((a, b) => b.validFrom.localeCompare(a.validFrom)),
    [folders],
  )

  const [folderFilter, setFolderFilter] = useState(ALL_FOLDERS)
  const [query, setQuery] = useState('')
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null)
  const [hasCopiedSerial, setHasCopiedSerial] = useState(false)
  const [appliedLaunchToken, setAppliedLaunchToken] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  // Opening the app from the command palette selects the requested certificate.
  if (launchIntent?.appId === 'certManager' && launchIntent.query && launchIntent.token !== appliedLaunchToken) {
    setAppliedLaunchToken(launchIntent.token)
    if (certificates.some((cert) => cert.id === launchIntent.query)) {
      setSelectedCertId(launchIntent.query)
    }
  }

  const selectedCert = certificates.find((cert) => cert.id === selectedCertId) ?? null

  useEffect(() => {
    if (!selectedCert) return
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedCertId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedCert])

  useEffect(() => {
    if (!hasCopiedSerial) return
    const timer = window.setTimeout(() => setHasCopiedSerial(false), 1600)
    return () => window.clearTimeout(timer)
  }, [hasCopiedSerial])

  const visibleCertificates = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return certificates.filter((cert) => {
      const folderOk = folderFilter === ALL_FOLDERS || cert.folderId === folderFilter
      const queryOk =
        !normalized ||
        cert.commonName.toLowerCase().includes(normalized) ||
        cert.issuedBy.toLowerCase().includes(normalized)
      return folderOk && queryOk
    })
  }, [certificates, folderFilter, query])

  const formatDate = (
    raw: string,
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' },
  ) => {
    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) return raw
    return new Intl.DateTimeFormat(dateLocale, options).format(date)
  }

  const copySerial = async (serial: string) => {
    try {
      await navigator.clipboard.writeText(serial)
      setHasCopiedSerial(true)
    } catch {
      setHasCopiedSerial(false)
    }
  }

  const issuerCount = new Set(certificates.map((cert) => cert.issuedBy)).size
  const folderTabs = [
    { id: ALL_FOLDERS, label: t('certManager.folder.all'), count: certificates.length },
    ...folders.map((folder) => ({ id: folder.id, label: folder.label, count: folder.certificates.length })),
  ]

  return (
    <div className="@container relative flex h-full flex-col bg-(--app-surface-1) text-(--window-text)">
      <header className="app-header shrink-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="app-header__title">{t('certManager.heading')}</h1>
            <p className="app-header__subtitle">
              {t('certManager.subheading', { count: String(certificates.length), issuers: String(issuerCount) })}
            </p>
          </div>
          <label className="relative w-full @lg:w-64">
            <span className="sr-only">{t('certManager.search')}</span>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--app-muted)" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('certManager.search')}
              className="app-input w-full"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={t('certManager.folders')}>
          {folderTabs.map((folder) => (
            <button
              key={folder.id}
              type="button"
              aria-pressed={folderFilter === folder.id}
              className={`app-chip ${folderFilter === folder.id ? 'app-chip--active' : ''}`}
              onClick={() => setFolderFilter(folder.id)}
            >
              {folder.label}
              <span className="tabular-nums opacity-70">{folder.count}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4 @2xl:p-5">
        {visibleCertificates.length ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 @xl:grid-cols-2 @4xl:grid-cols-3">
            {visibleCertificates.map((cert, index) => (
              <li key={cert.id} style={{ '--i': Math.min(index, 12) } as CSSProperties} className="cert-card-wrap">
                <button type="button" className="cert-card" onClick={() => setSelectedCertId(cert.id)}>
                  <span className="cert-card__logo">
                    <img src={resolveAssetPath(cert.issuedByLogo?.src ?? '/icons/certificate.svg')} alt="" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] leading-snug font-medium line-clamp-2">{cert.commonName}</span>
                    <span className="mt-1 block truncate text-xs text-(--app-muted)">{cert.issuedBy}</span>
                  </span>
                  <span className="cert-card__year">{formatDate(cert.validFrom, { year: 'numeric' })}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid h-full place-items-center text-center text-sm text-(--app-muted)">
            <p className="m-0">{query ? t('certManager.noResults', { query }) : t('certManager.empty')}</p>
          </div>
        )}
      </div>

      {selectedCert ? (
        <div className="cert-sheet-backdrop" onClick={() => setSelectedCertId(null)}>
          <section
            className="cert-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-sheet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="cert-sheet__close"
              onClick={() => setSelectedCertId(null)}
              aria-label={t('certManager.nav.close')}
            >
              <Icon name="x" className="h-4 w-4" />
            </button>

            <div className="cert-diploma">
              <div className="cert-diploma__seal" aria-hidden="true">
                <Icon name="award" className="h-7 w-7" strokeWidth={1.8} />
              </div>
              <p className="cert-diploma__eyebrow">{t('certManager.certifies')}</p>
              <p className="cert-diploma__name">Davide Maggi</p>
              <p className="m-0 text-xs text-(--app-muted)">{t('certManager.completed')}</p>
              <h2 id="cert-sheet-title" className="cert-diploma__title">{selectedCert.commonName}</h2>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                {selectedCert.issuedByLogo ? (
                  <span className="cert-card__logo !h-8 !w-8 !rounded-lg !p-1.5">
                    <img src={resolveAssetPath(selectedCert.issuedByLogo.src)} alt="" />
                  </span>
                ) : null}
                <span className="font-medium">{selectedCert.issuedBy}</span>
              </div>
            </div>

            <dl className="cert-fields">
              <div>
                <dt>{t('certManager.field.validFrom')}</dt>
                <dd>{formatDate(selectedCert.validFrom)}</dd>
              </div>
              <div>
                <dt>{t('certManager.field.validTo')}</dt>
                <dd>{selectedCert.validTo ? formatDate(selectedCert.validTo) : t('certManager.noExpiry')}</dd>
              </div>
              <div>
                <dt>{t('certManager.field.folder')}</dt>
                <dd>{selectedCert.folderLabel}</dd>
              </div>
              {selectedCert.serialNumber ? (
                <div>
                  <dt>{t('certManager.field.serialNumber')}</dt>
                  <dd className="flex items-center gap-2">
                    <span className="truncate font-mono text-xs">{selectedCert.serialNumber}</span>
                    <button
                      type="button"
                      className="profile-copy-btn"
                      onClick={() => copySerial(selectedCert.serialNumber ?? '')}
                    >
                      <Icon name={hasCopiedSerial ? 'check' : 'copy'} className="h-3.5 w-3.5" />
                      {hasCopiedSerial ? t('profile.copied') : t('profile.action.copy')}
                    </button>
                  </dd>
                </div>
              ) : null}
            </dl>

            {selectedCert.description?.trim() ? (
              <p className="m-0 mt-4 text-sm leading-relaxed">{selectedCert.description.trim()}</p>
            ) : null}

            <p className="cert-verified">
              <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
              {t('certManager.verified')}
            </p>
          </section>
        </div>
      ) : null}
    </div>
  )
}
