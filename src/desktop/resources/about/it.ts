import type { AboutContent } from './types'

const itAboutContent: AboutContent = {
  greeting: 'Ciao! Sono Davide',
  headline: 'Manager · System Architect · Nerd a tempo pieno',
  bio: [
    'Ho passato più di 20 anni a scrivere codice. Poi qualcuno mi ha consegnato un calendario, un team e un badge con scritto "Manager". Sto ancora cercando di capire chi ha perso la scommessa.',
    'Oggi il mio lavoro è fare in modo che chi scrive il codice abbia tutto quello che gli serve: obiettivi chiari, meno riunioni inutili e qualcuno a cui dare la colpa quando il deploy del venerdì va storto. Meno Darth Vader che strozza gli ufficiali per il budget della Morte Nera, più un ammiraglio che ascolta gli ingegneri prima che quel condotto di scarico diventi un problema.',
    'Il terminale però non l\'ho mollato del tutto: disegno ancora diagrammi architetturali che nessuno mi ha chiesto, ogni tanto revisiono qualche PR e rompo cose nei miei side project per non perdere l\'abitudine. Fuori orario mi trovi a riguardare Star Wars per la centesima volta, a divorare fantascienza, a pianificare la mia strategia per l\'apocalisse zombie, a giocare ai videogiochi o a far volare un drone dove probabilmente non dovrei.',
  ],
  signOff: 'Che la forza sia con te e con il tuo sprint.',
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
    { label: 'Creatore di bug in pensione, ora li delego', icon: '/icons/bug.svg' },
    { label: "Supporter dell'Impero", icon: '/icons/empire.svg', mono: true },
    { label: 'Amo viaggiare', icon: '/icons/travel.svg' },
    { label: 'Amante di film e serie TV', icon: '/icons/movie.svg' },
    { label: 'Pilota di droni certificato', icon: '/icons/drone.svg' },
  ],
}

export default itAboutContent
