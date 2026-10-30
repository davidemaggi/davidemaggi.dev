export type BlogPost = {
  title: string
  link: string
  description: string
  /** ISO date string. */
  publishedAt: string
}

/** The blog shown by the MonkeyProof app, the command palette and the terminal. */
export const BLOG = {
  name: 'MonkeyProof',
  url: 'https://monkeyproof.dev',
  /**
   * Same-origin path proxied to https://monkeyproof.dev/rss.xml (the feed has no CORS headers).
   * Served by docker/nginx.conf in production and by the Vite proxy in development.
   */
  feedPath: '/feeds/monkeyproof.xml',
} as const

/** Shipped with the bundle so the app still has something to show when the feed can't be reached. */
export const FALLBACK_POSTS: readonly BlogPost[] = [
  {
    title: 'OpenEverest in the Real World: Running Databases on Kubernetes Without Cloud Lock-In',
    link: 'https://monkeyproof.dev/posts/openeverest-database-platform-on-kubernetes/',
    description:
      'A practical deep dive into OpenEverest with a realistic production scenario: install the platform, provision PostgreSQL on Kubernetes, set backups and PITR, wire monitoring, and handle Day 2 operations without managed DB lock-in.',
    publishedAt: '2026-04-12T10:30:00.000Z',
  },
  {
    title: 'Do You Really Need to Master Kubernetes for DevOps?',
    link: 'https://monkeyproof.dev/posts/do-you-really-need-to-master-kubernetes-for-devops/',
    description:
      'A practical guide to prioritizing DevOps skills: why cloud, CI/CD, and infrastructure as code matter more than deep Kubernetes expertise for most roles.',
    publishedAt: '2026-04-09T22:36:00.000Z',
  },
  {
    title: 'Welcome to MonkeyProof',
    link: 'https://monkeyproof.dev/posts/helloworld/',
    description:
      'A quick hello, a placeholder, and the beginning of a blog about software architecture, backend engineering, and technically accurate chaos.',
    publishedAt: '2026-04-06T10:00:00.000Z',
  },
]
