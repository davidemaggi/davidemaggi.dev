import type { AboutContent } from './types'

const itAboutContent: AboutContent = {
  greeting: 'Ciao! Sono Davide',
  headline: 'Tech Lead · System Architect · Nerd di Star Wars',
  bio: [
    'Potrei non essere un Jedi, ma la forza di un tech lead e un architetto scorre potente in me.',
    'Con oltre 20 anni di esperienza nella programmazione, ho le competenze per progettare e guidare un team di sviluppatori nell\'ideazione di soluzioni innovative che ti faranno dire "non è una luna, è una stazione spaziale".',
    'Sono appassionato di coding e adoro creare software che non solo sia funzionale, ma anche elegante e manutenibile. Sono un convinto sostenitore della scrittura di codice leggibile e mi sforzo sempre di ottenere un codice di facile comprensione. Nel mio tempo libero, mi puoi trovare a nerdare su Star Wars e a giocare ai videogiochi.',
  ],
  signOff: 'Che la forza sia con te e con il tuo codice.',
  info: {
    email: 'me[at]davidemaggi.dev',
    phone: 'Disponibile su richiesta',
    birthday: '1987-04-28',
    location: 'Rapallo, Genova (Italia)',
    languages: [
      { label: 'Italiano', icon: '/flags/italy.svg' },
      { label: 'Inglese', icon: '/flags/uk.svg' },
      { label: 'Francese', icon: '/flags/france.svg' },
      { label: 'Spagnolo', icon: '/flags/spain.svg' },
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
      text: "Considera una donazione per aiutare i bambini dell'Ucraina",
      href: 'https://dona.savethechildren.it/fondo-emergenze-ucraina',
      icon: '/flags/ukraine.svg',
    },
    {
      text: 'Se sei un professionista IT considera di unirti al gruppo',
      href: 'https://t.me/s/itarmyofukraine2022',
      icon: '/icons/telegram.svg',
    },
  ],
  interests: [
    { label: 'Ex giocatore e arbitro di Serie A di pallanuoto', icon: '/icons/waterpolo.svg' },
    { label: 'Amante della pizza', icon: '/icons/pizza.svg' },
    { label: 'Creatore di bug senior', icon: '/icons/bug.svg' },
    { label: "Supporter dell'Impero", icon: '/icons/empire.svg', mono: true },
    { label: 'Amo viaggiare', icon: '/icons/travel.svg' },
    { label: 'Amante di film e serie TV', icon: '/icons/movie.svg' },
    { label: 'Pilota di droni certificato', icon: '/icons/drone.svg' },
  ],
}

export default itAboutContent
