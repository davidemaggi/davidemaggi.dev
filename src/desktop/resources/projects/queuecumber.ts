import type { OpenSourceProject } from './types'

const queueCumber: OpenSourceProject = {
  id: 'queuecumber',
  name: 'QueueCumber',
  repo: 'davidemaggi/QueueCumber',
  icon: '/projects/queuecumber/icon.svg',
  accent: ['#22c55e', '#064e3b'],
  category: { en: 'Developer tools', it: 'Strumenti per sviluppatori' },
  tagline: {
    en: 'A little less queue confusion. A little more cucumber.',
    it: 'Un po’ meno confusione nelle code. Un po’ più cetriolo.',
  },
  description: {
    en: "A cross-platform desktop inspector for RabbitMQ and Kafka. Capture live traffic, explore routing keys, inspect messages and export history, without borrowing an application's consumer.",
    it: 'Un inspector desktop multipiattaforma per RabbitMQ e Kafka. Cattura il traffico live, esplora le routing key, ispeziona i messaggi ed esporta lo storico, senza rubare il consumer a nessuna applicazione.',
  },
  features: {
    en: [
      'Bring your own broker: save, test and browse RabbitMQ and Kafka connections',
      'Mirror bindings into a temporary queue or read streams from any offset',
      'Readable messages: structured headers, pretty JSON and raw bytes',
      'Bounded memory cache and encrypted on-disk history',
      'Export as JSONL, folder or ZIP; encrypted profile import/export',
      'English or Italian, light or dark',
    ],
    it: [
      'Usa il tuo broker: salva, testa ed esplora connessioni RabbitMQ e Kafka',
      'Duplica i binding in una coda temporanea o leggi stream da qualsiasi offset',
      'Messaggi leggibili: header strutturati, JSON formattato e byte originali',
      'Cache in memoria limitata e storico cifrato su disco',
      'Esporta in JSONL, cartella o ZIP; import/export cifrato dei profili',
      'Inglese o italiano, chiaro o scuro',
    ],
  },
  stack: ['rabbitmq', 'kafka', 'electron', 'TypeScript'],
  platforms: ['macos', 'windows', 'linux'],
  license: 'MIT',
  install: ['winget install DavideMaggi.QueueCumber', 'choco install queuecumber'],
}

export default queueCumber
