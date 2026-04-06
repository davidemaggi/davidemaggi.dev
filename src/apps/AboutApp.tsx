import type { DesktopAppProps } from '../desktop/types'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { getAboutContent } from '../desktop/resources/about'
import { resolveAssetPath } from '../desktop/utils/assetPath'

export function AboutApp({ i18nApi }: DesktopAppProps) {
  const t = i18nApi?.t ?? ((key: string) => key)
  const locale = i18nApi?.locale ?? 'it'
  const aboutContent = getAboutContent(locale)

  return (
    <div className="flex h-full flex-col bg-(--app-surface-1) text-(--window-text)">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-xs sm:text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-[#2b579a] font-semibold text-white">W</span>
          <strong className="truncate">{t('about.editor.title')}</strong>
        </div>
        <span className="text-(--app-muted)">{t('about.editor.status')}</span>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-(--app-border) bg-(--app-surface-1) px-2 py-1.5 text-xs sm:text-sm">
        <button type="button" className="rounded px-2 py-1 hover:bg-(--app-surface-3)">{t('about.toolbar.file')}</button>
        <button type="button" className="rounded px-2 py-1 hover:bg-(--app-surface-3)">{t('about.toolbar.home')}</button>
        <button type="button" className="rounded px-2 py-1 hover:bg-(--app-surface-3)">{t('about.toolbar.insert')}</button>
        <button type="button" className="rounded px-2 py-1 hover:bg-(--app-surface-3)">{t('about.toolbar.view')}</button>
      </div>

      <div className="flex-1 overflow-auto bg-(--app-surface-2) p-3 sm:p-5">
        <article className="mx-auto w-full max-w-3xl rounded-lg border border-(--app-border) bg-(--app-surface-1) p-4 shadow-sm sm:p-6">
          <div className="about-markdown max-w-none text-(--window-text)">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({ children }) => <h1 className="mb-3 text-xl font-semibold sm:text-2xl">{children}</h1>,
                p: ({ children }) => <p className="mb-3 text-sm leading-6 sm:text-[15px]">{children}</p>,
                ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
                li: ({ children }) => <li className="text-sm leading-6 sm:text-[15px]">{children}</li>,
                h2: ({ children }) => <h2 className="mb-2 text-lg font-semibold sm:text-xl">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-2 text-base font-semibold sm:text-lg">{children}</h3>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => <img src={resolveAssetPath(src ?? '')} alt={alt ?? ''} className="inline-block align-middle" />,
              }}
            >
              {aboutContent.markdown}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}


