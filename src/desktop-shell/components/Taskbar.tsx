import type { RefObject } from 'react'
import { DESKTOP_PLUGINS } from '../../desktop/plugins'
import type { AppId, DesktopPreferences, Locale } from '../../desktop/types'
import { formatDesktopDateTime } from '../../desktop/utils/dateTimeFormat'
import { StartMenu } from './StartMenu'
import { renderAppIcon, resolveAppIcon } from '../utils/icons'

type TaskbarWindowItem = {
  id: AppId
  isOpen: boolean
  isMinimized: boolean
}

type StartMenuApp = {
  id: AppId
  title: string
}

type TaskbarProps = {
  locale: Locale
  now: Date
  t: (key: string, vars?: Record<string, string>) => string
  preferences: DesktopPreferences
  windows: TaskbarWindowItem[]
  startMenuApps: StartMenuApp[]
  isStartMenuOpen: boolean
  searchQuery: string
  startAreaRef: RefObject<HTMLDivElement | null>
  onToggleStartMenu: () => void
  onSearchFocus: () => void
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onLaunchFromStart: (id: AppId) => void
  onCloseStart: () => void
  onTaskbarAppClick: (id: AppId, isMinimized: boolean) => void
}

export function Taskbar({
  locale,
  now,
  t,
  preferences,
  windows,
  startMenuApps,
  isStartMenuOpen,
  searchQuery,
  startAreaRef,
  onToggleStartMenu,
  onSearchFocus,
  onSearchChange,
  onSearchSubmit,
  onLaunchFromStart,
  onCloseStart,
  onTaskbarAppClick,
}: TaskbarProps) {
  const { formattedTime, formattedDate } = formatDesktopDateTime({
    now,
    locale,
    clockHourFormat: preferences.clockHourFormat,
    clockDateFormat: preferences.clockDateFormat,
  })

  return (
    <footer className="taskbar absolute right-0 bottom-0 left-0 z-20 flex h-11 items-center gap-2 border-t border-slate-800 bg-(--taskbar-bg) px-2.5">
      <div className="taskbar__left relative flex items-center gap-2" ref={startAreaRef}>
        <button
          className={`taskbar__start inline-flex h-8 items-center gap-2 rounded-md border px-2.5 ${
            isStartMenuOpen
              ? 'taskbar__start--active border-blue-900 bg-blue-700 text-slate-50'
              : 'border-slate-700 bg-slate-800 text-slate-50'
          }`}
          onClick={onToggleStartMenu}
        >
          <span className="start-logo grid h-3.5 w-3.5 grid-cols-2 gap-0.5" aria-hidden="true">
            <span className="block bg-current" />
            <span className="block bg-current" />
            <span className="block bg-current" />
            <span className="block bg-current" />
          </span>
          {t('desktop.start')}
        </button>

        <input
          className="taskbar__search h-8 w-55 rounded-full border border-slate-600 bg-slate-900 px-3 text-[13px] text-slate-200"
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

        <StartMenu
          isOpen={isStartMenuOpen}
          apps={startMenuApps}
          preferences={preferences}
          t={t}
          onLaunch={onLaunchFromStart}
          onClose={onCloseStart}
        />
      </div>

      <div className="taskbar__apps flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
        {windows
          .filter((windowItem) => windowItem.isOpen)
          .map((windowItem) => (
            <button
              key={windowItem.id}
              className={`taskbar__app h-7.5 rounded-md border px-2.5 ${
                windowItem.isMinimized
                  ? 'border-slate-600 bg-slate-900 text-gray-200'
                  : 'taskbar__app--active border-blue-900 bg-blue-700 text-gray-100'
              }`}
              onClick={() => onTaskbarAppClick(windowItem.id, windowItem.isMinimized)}
            >
              {renderAppIcon(resolveAppIcon(windowItem.id, preferences), 'mr-1 inline-block h-4.5 w-4.5 object-contain')}
              {t(DESKTOP_PLUGINS[windowItem.id].titleKey)}
            </button>
          ))}
      </div>

      <div className="taskbar__clock flex min-w-21.5 flex-col items-end text-xs leading-[1.1] text-slate-200" aria-label={t('desktop.clock.label')}>
        <span>{formattedTime}</span>
        <span>{formattedDate}</span>
      </div>
    </footer>
  )
}
