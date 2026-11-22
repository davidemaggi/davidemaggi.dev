import type { AboutContent } from './types'

const enAboutContent: AboutContent = {
  greeting: "Hi! I'm Davide",
  headline: 'Manager · System Architect · Full-time nerd',
  bio: [
    'I spent 20+ years writing code. Then someone handed me a calendar, a team and a badge that says "Manager". I\'m still trying to figure out who lost the bet.',
    'These days my job is making sure the people writing the code have what they need: clear goals, fewer pointless meetings, and someone to blame when the Friday deploy goes sideways. Less Darth Vader force-choking officers over the Death Star budget, more an admiral who actually listens to the engineers before that exhaust port becomes a problem.',
    "I haven't fully left the terminal, though. I still draw architecture diagrams nobody asked for, review the odd PR, and break things in my side projects so I don't lose the habit. Off the clock you'll find me rewatching Star Wars for the hundredth time, binging sci-fi, fine-tuning my zombie apocalypse survival plan, playing video games, or flying a drone somewhere I probably shouldn't.",
  ],
  signOff: 'May the force be with you and your sprint.',
  info: {
    email: 'me[at]davidemaggi.dev',
    phone: 'Available on request',
    birthday: '1987-04-28',
    location: 'Rapallo, Genova (Italy)',
    languages: [
      { label: 'Italian', icon: '/flags/italy.svg' },
      { label: 'English', icon: '/flags/uk.svg' },
      { label: 'French', icon: '/flags/france.svg' },
      { label: 'Spanish', icon: '/flags/spain.svg' },
    ],
  },
  socials: [
    { label: 'Blog', handle: 'monkeyproof.dev', href: 'https://monkeyproof.dev', icon: '/icons/blogger.svg' },
    { label: 'GitHub', handle: 'davidemaggi', href: 'https://github.com/davidemaggi', icon: '/icons/github.svg' },
    { label: 'LinkedIn', handle: 'davidemaggi', href: 'https://www.linkedin.com/in/davidemaggi', icon: '/icons/linkedin.svg' },
    { label: 'X', handle: '@DavideMaggi', href: 'https://twitter.com/DavideMaggi', icon: '/icons/x.svg' },
    { label: 'Facebook', handle: 'davide.maggi87', href: 'https://www.facebook.com/davide.maggi87', icon: '/icons/facebook.svg' },
  ],
  causes: [
    {
      text: 'Consider a donation to help children from Ukraine',
      href: 'https://dona.savethechildren.it/fondo-emergenze-ucraina',
      icon: '/flags/ukraine.svg',
    },
    {
      text: 'If you are an IT professional, consider joining the group',
      href: 'https://t.me/s/itarmyofukraine2022',
      icon: '/icons/telegram.svg',
    },
  ],
  interests: [
    { label: 'Former National Waterpolo player & referee', icon: '/icons/waterpolo.svg' },
    { label: 'Pizza lover', icon: '/icons/pizza.svg' },
    { label: 'Retired bug maker, now bug delegator', icon: '/icons/bug.svg' },
    { label: 'Empire supporter', icon: '/icons/empire.svg', mono: true },
    { label: 'Love to travel', icon: '/icons/travel.svg' },
    { label: 'Movies & series enthusiast', icon: '/icons/movie.svg' },
    { label: 'Drone pilot & enthusiast', icon: '/icons/drone.svg' },
  ],
}

export default enAboutContent
