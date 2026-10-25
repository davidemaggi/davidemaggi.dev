export const BOOT_SESSION_KEY = 'daveos.booted.v1'

/** The boot animation runs once per browser session and never with reduced motion. */
export const shouldShowBoot = () => {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return window.sessionStorage.getItem(BOOT_SESSION_KEY) !== '1'
}

/** Makes the next page load play the boot animation again (used by restart and shutdown). */
export const resetBootFlag = () => {
  window.sessionStorage.removeItem(BOOT_SESSION_KEY)
}
