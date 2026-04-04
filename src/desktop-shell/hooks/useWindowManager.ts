import { useCallback, useRef, useState } from 'react'
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

const TASKBAR_HEIGHT = 44
const MIN_WINDOW_WIDTH = 320
const MIN_WINDOW_HEIGHT = 220
const SNAP_EDGE_THRESHOLD = 28
const SNAP_TOP_THRESHOLD = 18

const createEmptyPerAppMap = <T>(initial: T): Record<AppId, T> => ({
  terminal: initial,
  about: initial,
  settings: initial,
  calendar: initial,
  certManager: initial,
  easterEgg: initial,
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

  const clampPosition = (x: number, y: number, width: number, height: number) => {
    const maxX = Math.max(0, window.innerWidth - width)
    const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - height)
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
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
      bumpWindowZ(id, (current, nextZ) => ({
        ...current,
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      }))
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
      bumpWindowZ(id, (current, nextZ) => {
        const alreadySnappedSameSide =
          snappedSideRef.current[id] === side && preSnapBoundsRef.current[id] !== null

        if (alreadySnappedSameSide) {
          const previous = preSnapBoundsRef.current[id]!
          preSnapBoundsRef.current[id] = null
          snappedSideRef.current[id] = null
          return {
            ...current,
            ...previous,
            isMaximized: false,
            isMinimized: false,
            zIndex: nextZ,
          }
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
        const viewportHeight = window.innerHeight - TASKBAR_HEIGHT
        const halfWidth = Math.max(MIN_WINDOW_WIDTH, Math.floor(viewportWidth / 2))
        const x = side === 'left' ? 0 : Math.max(0, viewportWidth - halfWidth)

        snappedSideRef.current[id] = side

        return {
          ...current,
          x,
          y: 0,
          width: halfWidth,
          height: viewportHeight,
          isMaximized: false,
          isMinimized: false,
          zIndex: nextZ,
        }
      })
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
      moveWindow(id, event.clientX - offsetX, event.clientY - offsetY)

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

  const stopDragging = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!dragStateRef.current) return

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
  }, [snapPreviewTarget, toggleHorizontalSnap, toggleMaximizeWindow])

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

  const handleResizePointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const state = resizeStateRef.current
    if (!state) return

    const dx = event.clientX - state.startClientX
    const dy = event.clientY - state.startClientY
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight - TASKBAR_HEIGHT

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
      nextY = Math.min(Math.max(0, state.startY + dy), Math.max(0, maxTop))
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

  const stopResizing = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!resizeStateRef.current) return
    resizeStateRef.current = null
    setIsResizing(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

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
