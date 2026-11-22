import type { OpenSourceProject } from './types'

const kamino: OpenSourceProject = {
  id: 'kamino',
  name: 'Kamino',
  repo: 'davidemaggi/Kamino',
  icon: '/projects/kamino/icon.svg',
  accent: ['#7c3aed', '#16131c'],
  category: { en: 'Productivity', it: 'Produttività' },
  tagline: {
    en: 'Your Obsidian vaults, on every device, on your own server.',
    it: 'I tuoi vault Obsidian, su ogni dispositivo, sul tuo server.',
  },
  description: {
    en: 'Self-hosted sync for Obsidian with near real-time updates, encryption at rest and conflicts you can actually read. One promise: nothing is ever thrown away, and the state of every device is always visible. Plugin for desktop and mobile, Docker server and web dashboard.',
    it: 'Sync self-hosted per Obsidian con aggiornamenti quasi in tempo reale, cifratura a riposo e conflitti che si leggono davvero. Una sola promessa: non si butta via niente, e lo stato di ogni dispositivo è sempre visibile. Plugin per desktop e mobile, server Docker e dashboard web.',
  },
  features: {
    en: [
      'Near real-time sync over WebSocket, with catch-up after days offline',
      'No silent failures: every device shows when it last synced and what is still pending',
      'Conflicts side by side: keep yours, take theirs, keep both or merge by hand',
      'Trash and up to 90 days of history, plus ZIP export of any vault at any date',
      'Pair a phone with a QR code and a short confirmation code',
      'Contents, paths and vault names encrypted at rest; admins can’t peek',
    ],
    it: [
      'Sync quasi in tempo reale via WebSocket, anche dopo giorni offline',
      'Nessun errore silenzioso: ogni dispositivo mostra l’ultimo sync e cosa manca',
      'Conflitti affiancati: tieni la tua, prendi l’altra, tienile entrambe o uniscile a mano',
      'Cestino e fino a 90 giorni di storico, più export ZIP di un vault a qualsiasi data',
      'Abbina un telefono con un QR code e un breve codice di conferma',
      'Contenuti, percorsi e nomi dei vault cifrati a riposo; gli admin non possono sbirciare',
    ],
  },
  stack: ['TypeScript', 'react', 'node', 'pgsql', 'docker', 'Obsidian'],
  platforms: ['docker', 'macos', 'windows', 'linux', 'ios', 'android'],
  license: 'AGPL-3.0',
  install: ['docker pull ghcr.io/davidemaggi/kamino:latest'],
}

export default kamino
