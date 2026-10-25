import { memo, useEffect, useRef, useState } from 'react'
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

type ExitKind = 'closing' | 'minimizing'

const EXIT_DURATION_MS: Record<ExitKind, number> = {
  closing: 170,
  minimizing: 260,
}

const TrafficGlyph = ({ kind }: { kind: 'close' | 'minimize' | 'maximize' }) => (
  <svg viewBox="0 0 8 8" aria-hidden="true">
    {kind === 'close' ? (
      <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    ) : kind === 'minimize' ? (
      <path d="M1.2 4h5.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    ) : (
      <path d="M1.5 5.2V1.5h3.7zM6.5 2.8v3.7H2.8z" fill="currentColor" />
    )}
  </svg>
)

type WindowContentProps = {
  id: AppId
  desktopApi: DesktopCommandApi
  i18nApi: DesktopI18nApi
  preferencesApi: DesktopPreferencesApi
  launchIntent: DesktopLaunchIntent | null
}

/** App content only re-renders when its inputs change, never while the window is dragged or resized. */
const WindowContent = memo(function WindowContent({ id, desktopApi, i18nApi, preferencesApi, launchIntent }: WindowContentProps) {
  const PluginComponent = DESKTOP_PLUGINS[id].Component
  return (
    <PluginComponent
      desktopApi={desktopApi}
      i18nApi={i18nApi}
      preferencesApi={preferencesApi}
      launchIntent={launchIntent}
    />
  )
})

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
  const topZIndex = visibleWindows.reduce((max, current) => Math.max(max, current.zIndex), Number.NEGATIVE_INFINITY)
  const [exitingWindows, setExitingWindows] = useState<Partial<Record<AppId, ExitKind>>>({})
  const exitTimersRef = useRef<number[]>([])

  useEffect(() => {
    const timers = exitTimersRef.current
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const animateOut = (id: AppId, kind: ExitKind) => {
    if (exitingWindows[id]) return
    setExitingWindows((prev) => ({ ...prev, [id]: kind }))
    const timer = window.setTimeout(() => {
      if (kind === 'closing') onCloseWindow(id)
      else onMinimizeWindow(id)
      setExitingWindows((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }, EXIT_DURATION_MS[kind])
    exitTimersRef.current.push(timer)
  }

  return (
    <main className="pointer-events-none absolute inset-0 z-10">
      {isDragging && snapPreviewTarget ? (
        <div
          className={`snap-preview absolute z-5 transition-all duration-150 ease-out ${
            snapPreviewTarget === 'left'
              ? 'top-[40px] left-2 h-[calc(100%-48px)] w-[calc(50%-12px)]'
              : snapPreviewTarget === 'right'
                ? 'top-[40px] right-2 h-[calc(100%-48px)] w-[calc(50%-12px)]'
                : 'top-[40px] left-2 h-[calc(100%-48px)] w-[calc(100%-16px)]'
          }`}
        />
      ) : null}

      {visibleWindows.map((windowItem) => {
        const plugin = DESKTOP_PLUGINS[windowItem.id]
        const exitKind = exitingWindows[windowItem.id]

        return (
          <div
            key={windowItem.id}
            className={`window-frame ${windowItem.isMaximized ? 'window-frame--maximized' : ''}`}
            style={{
              zIndex: windowItem.zIndex,
              width: windowItem.width,
              height: windowItem.height,
              transform: `translate3d(${windowItem.x}px, ${windowItem.y}px, 0)`,
            }}
          >
          <section
            className={`window pointer-events-auto relative flex h-full w-full flex-col overflow-hidden ${windowItem.zIndex === topZIndex ? '' : 'window--inactive'} ${windowItem.isMaximized ? 'window--maximized' : ''} ${exitKind ? `window--${exitKind}` : ''}`}
            aria-label={t(plugin.titleKey)}
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
              className={`window__titlebar flex items-center gap-2 px-3.5 py-2 ${isDragging ? 'cursor-grabbing' : isResizing ? 'cursor-default' : 'cursor-grab'}`}
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
              <div className="window__actions inline-flex items-center gap-2.5">
                <button
                  type="button"
                  className="window__traffic-light window__traffic-light--close"
                  aria-label={t('window.action.close', {
                    title: t(plugin.titleKey),
                  })}
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => animateOut(windowItem.id, 'closing')}
                >
                  <TrafficGlyph kind="close" />
                  <span className="sr-only">{t('window.action.close', { title: t(plugin.titleKey) })}</span>
                </button>
                <button
                  type="button"
                  className="window__traffic-light window__traffic-light--minimize"
                  aria-label={t('window.action.minimize', {
                    title: t(plugin.titleKey),
                  })}
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => animateOut(windowItem.id, 'minimizing')}
                >
                  <TrafficGlyph kind="minimize" />
                  <span className="sr-only">{t('window.action.minimize', { title: t(plugin.titleKey) })}</span>
                </button>
                <button
                  type="button"
                  className="window__traffic-light window__traffic-light--maximize"
                  aria-label={
                    windowItem.isMaximized
                      ? t('window.action.restore', { title: t(plugin.titleKey) })
                      : t('window.action.maximize', { title: t(plugin.titleKey) })
                  }
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => onToggleMaximizeWindow(windowItem.id)}
                >
                  <TrafficGlyph kind="maximize" />
                  <span className="sr-only">
                    {windowItem.isMaximized
                      ? t('window.action.restore', { title: t(plugin.titleKey) })
                      : t('window.action.maximize', { title: t(plugin.titleKey) })}
                  </span>
                </button>
              </div>
              <p className="window__title m-0 inline-flex min-w-0 items-center gap-2 text-[13px] text-(--window-title-text)">
                {renderAppIcon(resolveAppIcon(windowItem.id, preferences), 'h-4 w-4 object-contain')}
                <span className="truncate">{t(plugin.titleKey)}</span>
              </p>
              <div className="window__titlebar-spacer" aria-hidden="true" />
            </header>
            <div className="window__body min-h-0 flex-1 overflow-auto text-(--window-text)">
              <WindowContent
                id={windowItem.id}
                desktopApi={desktopApi}
                i18nApi={i18nApi}
                preferencesApi={preferencesApi}
                launchIntent={launchIntent}
              />
            </div>
          </section>
          </div>
        )
      })}
    </main>
  )
}
