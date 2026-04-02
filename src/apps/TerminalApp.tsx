import { useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import type { DesktopAppProps, Locale } from '../desktop/types'
import { getTerminalContent } from '../desktop/resources/terminal'
import { formatDesktopDateTime } from '../desktop/utils/dateTimeFormat'

type TerminalLine = {
  type: 'input' | 'output'
  text: string
}

type TerminalCommand = (args: string[]) => string[]
type AliasMap = Record<string, string>

const buildInitialLines = (t: (key: string) => string): TerminalLine[] => [
  {
    type: 'output',
    text: t('terminal.welcome'),
  },
  {
    type: 'output',
    text: t('terminal.help.hint'),
  },
]

export function TerminalApp({ desktopApi, i18nApi, preferencesApi }: DesktopAppProps) {
  const t = useMemo(() => i18nApi?.t ?? ((key: string) => key), [i18nApi])
  const terminalContent = useMemo(
    () => getTerminalContent(i18nApi?.locale ?? 'it'),
    [i18nApi?.locale],
  )
  const [lines, setLines] = useState<TerminalLine[]>(() => buildInitialLines(t))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [draftInput, setDraftInput] = useState('')

  const commands = useMemo<Record<string, TerminalCommand>>(
    () => ({
      help: () => [
        terminalContent.helpLine,
      ],
      credits: () => terminalContent.creditsLines,
      whoami: () => ['davide@portfolio'],
      about: () => terminalContent.aboutLines,
      date: () => {
        const { formattedDate, formattedTime } = formatDesktopDateTime({
          now: new Date(),
          locale: i18nApi?.locale ?? 'it',
          clockHourFormat: preferencesApi?.preferences.clockHourFormat ?? 'locale',
          clockDateFormat: preferencesApi?.preferences.clockDateFormat ?? 'locale',
        })

        return [formattedTime, formattedDate]
      },
      apps: () => {
        if (!desktopApi) return [t('terminal.desktopApi.missing')]

        return desktopApi.listApps().map((app) => {
          const status = !app.isOpen
            ? t('terminal.apps.closed')
            : app.isMinimized
              ? t('terminal.apps.minimized')
              : t('terminal.apps.open')
          return `${app.id} (${app.title}) - ${status}`
        })
      },
      open: (args: string[]) => {
        if (!desktopApi) return [t('terminal.desktopApi.missing')]
        const target = args[0]
        if (!target) return [t('terminal.command.usage.open')]
        const normalizedTarget = target.toLowerCase()
        const query =
          normalizedTarget === 'skills' || normalizedTarget === 'calendar'
            ? args.slice(1).join(' ')
            : undefined
        return desktopApi.openApp(target, query)
          ? [
              query
                ? t('terminal.command.success.openWithQuery', { target, query })
                : t('terminal.command.success.open', { target }),
            ]
          : [t('terminal.command.error.appNotFound', { target })]
      },
      minimize: (args: string[]) => {
        if (!desktopApi) return [t('terminal.desktopApi.missing')]
        const target = args[0]
        if (!target) return [t('terminal.command.usage.minimize')]
        return desktopApi.minimizeApp(target)
          ? [t('terminal.command.success.minimize', { target })]
          : [t('terminal.command.error.appNotFound', { target })]
      },
      close: (args: string[]) => {
        if (!desktopApi) return [t('terminal.desktopApi.missing')]
        const target = args[0]
        if (!target) return [t('terminal.command.usage.close')]
        return desktopApi.closeApp(target)
          ? [t('terminal.command.success.close', { target })]
          : [t('terminal.command.error.appNotFound', { target })]
      },
      lang: (args: string[]) => {
        if (!i18nApi) return ['i18n API unavailable.']

        const next = args[0]?.toLowerCase() as Locale | undefined
        if (!next) return [t('terminal.lang.current', { locale: i18nApi.locale })]

        if (!i18nApi.locales.includes(next)) {
          return [t('terminal.lang.invalid', { locale: next })]
        }

        i18nApi.setLocale(next)
        return [t('terminal.lang.changed', { locale: next })]
      },
      theme: (args: string[]) => {
        if (!preferencesApi) return ['Preferences API unavailable.']

        const next = args[0]?.toLowerCase()
        if (!next) {
          return [
            t('terminal.theme.current', { theme: preferencesApi.preferences.theme }),
            t('terminal.command.usage.theme'),
          ]
        }

        if (!preferencesApi.themes.includes(next as (typeof preferencesApi.themes)[number])) {
          return [t('terminal.theme.invalid', { theme: next })]
        }

        preferencesApi.setTheme(next as (typeof preferencesApi.themes)[number])
        return [t('terminal.theme.changed', { theme: next })]
      },
      wallpaper: (args: string[]) => {
        if (!preferencesApi) return ['Preferences API unavailable.']

        const next = args[0]?.toLowerCase()
        if (!next) {
          return [
            t('terminal.wallpaper.current', {
              wallpaper: preferencesApi.preferences.wallpaper,
            }),
            t('terminal.command.usage.wallpaper'),
          ]
        }

        if (!preferencesApi.wallpapers.includes(next as (typeof preferencesApi.wallpapers)[number])) {
          return [t('terminal.wallpaper.invalid', { wallpaper: next })]
        }

        preferencesApi.setWallpaper(next as (typeof preferencesApi.wallpapers)[number])
        return [t('terminal.wallpaper.changed', { wallpaper: next })]
      },
      clear: () => [],
    }),
    [desktopApi, i18nApi, preferencesApi, t, terminalContent],
  )

  const aliases = useMemo<AliasMap>(
    () => ({
      help: 'help',
      aiuto: 'help',
      credits: 'credits',
      crediti: 'credits',
      whoami: 'whoami',
      about: 'about',
      chisono: 'about',
      date: 'date',
      data: 'date',
      apps: 'apps',
      applicazioni: 'apps',
      open: 'open',
      apri: 'open',
      minimize: 'minimize',
      minimizza: 'minimize',
      close: 'close',
      chiudi: 'close',
      lang: 'lang',
      lingua: 'lang',
      theme: 'theme',
      tema: 'theme',
      wallpaper: 'wallpaper',
      sfondo: 'wallpaper',
      clear: 'clear',
      pulisci: 'clear',
    }),
    [],
  )

  const commandNames = useMemo(() => Object.keys(aliases), [aliases])

  const runInput = (rawInput: string) => {
    const raw = rawInput.trim()
    if (!raw) return

    const [command, ...args] = raw.split(/\s+/)
    const normalized = command.toLowerCase()
    const canonical = aliases[normalized] ?? normalized
    const nextLines: TerminalLine[] = [...lines, { type: 'input', text: raw }]

    if (canonical === 'clear') {
      setLines([])
      return
    }

    if (canonical in commands) {
      const output = commands[canonical](args).map((text) => ({
        type: 'output' as const,
        text,
      }))
      setLines([...nextLines, ...output])
      return
    }

    setLines([
      ...nextLines,
      {
        type: 'output',
        text: t('terminal.command.unknown', { raw }),
      },
    ])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const raw = input.trim()
    if (!raw) return

    runInput(raw)
    setHistory((prev) => [...prev, raw])
    setHistoryIndex(null)
    setInput('')
    setDraftInput('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      if (!history.length) return
      event.preventDefault()

      if (historyIndex === null) {
        setDraftInput(input)
        const nextIndex = history.length - 1
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
        return
      }

      const nextIndex = Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
      return
    }

    if (event.key === 'ArrowDown') {
      if (!history.length || historyIndex === null) return
      event.preventDefault()

      if (historyIndex >= history.length - 1) {
        setHistoryIndex(null)
        setInput(draftInput)
        return
      }

      const nextIndex = historyIndex + 1
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const trimmed = input.trimStart()
      if (!trimmed.length) return

      const [first, ...rest] = trimmed.split(' ')
      if (rest.length > 1) return

      // Complete command name only when cursor is on first token.
      if (rest.length === 1 && rest[0].length > 0) return

      const matches = commandNames.filter((name) => name.startsWith(first.toLowerCase()))
      if (!matches.length) return

      if (matches.length === 1) {
        setInput(matches[0])
        return
      }

      setLines((prev) => [
        ...prev,
        { type: 'output', text: t('terminal.suggestions', { items: matches.join(', ') }) },
      ])
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 font-mono text-sm text-gray-300">
      <div className="terminal-output flex-1 overflow-auto p-3.5">
        {lines.map((line, index) => (
          <p
            key={`${line.type}-${line.text}-${index}`}
            className={`mb-1.5 text-left leading-[1.35] ${line.type === 'input' ? 'text-gray-50' : ''}`}
          >
            {line.type === 'input' ? (
              <span className="text-green-500">{t('terminal.prompt')} </span>
            ) : null}
            {line.text}
          </p>
        ))}
      </div>
      <form className="flex items-center gap-2.5 border-t border-slate-800 px-3.5 py-3" onSubmit={handleSubmit}>
        <label className="text-green-500" htmlFor="terminal-input">
          {t('terminal.prompt')}
        </label>
        <div className="relative flex-1">
          <input
            id="terminal-input"
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border-none bg-transparent font-inherit text-gray-200 outline-none caret-gray-50"
          />
        </div>
      </form>
    </div>
  )
}

