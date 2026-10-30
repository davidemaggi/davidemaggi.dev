import { useEffect, useState } from 'react'
import { BLOG, FALLBACK_POSTS } from '../../desktop/resources/blog'
import type { BlogPost } from '../../desktop/resources/blog'
import { resolveAssetPath } from '../../desktop/utils/assetPath'

const CACHE_KEY = 'daveos.blog.feed.v1'
const CACHE_TTL_MS = 30 * 60 * 1000

type FeedState = { posts: readonly BlogPost[]; isLive: boolean }

const parseFeed = (xml: string): BlogPost[] => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) return []
  return [...doc.querySelectorAll('item')]
    .map((item) => ({
      title: item.querySelector('title')?.textContent?.trim() ?? '',
      link: item.querySelector('link')?.textContent?.trim() ?? '',
      description: item.querySelector('description')?.textContent?.trim() ?? '',
      publishedAt: new Date(item.querySelector('pubDate')?.textContent ?? '').toISOString(),
    }))
    .filter((post) => post.title && post.link.startsWith(BLOG.url))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

const readCache = (): BlogPost[] | null => {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { savedAt: number; posts: BlogPost[] }
    return Date.now() - parsed.savedAt < CACHE_TTL_MS ? parsed.posts : null
  } catch {
    return null
  }
}

/** Latest posts from the blog's RSS feed, cached per session, falling back to the bundled snapshot. */
export function useBlogFeed() {
  const [state, setState] = useState<FeedState>(() => {
    const cached = readCache()
    return cached ? { posts: cached, isLive: true } : { posts: FALLBACK_POSTS, isLive: false }
  })

  useEffect(() => {
    if (readCache()) return
    const controller = new AbortController()

    fetch(resolveAssetPath(BLOG.feedPath), { signal: controller.signal })
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
      .then((xml) => {
        const posts = parseFeed(xml)
        if (!posts.length) return
        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), posts }))
        setState({ posts, isLive: true })
      })
      .catch(() => {
        // Offline, proxy missing or feed down: keep the bundled snapshot.
      })

    return () => controller.abort()
  }, [])

  return state
}
