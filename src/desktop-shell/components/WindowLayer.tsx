import type { PointerEvent as ReactPointerEvent } from 'react'
import { DESKTOP_PLUGINS } from '../../desktop/plugins'
import type {
  AppId,
  DesktopCommandApi,
  DesktopI18nApi,
  DesktopLaunchIntent,
  DesktopPreferences,
  DesktopPreferencesApi,
  WindowState,
} from '../../desktop/types'
import { renderAppIcon, resolveAppIcon } from '../utils/icons'

type ResizeDirection = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type WindowLayerProps = {
  isDragging: boolean
  isResizing: boolean
  snapPreviewTarget: 'left' | 'right' | 'top' | null
  visibleWindows: WindowState[]
  preferences: DesktopPreferences
  desktopApi: DesktopCommandApi
  i18nApi: DesktopI18nApi
  preferencesApi: DesktopPreferencesApi
  launchIntent: DesktopLaunchIntent | null
  onBringToFront: (id: AppId) => void
  onMinimizeWindow: (id: AppId) => void
  onToggleMaximizeWindow: (id: AppId) => void
  onCloseWindow: (id: AppId) => void
  onHeaderPointerDown: (event: ReactPointerEvent<HTMLElement>, id: AppId) => void
  onHeaderPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onStopDragging: (event: ReactPointerEvent<HTMLElement>) => void
  onResizePointerDown: (
    event: ReactPointerEvent<HTMLElement>,
    id: AppId,
    direction: ResizeDirection,
  ) => void
  onResizePointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onStopResizing: (event: ReactPointerEvent<HTMLElement>) => void
  onToggleHorizontalSnap: (id: AppId, side: 'left' | 'right') => void
  t: (key: string, vars?: Record<string, string>) => string
}

const RESIZE_HANDLES: Array<{
  direction: ResizeDirection
  className: string
}> = [
  { direction: 'n', className: 'top-0 left-2 right-2 h-1.5 cursor-n-resize' },
  { direction: 's', className: 'bottom-0 left-2 right-2 h-1.5 cursor-s-resize' },
  { direction: 'e', className: 'top-2 right-0 bottom-2 w-1.5 cursor-e-resize' },
  { direction: 'w', className: 'top-2 left-0 bottom-2 w-1.5 cursor-w-resize' },
  { direction: 'ne', className: 'top-0 right-0 h-2.5 w-2.5 cursor-ne-resize' },
  { direction: 'nw', className: 'top-0 left-0 h-2.5 w-2.5 cursor-nw-resize' },
  { direction: 'se', className: 'right-0 bottom-0 h-2.5 w-2.5 cursor-se-resize' },
  { direction: 'sw', className: 'bottom-0 left-0 h-2.5 w-2.5 cursor-sw-resize' },
]

export function WindowLayer({
  isDragging,
  isResizing,
  snapPreviewTarget,
  visibleWindows,
  preferences,
  desktopApi,
  i18nApi,
  preferencesApi,
  launchIntent,
  onBringToFront,
  onMinimizeWindow,
  onToggleMaximizeWindow,
  onCloseWindow,
  onHeaderPointerDown,
  onHeaderPointerMove,
  onStopDragging,
  onResizePointerDown,
  onResizePointerMove,
  onStopResizing,
  onToggleHorizontalSnap,
  t,
}: WindowLayerProps) {
  return (
    <main className="pointer-events-none absolute inset-0 z-10">
      {isDragging && snapPreviewTarget ? (
        <div
          className={`absolute z-5 rounded-md border border-blue-400/60 bg-blue-500/15 shadow-[inset_0_0_0_1px_#93c5fd66] transition-all duration-150 ease-out ${
            snapPreviewTarget === 'left'
              ? 'top-0 left-0 h-[calc(100%-44px)] w-1/2 opacity-100 scale-100'
              : snapPreviewTarget === 'right'
                ? 'top-0 right-0 h-[calc(100%-44px)] w-1/2 opacity-100 scale-100'
                : 'top-0 left-0 h-[calc(100%-44px)] w-full opacity-100 scale-100'
          }`}
        />
      ) : null}

      {visibleWindows.map((windowItem) => {
        const plugin = DESKTOP_PLUGINS[windowItem.id]
        const PluginComponent = plugin.Component

        return (
          <section
            key={windowItem.id}
            className={`window pointer-events-auto absolute flex flex-col overflow-hidden rounded-[10px] border border-[var(--window-border)] bg-(--window-bg) shadow-[0_18px_40px_#00000066] ${windowItem.isMaximized ? 'window--maximized' : ''}`}
            style={{
              zIndex: windowItem.zIndex,
              left: windowItem.x,
              top: windowItem.y,
              width: windowItem.width,
              height: windowItem.height,
            }}
            onMouseDown={() => onBringToFront(windowItem.id)}
          >
            {!windowItem.isMaximized
              ? RESIZE_HANDLES.map((handle) => (
                  <div
                    key={`${windowItem.id}-${handle.direction}`}
                    className={`absolute z-20 touch-none ${handle.className}`}
                    onPointerDown={(event) =>
                      onResizePointerDown(event, windowItem.id, handle.direction)
                    }
                    onPointerMove={onResizePointerMove}
                    onPointerUp={onStopResizing}
                    onPointerCancel={onStopResizing}
                    onDoubleClick={(event) => {
                      event.stopPropagation()
                      if (handle.direction.includes('w')) {
                        onToggleHorizontalSnap(windowItem.id, 'left')
                      }
                      if (handle.direction.includes('e')) {
                        onToggleHorizontalSnap(windowItem.id, 'right')
                      }
                    }}
                  />
                ))
              : null}

            <header
              className={`flex items-center justify-between bg-linear-to-b from-blue-700 to-blue-800 px-2.5 py-2 text-slate-50 ${isDragging ? 'cursor-grabbing' : isResizing ? 'cursor-default' : 'cursor-grab'}`}
              onPointerDown={(event) => onHeaderPointerDown(event, windowItem.id)}
              onPointerMove={onHeaderPointerMove}
              onPointerUp={onStopDragging}
              onPointerCancel={onStopDragging}
              onDoubleClick={(event) => {
                const target = event.target as HTMLElement
                if (target.closest('.window__actions')) return
                onToggleMaximizeWindow(windowItem.id)
              }}
            >
              <p className="m-0 inline-flex items-center gap-2 text-sm font-semibold">
                {renderAppIcon(resolveAppIcon(windowItem.id, preferences), 'h-4.5 w-4.5 object-contain')}
                {t(plugin.titleKey)}
              </p>
              <div className="window__actions inline-flex">
                <button
                  type="button"
                  className="h-7 w-8 border-none bg-transparent text-sm text-slate-200 hover:bg-white/15"
                  aria-label={t('window.action.minimize', {
                    title: t(plugin.titleKey),
                  })}
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onMinimizeWindow(windowItem.id)}
                >
                  _
                </button>
                <button
                  type="button"
                  className="h-7 w-8 border-none bg-transparent text-sm text-slate-200 hover:bg-white/15"
                  aria-label={
                    windowItem.isMaximized
                      ? t('window.action.restore', { title: t(plugin.titleKey) })
                      : t('window.action.maximize', { title: t(plugin.titleKey) })
                  }
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onToggleMaximizeWindow(windowItem.id)}
                >
                  {windowItem.isMaximized ? '▢' : '□'}
                </button>
                <button
                  type="button"
                  className="h-7 w-8 border-none bg-transparent text-sm text-slate-200 hover:bg-red-500"
                  aria-label={t('window.action.close', {
                    title: t(plugin.titleKey),
                  })}
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onCloseWindow(windowItem.id)}
                >
                  ×
                </button>
              </div>
            </header>
            <div className="window__body min-h-0 flex-1 overflow-auto text-(--window-text)">
              <PluginComponent
                desktopApi={desktopApi}
                i18nApi={i18nApi}
                preferencesApi={preferencesApi}
                launchIntent={launchIntent}
              />
            </div>
          </section>
        )
      })}
    </main>
  )
}
