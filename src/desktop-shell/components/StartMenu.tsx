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
  onLaunch: (id: AppId) => void
  onClose: () => void
}

export function StartMenu({
  isOpen,
  apps,
  preferences,
  t,
  onLaunch,
  onClose,
}: StartMenuProps) {
  if (!isOpen) return null

  return (
    <section
      className="start-menu absolute bottom-12 left-0 z-5 max-h-[min(70vh,560px)] w-90 overflow-auto rounded-xl border border-slate-700 bg-slate-950/90 p-3 text-slate-200 shadow-[0_20px_45px_#00000080] backdrop-blur-[10px]"
      aria-label={t('desktop.start')}
    >
      <header className="start-menu__header">
        <h2 className="text-sm text-slate-300">{t('start.pinned')}</h2>
      </header>

      <div className="start-menu__apps mt-2 grid grid-cols-2 gap-2">
        {apps.length ? (
          apps.map((app) => (
            <button
              key={app.id}
              className="start-menu__app inline-flex h-8.5 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-left"
              onClick={() => onLaunch(app.id)}
            >
              {renderAppIcon(resolveAppIcon(app.id, preferences), 'h-4.5 w-4.5 object-contain')}
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
            className="h-7.5 rounded-full border border-slate-600 bg-slate-800 px-2.5"
            onClick={() => onLaunch('settings')}
          >
            {t('start.openSettings')}
          </button>
          <button
            className="h-7.5 rounded-full border border-slate-600 bg-slate-800 px-2.5"
            onClick={() => onLaunch('terminal')}
          >
            {t('start.openTerminal')}
          </button>
        </div>
      </div>

      <div className="start-menu__section start-menu__section--power mt-3.5">
        <h3 className="text-sm text-slate-300">{t('start.power')}</h3>
        <div className="start-menu__actions mt-2 flex flex-wrap gap-2">
          <button className="h-7.5 rounded-full border border-slate-600 bg-slate-800 px-2.5" onClick={onClose}>{t('start.power.sleep')}</button>
          <button className="h-7.5 rounded-full border border-slate-600 bg-slate-800 px-2.5" onClick={onClose}>{t('start.power.restart')}</button>
          <button className="h-7.5 rounded-full border border-slate-600 bg-slate-800 px-2.5" onClick={onClose}>{t('start.power.shutdown')}</button>
        </div>
      </div>
    </section>
  )
}
