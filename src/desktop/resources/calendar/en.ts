import type { WorkExperienceEvent } from './types'

const enCalendarEvents: WorkExperienceEvent[] = [
  {
    id: 'accenture-22',
    role: 'System Architect',
    companyName: 'Company A',
    description:
      'Built web dashboards and reusable components with a focus on performance and accessibility.',
    icon: {
      src: '/icons/calendar/frontend.svg',
      alt: 'Frontend role icon',
    },
    startMonth: 3,
    startYear: 2020,
    endMonth: 8,
    endYear: 2022,
    tagIds: ['frontend', 'react', 'accessibility'],
  },
  {
    id: 'engineering-2018',
    role: 'Full Stack Developer',
    companyName: 'Company B',
    description:
      'Delivered end-to-end product features, integrated APIs, and improved overall UX quality.',
    icon: {
      src: '/icons/calendar/fullstack.svg',
      alt: 'Full stack role icon',
    },
    startMonth: 9,
    startYear: 2022,
    endMonth: 2,
    endYear: 2024,
    tagIds: ['fullstack', 'api', 'ux'],
  },
  {
    id: 'senior-product-engineer-company-c',
    role: 'Senior Product Engineer',
    companyName: 'Company C',
    description:
      'Led frontend architecture, design system strategy, and code quality across a cross-functional team.',
    icon: {
      src: '/icons/calendar/senior.svg',
      alt: 'Senior engineer role icon',
    },
    startMonth: 3,
    startYear: 2024,
    ongoing: true,
    tagIds: ['lead', 'architecture', 'design-system'],
  },
]

export default enCalendarEvents


