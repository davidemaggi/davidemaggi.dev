type CalendarGlyphProps = {
  className?: string
}

/** Live calendar app icon: shows today's weekday and day, sized via container query units. */
export function CalendarGlyph({ className = '' }: CalendarGlyphProps) {
  const now = new Date()
  const locale = typeof document !== 'undefined' && document.documentElement.lang === 'it' ? 'it-IT' : 'en-US'
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(now).replace('.', '')
  const day = now.getDate()

  return (
    <span className={`calendar-glyph ${className}`} role="img" aria-label={`${weekday} ${day}`}>
      <span className="calendar-glyph__band">{weekday}</span>
      <span className="calendar-glyph__day">{day}</span>
    </span>
  )
}
