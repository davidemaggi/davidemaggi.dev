import { useEffect, useRef, useState } from 'react'

const MESSAGES = ['Belin, ma cosa ci fai qui?', 'Ok, adesso torna a lavorare.'] as const
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>?/\\|[]{};:,.~'

// Single speed knob to tune the whole animation pacing.
const ANIMATION_SPEED = 1
const REVEAL_STEP_EVERY = Math.max(1, Math.round(12 / ANIMATION_SPEED))
const HOLD_FRAMES = Math.round(180 / ANIMATION_SPEED)
const GLITCH_FRAMES = Math.round(48 / ANIMATION_SPEED)

export function EasterEggApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const soundEnabledRef = useRef(false)

  const audioStateRef = useRef<{
    context: AudioContext | null
    gain: GainNode | null
  }>({
    context: null,
    gain: null,
  })

  const beep = (frequency: number, duration: number, volume: number) => {
    if (!soundEnabledRef.current || typeof window === 'undefined') return

    const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextCtor) return

    if (!audioStateRef.current.context) {
      const context = new AudioContextCtor()
      const gain = context.createGain()
      gain.gain.value = 0.05
      gain.connect(context.destination)
      audioStateRef.current = { context, gain }
    }

    const { context, gain } = audioStateRef.current
    if (!context || !gain) return
    if (context.state === 'suspended') {
      void context.resume()
    }

    const osc = context.createOscillator()
    const env = context.createGain()
    osc.type = 'triangle'
    osc.frequency.value = frequency

    const now = context.currentTime
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(volume, now + 0.01)
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(env)
    env.connect(gain)

    osc.start(now)
    osc.stop(now + duration)
  }

  useEffect(() => {
    soundEnabledRef.current = isSoundEnabled
  }, [isSoundEnabled])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frameId = 0
    let animationTick = 0
    let revealProgress = 0
    let messageIndex = 0
    let holdFrameCount = 0
    let glitchFrameCount = 0
    let phase: 'reveal' | 'hold' | 'glitch' = 'reveal'

    const state = {
      width: 0,
      height: 0,
      fontSize: 18,
      columns: 0,
      drops: [] as number[],
      centerY: 0,
      messageStartCol: 0,
    }

    const randomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
    const currentMessage = () => MESSAGES[messageIndex]

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(320, rect.width)
      const height = Math.max(220, rect.height)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      state.width = width
      state.height = height
      state.fontSize = Math.max(14, Math.floor(width / 44))
      state.columns = Math.max(18, Math.floor(width / state.fontSize))
      state.centerY = Math.floor(height / 2)
      state.messageStartCol = Math.max(0, Math.floor((state.columns - currentMessage().length) / 2))
      state.drops = Array.from({ length: state.columns }, () => Math.random() * height)

      context.font = `${state.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
      context.textAlign = 'left'
      context.textBaseline = 'top'
    }

    const draw = () => {
      animationTick += 1

      context.fillStyle = 'rgba(0, 0, 0, 0.16)'
      context.fillRect(0, 0, state.width, state.height)

      for (let col = 0; col < state.columns; col += 1) {
        const x = col * state.fontSize
        const y = state.drops[col]

        context.fillStyle = '#00ff7a'
        context.globalAlpha = 0.72
        context.fillText(randomChar(), x, y)

        state.drops[col] += state.fontSize * ANIMATION_SPEED
        if (state.drops[col] > state.height + state.fontSize * 2 && Math.random() > 0.965) {
          state.drops[col] = -Math.random() * state.height * 0.35
        }
      }

      const message = currentMessage()

      if (phase === 'reveal' && animationTick % REVEAL_STEP_EVERY === 0 && revealProgress < message.length) {
        revealProgress += 1
        beep(240 + revealProgress * 18, 0.06, 0.055)
        if (revealProgress >= message.length) {
          phase = 'hold'
          holdFrameCount = 0
        }
      }

      if (phase === 'hold') {
        holdFrameCount += 1
        if (holdFrameCount === 1) {
          beep(690, 0.1, 0.07)
        }
        if (holdFrameCount >= HOLD_FRAMES) {
          phase = 'glitch'
          glitchFrameCount = 0
        }
      }

      if (phase === 'glitch') {
        glitchFrameCount += 1
        if (glitchFrameCount % 10 === 0) {
          beep(120 + Math.random() * 220, 0.035, 0.05)
        }
        if (glitchFrameCount >= GLITCH_FRAMES) {
          messageIndex = (messageIndex + 1) % MESSAGES.length
          phase = 'reveal'
          revealProgress = 0
          holdFrameCount = 0
          glitchFrameCount = 0
          state.messageStartCol = Math.max(0, Math.floor((state.columns - currentMessage().length) / 2))
        }
      }

      for (let i = 0; i < message.length; i += 1) {
        const x = (state.messageStartCol + i) * state.fontSize
        const targetChar = message[i]
        const isRevealed = i < revealProgress
        const shouldGlitch = phase === 'glitch' && Math.random() > 0.55
        const displayChar = shouldGlitch ? randomChar() : (isRevealed ? targetChar : randomChar())

        context.globalAlpha = isRevealed ? 1 : 0.45
        context.fillStyle = shouldGlitch ? '#b0ff8a' : (isRevealed ? '#d4ffd7' : '#67ff9b')
        context.fillText(displayChar, x, state.centerY)
      }

      if (phase === 'glitch') {
        context.globalAlpha = 0.3
        context.fillStyle = '#aaffd5'
        context.fillRect(0, state.centerY - state.fontSize, state.width, 2)
        context.fillRect(0, state.centerY + state.fontSize, state.width, 1)
      }

      if (phase === 'hold') {
        const pulse = 0.75 + 0.25 * Math.sin(animationTick * 0.09)
        const cinematicSize = Math.round(state.fontSize * (1.1 + 0.05 * Math.sin(animationTick * 0.05)))

        context.save()
        context.font = `700 ${Math.max(cinematicSize, state.fontSize)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.globalAlpha = 0.22 * pulse
        context.fillStyle = '#89ffbf'
        context.fillText(message, state.width / 2, state.centerY)
        context.restore()

        context.textAlign = 'left'
        context.textBaseline = 'top'
      }

      context.globalAlpha = 1
      context.fillStyle = '#0f7a3d'
      context.font = `${Math.max(11, Math.floor(state.fontSize * 0.7))}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
      context.fillText('SYSTEM BREACH DETECTED', 12, 10)
      context.font = `${state.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

      frameId = window.requestAnimationFrame(draw)
    }

    resize()
    frameId = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)

      const { context } = audioStateRef.current
      if (context) {
        void context.close()
      }
      audioStateRef.current = { context: null, gain: null }
    }
  }, [])

  return (
    <div className="relative h-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block h-full w-full" aria-label="Matrix style easter egg animation" />
      <button
        type="button"
        className="absolute top-2 right-2 rounded border border-[#2f603f] bg-black/70 px-2 py-1 text-[11px] text-[#86f5ae]"
        onClick={() => setIsSoundEnabled((prev) => !prev)}
      >
        {isSoundEnabled ? 'SOUND ON' : 'SOUND OFF'}
      </button>
    </div>
  )
}
