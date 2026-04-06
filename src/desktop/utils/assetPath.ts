const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i

export const resolveAssetPath = (rawPath: string): string => {
  if (!rawPath) return rawPath

  if (
    ABSOLUTE_URL_RE.test(rawPath)
    || rawPath.startsWith('data:')
    || rawPath.startsWith('blob:')
  ) {
    return rawPath
  }

  if (!rawPath.startsWith('/')) return rawPath

  const base = import.meta.env.BASE_URL || '/'
  return `${base}${rawPath.slice(1)}`
}

