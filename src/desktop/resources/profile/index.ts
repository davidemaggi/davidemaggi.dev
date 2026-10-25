export type SocialLink = {
  id: string
  href: string
  icon: string
  label: string
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'github', href: 'https://github.com/davidemaggi', icon: '/icons/github.svg', label: 'GitHub' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/davidemaggi', icon: '/icons/linkedin.svg', label: 'LinkedIn' },
  { id: 'blog', href: 'https://monkeyproof.dev', icon: '/icons/blogger.svg', label: 'Blog' },
  { id: 'x', href: 'https://twitter.com/DavideMaggi', icon: '/icons/x.svg', label: 'X / Twitter' },
]
