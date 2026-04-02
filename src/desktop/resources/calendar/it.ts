import type { WorkExperienceEvent } from './types'

const itCalendarEvents: WorkExperienceEvent[] = [
  {
    id: 'accenture_22',
    role: 'System Architect',
    companyName: 'Accenture Industry X',
    description:
      'Sono un System Architect presso Accenture Industry X, dove coordino lo sviluppo di una soluzione per la gestione della qualità. Nel mio ruolo, mi occupo della progettazione dell\'architettura complessiva del sistema, ricoprendo anche il ruolo di tech lead e guidando il team di sviluppo nell\'implementazione. Lavoro a stretto contatto con la direzione per garantire che gli obiettivi del progetto siano allineati e che la soluzione soddisfi i requisiti sia aziendali che tecnici.',
    barColor: '#A100FF',
    icon: {
      src: '/icons/accenture.svg',
      alt: 'Accenture Logo',
    },
    startMonth: 6,
    startYear: 2022,
    ongoing: true,

    tagIds: ['frontend', 'react', 'accessibility'],
  },
  {
    id: 'engineering_20',
    role: 'Head of Java Developments @ THL BU',
    companyName: 'Engineering S.p.A.',
    description:
        'Nel mio ruolo di responsabile per gli sviluppi Java per la Business Unit Travel, Hospitality & Logistics ho la responsabilita\' del successo di tutti i progetti con tecnologie Java.\n' +
        '\n' +
        ' \n' +
        '\n' +
        'I miei compiti includono l\'ingaggio del cliente, il design completo della soluzione, la selezione, gestione e mentoring del team di sviluppo e se il progetto lo richiede adoro continuare a sporcarmi le mani nello sviluppo sia delle parti Back-End che Front-end.',
    barColor: '#d1005b',
    icon: {
      src: '/icons/engineering.svg',
      alt: 'Head of java',
    },
    startMonth: 4,
    startYear: 2020,
    endMonth: 6,
    endYear: 2022,
    tagIds: ['frontend', 'react', 'accessibility'],
  }
  ,
  {
    id: 'engineering_18',
    role: 'Solution Architect / Tech. Leader',
    companyName: 'Engineering S.p.A.aa',
    description:
        'Occupandomi dell\'architettura e sviluppo di progetti all\'interno della Business Unit Travel & Hospitality, lavorando con clienti del calibro di Carnival, GNV, MSC & Alpitour',
    barColor: '#440044',
    icon: {
      src: '/icons/costa.svg',
      alt: 'Architect',
    },
    startMonth: 2,
    startYear: 2018,
    endMonth: 2,
    endYear: 2020,
    tagIds: ['frontend', 'react', 'accessibility'],
  }
  ,
  {
    id: 'spectec_15',
    role: 'Solution Architect / Tech. Leader',
    companyName: 'SpecTec S.p.A.',
    description:
        'Occupandomi dell\'architettura e sviluppo di progetti all\'interno della Business Unit Travel & Hospitality, lavorando con clienti del calibro di Carnival, GNV, MSC & Alpitour',
    barColor: '#447799',
    icon: {
      src: '/icons/costa.svg',
      alt: 'Architect',
    },
    startMonth: 1,
    startYear: 2015,
    endMonth: 7,
    endYear: 2018,
    tagIds: ['frontend', 'react', 'accessibility'],
  }
]

export default itCalendarEvents


