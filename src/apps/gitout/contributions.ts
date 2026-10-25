export type ContributionDay = {
  /** Day of month, 1-based. */
  day: number
  /** Column inside the calendar week (0-6). */
  weekday: number
  /** Calendar row (week of month). */
  week: number
  commits: number
  /** GitHub intensity bucket 0-4; also the number of hits the brick needs. */
  level: number
}

export type ContributionMonth = {
  year: number
  month: number
  weeks: number
  days: ContributionDay[]
  totalCommits: number
}

const levelFromCommits = (commits: number) => {
  if (commits === 0) return 0
  if (commits <= 2) return 1
  if (commits <= 5) return 2
  if (commits <= 9) return 3
  return 4
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const pickCommits = () => {
  const roll = Math.random()
  if (roll < 0.4) return randomInt(1, 2)
  if (roll < 0.72) return randomInt(3, 5)
  if (roll < 0.92) return randomInt(6, 9)
  return randomInt(10, 18)
}

/**
 * Builds a believable contribution calendar for a random past month:
 * busy weekdays, quieter weekends and the occasional week off.
 */
export function generateContributionMonth(weekStartsOn: 0 | 1, now = new Date()): ContributionMonth {
  const firstYear = 2016
  const monthsAvailable = (now.getFullYear() - firstYear) * 12 + now.getMonth()
  const offset = randomInt(1, Math.max(1, monthsAvailable))
  const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7
  const weekOff = Math.random() < 0.35 ? randomInt(0, 4) : -1

  const days: ContributionDay[] = []
  for (let day = 1; day <= daysInMonth; day += 1) {
    const slot = leadingBlanks + day - 1
    const week = Math.floor(slot / 7)
    const weekday = slot % 7
    const realDay = new Date(year, month, day).getDay()
    const isWeekend = realDay === 0 || realDay === 6
    const activity = week === weekOff ? 0.1 : isWeekend ? 0.35 : 0.82
    const commits = Math.random() < activity ? pickCommits() : 0
    days.push({ day, weekday, week, commits, level: levelFromCommits(commits) })
  }

  // A month without anything to break would be a sad game.
  if (days.every((day) => day.level === 0)) {
    days[0].commits = 4
    days[0].level = levelFromCommits(4)
  }

  return {
    year,
    month,
    weeks: Math.ceil((leadingBlanks + daysInMonth) / 7),
    days,
    totalCommits: days.reduce((sum, day) => sum + day.commits, 0),
  }
}
