import type { SkillTrack } from './types'

const itSkills: SkillTrack[] = [
  {
    id: 'react-architecture',
    title: 'React Architecture',
    description:
      'Progetto interfacce modulari, componenti riusabili e stato prevedibile per applicazioni scalabili.',
    level: 'Avanzato',
    years: 4,
    tags: ['React', 'Design System', 'State Management'],
    icon: {
      src: '/icons/skills/react-architecture.svg',
      alt: 'React architecture icon',
    },
  },
  {
    id: 'typescript-engineering',
    title: 'TypeScript Engineering',
    description:
      'Uso TypeScript per modellare domini, ridurre bug runtime e mantenere codice leggibile nel tempo.',
    level: 'Avanzato',
    years: 5,
    tags: ['TypeScript', 'Domain Modeling', 'Code Quality'],
    icon: {
      src: '/icons/skills/typescript-engineering.svg',
      alt: 'TypeScript engineering icon',
    },
  },
  {
    id: 'ui-ux-craft',
    title: 'UI UX Craft',
    description:
      'Curo dettaglio visivo, accessibilita e micro-interazioni per creare esperienze piacevoli e chiare.',
    level: 'Intermedio',
    years: 3,
    tags: ['UI', 'UX', 'Accessibility'],
    icon: {
      src: '/icons/skills/ui-ux-craft.svg',
      alt: 'UI UX craft icon',
    },
  },
]

export default itSkills


