import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { AppId, WindowState } from '../../desktop/types'

type DragState = {
  id: AppId
  offsetX: number
  offsetY: number
}

type ResizeDirection = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
type SnapSide = 'left' | 'right'
type SnapPreviewTarget = SnapSide | 'top'

type ResizeState = {
  id: AppId
  direction: ResizeDirection
  startClientX: number
  startClientY: number
  startX: number
  startY: number
  startWidth: number
  startHeight: number
}

type UseWindowManagerParams = {
  initialWindows: Record<AppId, WindowState>
  initialZCounter: number
}

const MENU_BAR_HEIGHT = 32
const MENU_BAR_GAP = 4
const WINDOW_TOP_OFFSET = MENU_BAR_HEIGHT + MENU_BAR_GAP
const MIN_WINDOW_WIDTH = 320
const MIN_WINDOW_HEIGHT = 220
const SNAP_EDGE_THRESHOLD = 28
const SNAP_TOP_THRESHOLD = 18
const DOCK_RESERVED_HEIGHT = 84

const createEmptyPerAppMap = <T>(initial: T): Record<AppId, T> => ({
  terminal: initial,
  about: initial,
  help: initial,
  settings: initial,
  calendar: initial,
  certManager: initial,
  arkanoid: initial,
})

export function useWindowManager({
  initialWindows,
  initialZCounter,
}: UseWindowManagerParams) {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(initialWindows)
  const [zCounter, setZCounter] = useState(initialZCounter)
  const zCounterRef = useRef(initialZCounter)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [snapPreviewTarget, setSnapPreviewTarget] = useState<SnapPreviewTarget | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const resizeStateRef = useRef<ResizeState | null>(null)
  const preSnapBoundsRef = useRef<Record<AppId, Pick<WindowState, 'x' | 'y' | 'width' | 'height'> | null>>(
    createEmptyPerAppMap(null),
  )
  const snappedSideRef = useRef<Record<AppId, SnapSide | null>>(createEmptyPerAppMap(null))
  // Pointer events can fire faster than the display refreshes: coalesce them into one update per frame.
  const pendingMoveRef = useRef<{ id: AppId; x: number; y: number } | null>(null)
  const pendingResizeRef = useRef<{ clientX: number; clientY: number } | null>(null)
  const frameRef = useRef(0)
  const windowsRef = useRef(windows)

  useEffect(() => {
    windowsRef.current = windows
  }, [windows])

  const clampPosition = (x: number, y: number, width: number, height: number) => {
    const maxX = Math.max(0, window.innerWidth - width)
    const maxY = Math.max(WINDOW_TOP_OFFSET, window.innerHeight - height)
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(WINDOW_TOP_OFFSET, y), maxY),
    }
  }

  const bumpWindowZ = useCallback(
    (id: AppId, updater: (current: WindowState, nextZ: number) => WindowState) => {
      zCounterRef.current += 1
      const nextZ = zCounterRef.current
      setZCounter(nextZ)
      setWindows((prevWindows) => ({
        ...prevWindows,
        [id]: updater(prevWindows[id], nextZ),
      }))
    },
    [],
  )

  const bringToFront = useCallback(
    (id: AppId) => {
      bumpWindowZ(id, (current, nextZ) => ({
        ...current,
        zIndex: nextZ,
      }))
    },
    [bumpWindowZ],
  )

  const openWindow = useCallback(
    (id: AppId) => {
      bumpWindowZ(id, (current, nextZ) => {
        // Keep windows fully on screen (minus the dock area) when the viewport is smaller than their bounds.
        const width = Math.max(MIN_WINDOW_WIDTH, Math.min(current.width, window.innerWidth - 16))
        const height = Math.max(
          MIN_WINDOW_HEIGHT,
          Math.min(current.height, window.innerHeight - WINDOW_TOP_OFFSET - DOCK_RESERVED_HEIGHT),
        )
        const { x, y } = clampPosition(current.x, current.y, width, height + DOCK_RESERVED_HEIGHT)

        return {
          ...current,
          x,
          y,
          width,
          height,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        }
      })
    },
    [bumpWindowZ],
  )

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
      },
    }))
  }, [])

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }))
  }, [])

  const toggleMaximizeWindow = useCallback(
    (id: AppId) => {
      bumpWindowZ(id, (current, nextZ) => ({
        ...current,
        isMaximized: !current.isMaximized,
        isMinimized: false,
        zIndex: nextZ,
      }))
      preSnapBoundsRef.current[id] = null
      snappedSideRef.current[id] = null
    },
    [bumpWindowZ],
  )

  const moveWindow = useCallback((id: AppId, x: number, y: number) => {
    setWindows((prev) => {
      const current = prev[id]
      const clamped = clampPosition(x, y, current.width, current.height)
      return {
        ...prev,
        [id]: {
          ...current,
          x: clamped.x,
          y: clamped.y,
        },
      }
    })
    snappedSideRef.current[id] = null
  }, [])

  const toggleHorizontalSnap = useCallback(
    (id: AppId, side: SnapSide) => {
      // Decide outside the state updater: updaters must stay pure (StrictMode runs them twice).
      const current = windowsRef.current[id]
      const alreadySnappedSameSide =
        snappedSideRef.current[id] === side && preSnapBoundsRef.current[id] !== null

      if (alreadySnappedSameSide) {
        const previous = preSnapBoundsRef.current[id]!
        preSnapBoundsRef.current[id] = null
        snappedSideRef.current[id] = null
        bumpWindowZ(id, (latest, nextZ) => ({
          ...latest,
          ...previous,
          isMaximized: false,
          isMinimized: false,
          zIndex: nextZ,
        }))
        return
      }

      if (!current.isMaximized && !snappedSideRef.current[id]) {
        preSnapBoundsRef.current[id] = {
          x: current.x,
          y: current.y,
          width: current.width,
          height: current.height,
        }
      }

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight - WINDOW_TOP_OFFSET
      const halfWidth = Math.max(MIN_WINDOW_WIDTH, Math.floor(viewportWidth / 2))
      const x = side === 'left' ? 0 : Math.max(0, viewportWidth - halfWidth)
      snappedSideRef.current[id] = side

      bumpWindowZ(id, (latest, nextZ) => ({
        ...latest,
        x,
        y: WINDOW_TOP_OFFSET,
        width: halfWidth,
        height: viewportHeight,
        isMaximized: false,
        isMinimized: false,
        zIndex: nextZ,
      }))
    },
    [bumpWindowZ],
  )

  const handleHeaderPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, id: AppId) => {
      const target = event.target as HTMLElement
      if (target.closest('.window__actions')) return
      if (windows[id].isMaximized || isResizing) return

      const windowElement = event.currentTarget.parentElement
      if (!windowElement) return

      const rect = windowElement.getBoundingClientRect()
      dragStateRef.current = {
        id,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      }
      setIsDragging(true)
      bringToFront(id)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [bringToFront, isResizing, windows],
  )

  const handleHeaderPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragStateRef.current || isResizing) return

      const { id, offsetX, offsetY } = dragStateRef.current
      pendingMoveRef.current = { id, x: event.clientX - offsetX, y: event.clientY - offsetY }
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(() => {
          frameRef.current = 0
          const pending = pendingMoveRef.current
          pendingMoveRef.current = null
          if (pending) moveWindow(pending.id, pending.x, pending.y)
        })
      }

      if (event.clientY <= SNAP_TOP_THRESHOLD) {
        setSnapPreviewTarget((prev) => (prev === 'top' ? prev : 'top'))
        return
      }

      if (event.clientX <= SNAP_EDGE_THRESHOLD) {
        setSnapPreviewTarget((prev) => (prev === 'left' ? prev : 'left'))
      } else if (event.clientX >= window.innerWidth - SNAP_EDGE_THRESHOLD) {
        setSnapPreviewTarget((prev) => (prev === 'right' ? prev : 'right'))
      } else {
        setSnapPreviewTarget((prev) => (prev === null ? prev : null))
      }
    },
    [isResizing, moveWindow],
  )

  const flushPendingFrame = useCallback(() => {
    if (!frameRef.current) return
    window.cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
  }, [])

  const stopDragging = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!dragStateRef.current) return

    flushPendingFrame()
    const pendingMove = pendingMoveRef.current
    pendingMoveRef.current = null
    if (pendingMove) moveWindow(pendingMove.id, pendingMove.x, pendingMove.y)

    const { id } = dragStateRef.current
    const target = snapPreviewTarget

    dragStateRef.current = null
    setIsDragging(false)
    setSnapPreviewTarget(null)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (target === 'top') {
      toggleMaximizeWindow(id)
      return
    }

    if (target === 'left' || target === 'right') {
      toggleHorizontalSnap(id, target)
    }
  }, [flushPendingFrame, moveWindow, snapPreviewTarget, toggleHorizontalSnap, toggleMaximizeWindow])

  const handleResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>, id: AppId, direction: ResizeDirection) => {
      event.stopPropagation()
      const current = windows[id]
      if (current.isMaximized) return

      resizeStateRef.current = {
        id,
        direction,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: current.x,
        startY: current.y,
        startWidth: current.width,
        startHeight: current.height,
      }

      snappedSideRef.current[id] = null
      setIsResizing(true)
      bringToFront(id)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [bringToFront, windows],
  )

  const applyResize = useCallback((clientX: number, clientY: number) => {
    const state = resizeStateRef.current
    if (!state) return

    const dx = clientX - state.startClientX
    const dy = clientY - state.startClientY
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let nextX = state.startX
    let nextY = state.startY
    let nextWidth = state.startWidth
    let nextHeight = state.startHeight

    const rightEdge = state.startX + state.startWidth
    const bottomEdge = state.startY + state.startHeight

    if (state.direction.includes('e')) {
      nextWidth = state.startWidth + dx
    }

    if (state.direction.includes('s')) {
      nextHeight = state.startHeight + dy
    }

    if (state.direction.includes('w')) {
      const maxLeft = rightEdge - MIN_WINDOW_WIDTH
      nextX = Math.min(Math.max(0, state.startX + dx), Math.max(0, maxLeft))
      nextWidth = rightEdge - nextX
    }

    if (state.direction.includes('n')) {
      const maxTop = bottomEdge - MIN_WINDOW_HEIGHT
      nextY = Math.min(
        Math.max(WINDOW_TOP_OFFSET, state.startY + dy),
        Math.max(WINDOW_TOP_OFFSET, maxTop),
      )
      nextHeight = bottomEdge - nextY
    }

    nextWidth = Math.max(MIN_WINDOW_WIDTH, Math.min(nextWidth, viewportWidth - nextX))
    nextHeight = Math.max(MIN_WINDOW_HEIGHT, Math.min(nextHeight, viewportHeight - nextY))

    if (nextX + nextWidth > viewportWidth) {
      nextWidth = Math.max(MIN_WINDOW_WIDTH, viewportWidth - nextX)
    }

    if (nextY + nextHeight > viewportHeight) {
      nextHeight = Math.max(MIN_WINDOW_HEIGHT, viewportHeight - nextY)
    }

    setWindows((prev) => ({
      ...prev,
      [state.id]: {
        ...prev[state.id],
        x: nextX,
        y: nextY,
        width: nextWidth,
        height: nextHeight,
      },
    }))
  }, [])

  const handleResizePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!resizeStateRef.current) return
      pendingResizeRef.current = { clientX: event.clientX, clientY: event.clientY }
      if (frameRef.current) return
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0
        const pending = pendingResizeRef.current
        pendingResizeRef.current = null
        if (pending) applyResize(pending.clientX, pending.clientY)
      })
    },
    [applyResize],
  )

  const stopResizing = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!resizeStateRef.current) return
    flushPendingFrame()
    const pendingResize = pendingResizeRef.current
    pendingResizeRef.current = null
    if (pendingResize) applyResize(pendingResize.clientX, pendingResize.clientY)
    resizeStateRef.current = null
    setIsResizing(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [applyResize, flushPendingFrame])

  return {
    windows,
    zCounter,
    isDragging,
    isResizing,
    snapPreviewTarget,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    bringToFront,
    handleHeaderPointerDown,
    handleHeaderPointerMove,
    stopDragging,
    handleResizePointerDown,
    handleResizePointerMove,
    stopResizing,
    toggleHorizontalSnap,
  }
}
