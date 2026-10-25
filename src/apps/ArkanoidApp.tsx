import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DesktopAppProps } from '../desktop/types'
import { Icon } from '../desktop-shell/components/Icon'
import { generateContributionMonth } from './gitout/contributions'
import type { ContributionMonth } from './gitout/contributions'

type GameStatus = 'ready' | 'playing' | 'paused' | 'won' | 'lost'

type Brick = {
  x: number
  y: number
  w: number
  h: number
  day: number
  level: number
  commitsLeft: number
}

const WORLD_W = 640
const MIN_WORLD_H = 560
const MAX_WORLD_H = 1100
const PADDING_X = 26
const GRID_TOP = 44
const GAP = 8
const BRICK_H = 30
const PADDLE_W = 104
const PADDLE_H = 12
const PADDLE_OFFSET = 34
const BALL_R = 7
const BASE_SPEED = 360
const MAX_SPEED = 640
const PADDLE_SPEED = 620
const START_LIVES = 3

const PALETTES = {
  dark: {
    empty: '#161b22',
    emptyStroke: '#30363d',
    levels: ['#0e4429', '#006d32', '#26a641', '#39d353'],
    text: '#e6edf3',
    muted: '#7d8590',
    ball: '#f0f6fc',
  },
  light: {
    empty: '#ebedf0',
    emptyStroke: '#d0d7de',
    levels: ['#9be9a8', '#40c463', '#30a14e', '#216e39'],
    text: '#1f2328',
    muted: '#656d76',
    ball: '#1f2328',
  },
} as const

const buildBricks = (month: ContributionMonth): Brick[] => {
  const w = (WORLD_W - PADDING_X * 2 - GAP * 6) / 7
  return month.days.map((day) => ({
    x: PADDING_X + day.weekday * (w + GAP),
    y: GRID_TOP + day.week * (BRICK_H + GAP),
    w,
    h: BRICK_H,
    day: day.day,
    level: day.level,
    commitsLeft: day.commits,
  }))
}

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

export function ArkanoidApp({ i18nApi, preferencesApi }: DesktopAppProps) {
  const t = useMemo(() => i18nApi?.t ?? ((key: string) => key), [i18nApi])
  const locale = i18nApi?.locale === 'en' ? 'en' : 'it'
  const weekStartsOn: 0 | 1 = locale === 'en' ? 0 : 1
  const theme = preferencesApi?.preferences.theme === 'light' ? 'light' : 'dark'

  const [month, setMonth] = useState(() => generateContributionMonth(weekStartsOn))
  const [status, setStatus] = useState<GameStatus>('ready')
  const [lives, setLives] = useState(START_LIVES)
  const [reverted, setReverted] = useState(0)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const statusRef = useRef<GameStatus>('ready')
  const livesRef = useRef(START_LIVES)
  const bricksRef = useRef<Brick[]>(buildBricks(month))
  const paddleRef = useRef({ x: WORLD_W / 2 - PADDLE_W / 2, target: null as number | null })
  const ballRef = useRef({ x: WORLD_W / 2, y: MIN_WORLD_H - PADDLE_OFFSET - BALL_R - 1, vx: 0, vy: 0, speed: BASE_SPEED })
  const keysRef = useRef({ left: false, right: false })
  const scaleRef = useRef(1)
  /** World height follows the stage aspect ratio, so portrait screens get a taller field. */
  const worldHRef = useRef(MIN_WORLD_H)
  const paddleY = () => worldHRef.current - PADDLE_OFFSET

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'it-IT', { weekday: 'short' })
    // 2023-01-01 was a Sunday.
    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(new Date(2023, 0, 1 + ((index + weekStartsOn) % 7))).replace('.', ''),
    )
  }, [locale, weekStartsOn])

  const monthLabel = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'it-IT', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(month.year, month.month, 1))

  const changeStatus = useCallback((next: GameStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const launch = useCallback(() => {
    if (statusRef.current === 'paused') {
      changeStatus('playing')
      return
    }
    if (statusRef.current !== 'ready') return
    const angle = (Math.random() * 0.6 - 0.3) * Math.PI
    const ball = ballRef.current
    ball.vx = Math.sin(angle) * ball.speed
    ball.vy = -Math.cos(angle) * ball.speed
    changeStatus('playing')
  }, [changeStatus])

  const startGame = (nextMonth: ContributionMonth) => {
    bricksRef.current = buildBricks(nextMonth)
    livesRef.current = START_LIVES
    paddleRef.current = { x: WORLD_W / 2 - PADDLE_W / 2, target: null }
    ballRef.current = { x: WORLD_W / 2, y: paddleY() - BALL_R - 1, vx: 0, vy: 0, speed: BASE_SPEED }
    setLives(START_LIVES)
    setReverted(0)
    changeStatus('ready')
    rootRef.current?.focus()
  }

  const newMonth = () => {
    const next = generateContributionMonth(weekStartsOn)
    setMonth(next)
    startGame(next)
  }

  // Fit the fixed-size world into whatever space the window gives us.
  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    const resize = () => {
      const aspectHeight = (WORLD_W * stage.clientHeight) / Math.max(1, stage.clientWidth)
      const worldH = Math.round(Math.min(MAX_WORLD_H, Math.max(MIN_WORLD_H, aspectHeight)))
      worldHRef.current = worldH
      const scale = Math.min(stage.clientWidth / WORLD_W, stage.clientHeight / worldH)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      scaleRef.current = scale
      canvas.style.width = `${WORLD_W * scale}px`
      canvas.style.height = `${worldH * scale}px`
      canvas.width = Math.round(WORLD_W * scale * dpr)
      canvas.height = Math.round(worldH * scale * dpr)
      canvas.getContext('2d')?.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  // Main loop: fixed-step physics, render every frame.
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const palette = PALETTES[theme]
    let frame = 0
    let last = performance.now()

    const resetBall = () => {
      const paddle = paddleRef.current
      ballRef.current = {
        x: paddle.x + PADDLE_W / 2,
        y: paddleY() - BALL_R - 1,
        vx: 0,
        vy: 0,
        speed: Math.max(BASE_SPEED, ballRef.current.speed * 0.85),
      }
    }

    const hitBrick = (brick: Brick) => {
      const removed = brick.level === 1 ? brick.commitsLeft : Math.ceil(brick.commitsLeft / brick.level)
      brick.commitsLeft -= removed
      brick.level -= 1
      setReverted((value) => value + removed)
      const ball = ballRef.current
      ball.speed = Math.min(MAX_SPEED, ball.speed + 5)
      const length = Math.hypot(ball.vx, ball.vy) || 1
      ball.vx = (ball.vx / length) * ball.speed
      ball.vy = (ball.vy / length) * ball.speed
      if (bricksRef.current.every((item) => item.level === 0)) changeStatus('won')
    }

    const step = (dt: number) => {
      const paddle = paddleRef.current
      const keys = keysRef.current
      if (keys.left || keys.right) {
        paddle.target = null
        paddle.x += (keys.right ? 1 : -1) * PADDLE_SPEED * dt
      } else if (paddle.target !== null) {
        paddle.x += (paddle.target - PADDLE_W / 2 - paddle.x) * Math.min(1, dt * 18)
      }
      paddle.x = Math.max(0, Math.min(WORLD_W - PADDLE_W, paddle.x))

      const ball = ballRef.current
      if (statusRef.current === 'ready') {
        ball.x = paddle.x + PADDLE_W / 2
        ball.y = paddleY() - BALL_R - 1
        return
      }
      if (statusRef.current !== 'playing') return

      const prevX = ball.x
      const prevY = ball.y
      ball.x += ball.vx * dt
      ball.y += ball.vy * dt

      if (ball.x < BALL_R) {
        ball.x = BALL_R
        ball.vx = Math.abs(ball.vx)
      } else if (ball.x > WORLD_W - BALL_R) {
        ball.x = WORLD_W - BALL_R
        ball.vx = -Math.abs(ball.vx)
      }
      if (ball.y < BALL_R) {
        ball.y = BALL_R
        ball.vy = Math.abs(ball.vy)
      }

      // Paddle: the bounce angle depends on where the ball lands.
      if (
        ball.vy > 0 &&
        ball.y + BALL_R >= paddleY() &&
        prevY + BALL_R <= paddleY() + 2 &&
        ball.x >= paddle.x - BALL_R &&
        ball.x <= paddle.x + PADDLE_W + BALL_R
      ) {
        const offset = (ball.x - (paddle.x + PADDLE_W / 2)) / (PADDLE_W / 2)
        const angle = Math.max(-1, Math.min(1, offset)) * (Math.PI / 3)
        ball.vx = Math.sin(angle) * ball.speed
        ball.vy = -Math.cos(angle) * ball.speed
        ball.y = paddleY() - BALL_R
      }

      for (const brick of bricksRef.current) {
        if (brick.level === 0) continue
        const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.w))
        const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.h))
        if ((ball.x - closestX) ** 2 + (ball.y - closestY) ** 2 > BALL_R ** 2) continue

        const cameFromSide = prevX + BALL_R <= brick.x || prevX - BALL_R >= brick.x + brick.w
        if (cameFromSide) {
          ball.vx = -ball.vx
          ball.x = prevX
        } else {
          ball.vy = -ball.vy
          ball.y = prevY
        }
        hitBrick(brick)
        break
      }

      if (ball.y - BALL_R > worldHRef.current) {
        livesRef.current -= 1
        setLives(livesRef.current)
        if (livesRef.current <= 0) {
          changeStatus('lost')
        } else {
          resetBall()
          changeStatus('ready')
        }
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, WORLD_W, worldHRef.current)

      ctx.font = `500 11px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.fillStyle = palette.muted
      const brickW = (WORLD_W - PADDING_X * 2 - GAP * 6) / 7
      weekdayLabels.forEach((label, index) => {
        ctx.fillText(label.toUpperCase(), PADDING_X + index * (brickW + GAP) + brickW / 2, GRID_TOP - 14)
      })

      ctx.textAlign = 'left'
      for (const brick of bricksRef.current) {
        roundRect(ctx, brick.x, brick.y, brick.w, brick.h, 6)
        if (brick.level === 0) {
          ctx.fillStyle = palette.empty
          ctx.fill()
          ctx.strokeStyle = palette.emptyStroke
          ctx.lineWidth = 1
          ctx.stroke()
        } else {
          ctx.fillStyle = palette.levels[brick.level - 1]
          ctx.fill()
        }
        ctx.fillStyle = brick.level >= 3 ? '#ffffffcc' : palette.muted
        ctx.font = `500 10px 'JetBrains Mono', monospace`
        ctx.fillText(String(brick.day), brick.x + 7, brick.y + 14)
      }

      const paddle = paddleRef.current
      const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + PADDLE_W, 0)
      gradient.addColorStop(0, '#8b7bff')
      gradient.addColorStop(1, '#3ee6ff')
      ctx.shadowColor = '#8b7bffaa'
      ctx.shadowBlur = 16
      roundRect(ctx, paddle.x, paddleY(), PADDLE_W, PADDLE_H, PADDLE_H / 2)
      ctx.fillStyle = gradient
      ctx.fill()

      const ball = ballRef.current
      ctx.shadowColor = '#39d353'
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
      ctx.fillStyle = palette.ball
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const loop = (now: number) => {
      // Clamp long gaps (tab switches) and integrate in small steps to avoid tunnelling.
      let elapsed = Math.min(0.05, (now - last) / 1000)
      last = now
      while (elapsed > 0) {
        const dt = Math.min(elapsed, 1 / 240)
        step(dt)
        elapsed -= dt
      }
      render()
      frame = window.requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      if (document.hidden && statusRef.current === 'playing') changeStatus('paused')
    }

    frame = window.requestAnimationFrame(loop)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [changeStatus, theme, weekdayLabels])

  const setPointerTarget = (clientX: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    paddleRef.current.target = (clientX - rect.left) / scaleRef.current
  }

  const onKey = (event: React.KeyboardEvent, isDown: boolean) => {
    const key = event.key.toLowerCase()
    if (key === 'arrowleft' || key === 'a') {
      keysRef.current.left = isDown
      event.preventDefault()
    } else if (key === 'arrowright' || key === 'd') {
      keysRef.current.right = isDown
      event.preventDefault()
    } else if (isDown && (key === ' ' || key === 'arrowup' || key === 'enter')) {
      event.preventDefault()
      launch()
    } else if (isDown && (key === 'p' || key === 'escape') && statusRef.current === 'playing') {
      changeStatus('paused')
    }
  }

  const levelColors = PALETTES[theme].levels

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      data-konami-ignore
      className="gitout @container flex h-full flex-col outline-none"
      onKeyDown={(event) => onKey(event, true)}
      onKeyUp={(event) => onKey(event, false)}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        keysRef.current = { left: false, right: false }
        if (statusRef.current === 'playing') changeStatus('paused')
      }}
      aria-label={t('gitout.label')}
    >
      <header className="gitout__hud">
        <div className="min-w-0">
          <p className="m-0 font-display text-base font-semibold capitalize">{monthLabel}</p>
          <p className="m-0 text-xs text-(--app-muted)">
            {t('gitout.contributions', { count: String(month.totalCommits) })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="m-0 text-right text-xs text-(--app-muted)">
            {t('gitout.reverted')}
            <span className="block font-mono text-sm text-(--window-text) tabular-nums">
              {reverted}/{month.totalCommits}
            </span>
          </p>
          <p className="m-0 flex items-center gap-1" aria-label={t('gitout.lives', { count: String(lives) })}>
            {Array.from({ length: START_LIVES }, (_, index) => (
              <span key={index} className={`gitout__life ${index < lives ? 'gitout__life--on' : ''}`} />
            ))}
          </p>
          <button type="button" className="app-control" onClick={newMonth}>
            <Icon name="refresh" className="h-3.5 w-3.5" />
            <span className="hidden @md:inline">{t('gitout.newMonth')}</span>
          </button>
        </div>
      </header>

      <div
        ref={stageRef}
        className="relative grid min-h-0 flex-1 place-items-center p-3"
        onPointerDown={(event) => {
          rootRef.current?.focus()
          setPointerTarget(event.clientX)
          launch()
        }}
        onPointerMove={(event) => {
          if (event.pointerType === 'mouse' || event.buttons > 0) setPointerTarget(event.clientX)
        }}
      >
        <canvas ref={canvasRef} className="touch-none" aria-hidden="true" />

        {status !== 'playing' ? (
          <div className="gitout__overlay" role="status">
            {status === 'ready' ? (
              <p className="gitout__hint">{t('gitout.ready')}</p>
            ) : status === 'paused' ? (
              <p className="gitout__hint">{t('gitout.paused')}</p>
            ) : (
              <div className="gitout__dialog" onPointerDown={(event) => event.stopPropagation()}>
                <p className="m-0 font-mono text-xs text-(--app-muted)">
                  {status === 'won' ? '$ git push --force' : '$ git merge'}
                </p>
                <p className="m-0 mt-1 font-display text-xl font-semibold">
                  {status === 'won' ? t('gitout.won.title') : t('gitout.lost.title')}
                </p>
                <p className="m-0 mt-1 text-sm text-(--app-muted)">
                  {status === 'won'
                    ? t('gitout.won.body', { count: String(month.totalCommits) })
                    : t('gitout.lost.body', { count: String(reverted), total: String(month.totalCommits) })}
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  {status === 'lost' ? (
                    <button type="button" className="app-control" onClick={() => startGame(month)}>
                      {t('gitout.retry')}
                    </button>
                  ) : null}
                  <button type="button" className="hero-action hero-action--primary min-h-0! py-1.5! text-sm" onClick={newMonth}>
                    {t('gitout.newMonth')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <footer className="gitout__footer">
        <span className="hidden @md:inline">{t('gitout.controls')}</span>
        <span className="ml-auto inline-flex items-center gap-1">
          {t('gitout.less')}
          <span className="gitout__legend" style={{ background: PALETTES[theme].empty }} />
          {levelColors.map((color) => (
            <span key={color} className="gitout__legend" style={{ background: color }} />
          ))}
          {t('gitout.more')}
        </span>
      </footer>
    </div>
  )
}
