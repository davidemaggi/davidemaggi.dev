const UNLOCKS_KEY = 'daveos.unlocks.v1'
const STAR_DESTROYER = 'stardestroyer'

/** Fired by the terminal and the mobile shell to start the opening crawl. */
export const EASTER_EGG_EVENT = 'daveos:easter-egg'

export const triggerEasterEgg = () => window.dispatchEvent(new Event(EASTER_EGG_EVENT))

export const isStarDestroyerUnlocked = () => {
  try {
    const unlocks = JSON.parse(window.localStorage.getItem(UNLOCKS_KEY) ?? '[]') as unknown
    return Array.isArray(unlocks) && unlocks.includes(STAR_DESTROYER)
  } catch {
    return false
  }
}

export const unlockStarDestroyer = () => {
  window.localStorage.setItem(UNLOCKS_KEY, JSON.stringify([STAR_DESTROYER]))
}

/** Shutting down or restarting DaveOS forgets the unlock, like a fresh install. */
export const resetEasterEgg = () => {
  window.localStorage.removeItem(UNLOCKS_KEY)
}
