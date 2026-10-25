import { useEffect, useState } from 'react'

export type GitHubStats = {
  stars: number
  forks: number
  version: string | null
  releasedAt: string | null
  releaseUrl: string
}

const CACHE_TTL_MS = 60 * 60 * 1000
const cacheKey = (repo: string) => `daveos.github.${repo}`

const readCache = (repo: string): GitHubStats | null => {
  try {
    const raw = window.sessionStorage.getItem(cacheKey(repo))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { savedAt: number; stats: GitHubStats }
    return Date.now() - parsed.savedAt < CACHE_TTL_MS ? parsed.stats : null
  } catch {
    return null
  }
}

/** Live repo stats from the public GitHub API, cached per session; null while loading or on failure. */
export function useGitHubStats(repo: string) {
  const [stats, setStats] = useState<GitHubStats | null>(() => readCache(repo))

  useEffect(() => {
    if (readCache(repo)) return
    const controller = new AbortController()

    const load = async () => {
      try {
        const [repoResponse, releaseResponse] = await Promise.all([
          fetch(`https://api.github.com/repos/${repo}`, { signal: controller.signal }),
          fetch(`https://api.github.com/repos/${repo}/releases/latest`, { signal: controller.signal }),
        ])
        if (!repoResponse.ok) return
        const repoData = (await repoResponse.json()) as { stargazers_count: number; forks_count: number }
        const releaseData = releaseResponse.ok
          ? ((await releaseResponse.json()) as { tag_name?: string; published_at?: string; html_url?: string })
          : {}
        const next: GitHubStats = {
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          version: releaseData.tag_name ?? null,
          releasedAt: releaseData.published_at ?? null,
          releaseUrl: releaseData.html_url ?? `https://github.com/${repo}/releases/latest`,
        }
        window.sessionStorage.setItem(cacheKey(repo), JSON.stringify({ savedAt: Date.now(), stats: next }))
        setStats(next)
      } catch {
        // Offline or rate-limited: the page simply renders without live numbers.
      }
    }

    void load()
    return () => controller.abort()
  }, [repo])

  return stats
}
