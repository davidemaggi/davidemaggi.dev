import { useMemo, useState } from 'react'
import { useIsPhone } from '../mobile-shell/hooks/useIsPhone'
import { getCertificateFolders } from '../desktop/resources/certManager'
import type { CertificateItem } from '../desktop/resources/certManager/types'
import type { DesktopAppProps, Locale } from '../desktop/types'

const CERT_ICON_SRC = '/icons/certificate.svg'

export function CertManagerApp({ i18nApi }: DesktopAppProps) {
  const t = i18nApi?.t ?? ((key: string) => key)
  const contentLocale: Locale = i18nApi?.locale === 'en' ? 'en' : 'it'
  const dateLocale = contentLocale === 'en' ? 'en-US' : 'it-IT'

  const folders = useMemo(() => getCertificateFolders(contentLocale), [contentLocale])
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(folders[0]?.id ?? null)
  const [selectedCertId, setSelectedCertId] = useState<string | null>(folders[0]?.certificates[0]?.id ?? null)
  const [lastActionLabel, setLastActionLabel] = useState<string | null>(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const isPhone = useIsPhone()

  const selectedFolder = folders.find((folder) => folder.id === expandedFolderId) ?? folders[0] ?? null

  const selectedCert: CertificateItem | null =
    folders.flatMap((folder) => folder.certificates).find((cert) => cert.id === selectedCertId)
      ?? selectedFolder?.certificates[0]
      ?? null

  const formatDate = (raw: string) => {
    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) return raw
    return new Intl.DateTimeFormat(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date)
  }

  const handleToolbarAction = (actionLabel: string) => {
    setLastActionLabel(actionLabel)
  }

  return (
    <div className="relative flex h-full bg-(--app-surface-1) text-(--window-text)">
      {isPhone && isNavOpen ? (
        <button
          type="button"
          className="absolute inset-0 z-10 bg-black/30"
          aria-label={t('certManager.nav.close')}
          onClick={() => setIsNavOpen(false)}
        />
      ) : null}

      <aside className={`${isPhone ? 'absolute inset-y-0 left-0 z-20 transition-transform duration-200' : 'relative shrink-0'} w-72 border-r border-(--app-border) bg-(--app-surface-2) ${isPhone ? (isNavOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}>
        <div className="flex items-center justify-between gap-2 border-b border-(--app-border) px-3 py-2 text-sm font-semibold">
          <span>{t('certManager.folders')}</span>
          <button
            type="button"
            className={`rounded border border-(--app-border) px-2 py-0.5 text-xs ${isPhone ? '' : 'hidden'}`}
            onClick={() => setIsNavOpen(false)}
          >
            {t('certManager.nav.close')}
          </button>
        </div>
        <div className="max-h-full overflow-auto p-2">
          {folders.map((folder) => {
            const isExpanded = expandedFolderId === folder.id
            return (
              <div key={folder.id} className="mb-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-(--app-surface-3)"
                  onClick={() => setExpandedFolderId(isExpanded ? null : folder.id)}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <img src="/icons/folder.svg" alt="Folder icon" className="h-4 w-4 shrink-0 object-contain" />
                    <span className="truncate">{folder.label}</span>
                  </span>
                  <span className="text-(--app-muted)">{isExpanded ? '-' : '+'}</span>
                </button>

                {isExpanded ? (
                  <div className="mt-1 space-y-1 pl-3">
                    {folder.certificates.map((cert) => {
                      const isActive = cert.id === selectedCert?.id
                      return (
                        <button
                          key={cert.id}
                          type="button"
                          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs ${isActive ? 'bg-blue-500/20 text-(--window-text)' : 'hover:bg-(--app-surface-3)'}`}
                          onClick={() => {
                            setSelectedCertId(cert.id)
                            setIsNavOpen(false)
                          }}
                        >
                          <img src={CERT_ICON_SRC} alt="Certificate icon" className="h-3.5 w-3.5 shrink-0 object-contain" />
                          <span className="truncate">{cert.commonName}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </aside>

      <section className="min-w-0 flex-1 overflow-auto p-4">
        <div className={`mb-3 ${isPhone ? '' : 'hidden'}`}>
          <button
            type="button"
            className="rounded border border-(--app-border) bg-(--app-surface-2) px-2.5 py-1.5 text-xs"
            onClick={() => setIsNavOpen(true)}
          >
            {t('certManager.nav.open')}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-(--app-border) pb-3">
          <button
            type="button"
            className="rounded border border-(--app-border) bg-(--app-surface-2) px-2.5 py-1 text-xs hover:bg-(--app-surface-3)"
            onClick={() => handleToolbarAction(t('certManager.action.import'))}
          >
            {t('certManager.action.import')}
          </button>
          <button
            type="button"
            className="rounded border border-(--app-border) bg-(--app-surface-2) px-2.5 py-1 text-xs hover:bg-(--app-surface-3)"
            onClick={() => handleToolbarAction(t('certManager.action.export'))}
            disabled={!selectedCert}
          >
            {t('certManager.action.export')}
          </button>
          <button
            type="button"
            className="rounded border border-(--app-border) bg-(--app-surface-2) px-2.5 py-1 text-xs hover:bg-(--app-surface-3)"
            onClick={() => handleToolbarAction(t('certManager.action.delete'))}
            disabled={!selectedCert}
          >
            {t('certManager.action.delete')}
          </button>
          <button
            type="button"
            className="rounded border border-(--app-border) bg-(--app-surface-2) px-2.5 py-1 text-xs hover:bg-(--app-surface-3)"
            onClick={() => handleToolbarAction(t('certManager.action.refresh'))}
          >
            {t('certManager.action.refresh')}
          </button>
          {lastActionLabel ? (
            <span className="ml-auto text-xs text-(--app-muted)">
              {t('certManager.action.status', { action: lastActionLabel })}
            </span>
          ) : null}
        </div>

        {selectedCert ? (
          <>
            <div className="mb-4 flex items-start gap-3 border-b border-(--app-border) pb-3">
              <img src={CERT_ICON_SRC} alt="Certificate icon" className="h-14 w-14 shrink-0 object-contain" />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{selectedCert.commonName}</h2>
                <p className="text-sm text-(--app-muted)">{selectedFolder?.label}</p>
              </div>
            </div>

            <dl className="grid grid-cols-[170px_1fr] gap-y-1 text-sm sm:grid-cols-[200px_1fr]">
              <dt className="text-(--app-muted)">{t('certManager.field.issuedBy')}</dt>
              <dd className="inline-flex min-w-0 items-center gap-1.5 truncate">
                {selectedCert.issuedByLogo ? (
                  <img
                    src={selectedCert.issuedByLogo.src}
                    alt={selectedCert.issuedByLogo.alt}
                    className="h-4 w-4 shrink-0 object-contain"
                  />
                ) : null}
                <span className="truncate">{selectedCert.issuedBy}</span>
              </dd>

              <dt className="text-(--app-muted)">{t('certManager.field.validFrom')}</dt>
              <dd>{formatDate(selectedCert.validFrom)}</dd>

              {selectedCert.validTo ? (
                <>
                  <dt className="text-(--app-muted)">{t('certManager.field.validTo')}</dt>
                  <dd>{formatDate(selectedCert.validTo)}</dd>
                </>
              ) : null}

              {selectedCert.serialNumber ? (
                <>
                  <dt className="text-(--app-muted)">{t('certManager.field.serialNumber')}</dt>
                  <dd className="truncate">{selectedCert.serialNumber}</dd>
                </>
              ) : null}

              {selectedCert.thumbprint ? (
                <>
                  <dt className="text-(--app-muted)">{t('certManager.field.thumbprint')}</dt>
                  <dd className="break-all">{selectedCert.thumbprint}</dd>
                </>
              ) : null}
            </dl>

            {selectedCert.description?.trim() ? (
              <div className="mt-6 rounded border border-(--app-border) bg-(--app-surface-2) p-3">
                <h3 className="mb-2 text-sm font-semibold">{t('certManager.description')}</h3>
                <p className="text-sm leading-6 text-(--window-text)">{selectedCert.description.trim()}</p>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-(--app-muted)">{t('certManager.empty')}</p>
        )}
      </section>
    </div>
  )
}

