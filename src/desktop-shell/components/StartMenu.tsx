import type { AppId, DesktopPreferences } from '../../desktop/types'
import { renderAppIcon, resolveAppIcon } from '../utils/icons'

type StartMenuApp = {
  id: AppId
  title: string
}

type StartMenuProps = {
  isOpen: boolean
  apps: StartMenuApp[]
  preferences: DesktopPreferences
  t: (key: string, vars?: Record<string, string>) => string
  searchQuery: string
  onSearchFocus: () => void
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onLaunch: (id: AppId) => void
  onClose: () => void
}

export function StartMenu({
  isOpen,
  apps,
  preferences,
  t,
  searchQuery,
  onSearchFocus,
  onSearchChange,
  onSearchSubmit,
  onLaunch,
  onClose,
}: StartMenuProps) {
  if (!isOpen) return null

  return (
    <section
      className="start-menu absolute bottom-24 left-1/2 z-25 max-h-[min(68vh,620px)] w-[min(92vw,760px)] -translate-x-1/2 overflow-auto rounded-2xl border border-white/25 bg-[#0f1118d9] p-4 text-slate-200 shadow-[0_28px_56px_#00000085] backdrop-blur-2xl"
      aria-label={t('desktop.start')}
    >
      <header className="start-menu__header">
        <h2 className="text-base font-semibold text-slate-100">Launchpad</h2>
        <p className="mt-0.5 text-xs text-slate-300">{t('start.pinned')}</p>
        <input
          className="mt-3 h-10 w-full rounded-xl border border-white/15 bg-black/25 px-3 text-[13px] text-slate-100 placeholder:text-slate-300/70"
          value={searchQuery}
          onFocus={onSearchFocus}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSearchSubmit()
            }
          }}
          placeholder={t('desktop.search.placeholder')}
          aria-label={t('desktop.search.placeholder')}
        />
      </header>

      <div className="start-menu__apps mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {apps.length ? (
          apps.map((app) => (
            <button
              key={app.id}
              className="start-menu__app inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/7 px-3 text-left"
              onClick={() => onLaunch(app.id)}
            >
              {renderAppIcon(resolveAppIcon(app.id, preferences), 'h-5 w-5 object-contain')}
              <span>{app.title}</span>
            </button>
          ))
        ) : (
          <p className="start-menu__empty col-span-2 mt-1 text-sm text-slate-400">{t('start.noResults')}</p>
        )}
      </div>

      <div className="start-menu__section mt-3.5">
        <h3 className="text-sm text-slate-300">{t('start.quickActions')}</h3>
        <div className="start-menu__actions mt-2 flex flex-wrap gap-2">
          <button
            className="h-8 rounded-full border border-white/20 bg-white/10 px-3"
            onClick={() => onLaunch('settings')}
          >
            {t('start.openSettings')}
          </button>
          <button
            className="h-8 rounded-full border border-white/20 bg-white/10 px-3"
            onClick={() => onLaunch('terminal')}
          >
            {t('start.openTerminal')}
          </button>
        </div>
      </div>

      <div className="start-menu__section start-menu__section--power mt-3.5">
        <h3 className="text-sm text-slate-300">{t('start.power')}</h3>
        <div className="start-menu__actions mt-2 flex flex-wrap gap-2">
          <button className="h-8 rounded-full border border-white/20 bg-white/10 px-3" onClick={onClose}>{t('start.power.sleep')}</button>
          <button className="h-8 rounded-full border border-white/20 bg-white/10 px-3" onClick={onClose}>{t('start.power.restart')}</button>
          <button className="h-8 rounded-full border border-white/20 bg-white/10 px-3" onClick={onClose}>{t('start.power.shutdown')}</button>
        </div>
      </div>
    </section>
  )
}
