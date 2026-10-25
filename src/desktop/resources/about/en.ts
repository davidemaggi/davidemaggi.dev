import type { AboutContent } from './types'

const enAboutContent: AboutContent = {
  greeting: "Hi! I'm Davide",
  headline: 'Tech Lead · System Architect · Star Wars nerd',
  bio: [
    'I may not be a Jedi, but I have the force of a powerful tech lead and architect.',
    'With over 20 years of programming experience, I have the skills to design and lead a team of developers to create innovative solutions that will make you say "that\'s no moon, it\'s a space station".',
    "I'm passionate about coding and I love to create software that's not just functional, but also elegant and maintainable. I'm a firm believer in writing readable code and I always strive for code that's easy to understand. In my free time, I can be found nerding out over Star Wars and playing video games.",
  ],
  signOff: 'May the force be with you and your code.',
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
    { label: 'Expert bug maker', icon: '/icons/bug.svg' },
    { label: 'Empire supporter', icon: '/icons/empire.svg', mono: true },
    { label: 'Love to travel', icon: '/icons/travel.svg' },
    { label: 'Movies & series enthusiast', icon: '/icons/movie.svg' },
    { label: 'Drone pilot & enthusiast', icon: '/icons/drone.svg' },
  ],
}

export default enAboutContent
