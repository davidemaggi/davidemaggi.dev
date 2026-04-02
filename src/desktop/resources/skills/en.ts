import type { SkillTrack } from './types'

const enSkills: SkillTrack[] = [
  {
    id: 'react-architecture',
    title: 'React Architecture',
    description:
      'I design modular interfaces, reusable components, and predictable state for scalable applications.',
    level: 'Advanced',
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
      'I use TypeScript to model domains, reduce runtime bugs, and keep code maintainable over time.',
    level: 'Advanced',
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
      'I focus on visuals, accessibility, and micro-interactions to deliver clear and enjoyable experiences.',
    level: 'Intermediate',
    years: 3,
    tags: ['UI', 'UX', 'Accessibility'],
    icon: {
      src: '/icons/skills/ui-ux-craft.svg',
      alt: 'UI UX craft icon',
    },
  },
]

export default enSkills


