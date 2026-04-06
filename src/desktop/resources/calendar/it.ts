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

    tagIds: ['microservice', 'microfrontend', 'kubernetes','dotnet','pgsql','mssql','azure','mongo','react','iot','rabbitmq','gql','redis'],
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
    endMonth: 5,
    endYear: 2022,
    tagIds: [],
  },
  {
    id: 'alpitour_18',
    role: 'Solution Architect / Tech Lead',
    companyName: 'Alpitour S.p.A.',
    description:
        'Riportando direttamente al top Management IT guido gli sviluppi di soluzioni sia trasversali che di Brand.',
    barColor: '#4490CA',
    icon: {
      src: '/icons/alpitour.svg',
      alt: 'alpitour',
    },
    startMonth: 4,
    startYear: 2020,
    endMonth: 5,
    endYear: 2022,
    tagIds: ['java', 'spring', 'angular', 'node','electron', 'couchdb','db2','mssql','ibm','aws', 'kafka', 'elastic', 'devops'],
  },
  {
    id: 'engineering_188',
    role: 'Solution Architect / BA',
    companyName: 'Engineering S.p.A.',
    description:
        'Occupandomi dell\'architettura e sviluppo di progetti all\'interno della Business Unit Travel & Hospitality, lavorando con clienti del calibro di Carnival, GNV, MSC & Alpitour',
    barColor: '#d1005b',
    icon: {
      src: '/icons/engineering.svg',
      alt: 'Architect',
    },
    startMonth: 8,
    startYear: 2018,
    endMonth: 3,
    endYear: 2020,
    tagIds: ['microservice', 'microfrontend', 'aws', 'azure','gcloud', 'docker','kubernetes','openshift','devops','gitlab','sonarqube'],
  },
  {
    id: 'engineering_18',
    role: 'Solution Architect / BA',
    companyName: 'Carnival Corporation',
    description:
        'Ho cominciato la mia esperienza in Engineering come BA in Carnival(Costa Crociere) per la mia esperienza nel settore dell\'asset management, ma sono tornato quasi immediatamente a ricoprire un ruolo tecnico proponendo, disegnando, e sviluppando un sistema trasversale di asset management.',
    barColor: '#DFB149',
    icon: {
      src: '/icons/costa.svg',
      alt: 'Architect',
    },
    startMonth: 8,
    startYear: 2018,
    endMonth: 3,
    endYear: 2020,
    tagIds: ['dotnet', 'mssql', 'angular', 'azure','react', 'couchdb','iot','splunk'],
  },
  {
    id: 'spectec_15',
    role: 'Senior Software Tester / Senior Test Automation Engineer',
    companyName: 'SpecTec S.p.A.',
    description:
        'Cominciato da Tester ho preso poi in carico la gestione del Dipartimento QA ed ho introdotto la Test Automation in azienda.\n' +
        '',
    barColor: '#447799',
    icon: {
      src: '/icons/spectec.svg',
      alt: 'spectec',
    },
    startMonth: 1,
    startYear: 2015,
    endMonth: 7,
    endYear: 2018,
    tagIds: ['dotnet', 'mssql', 'sybase', 'oracle', 'pb', 'testautomation', 'jenkins'],
  },
  {
    id: 'me_1987',
    role: 'Programmer / Consultant / Founder',
    companyName: 'Bhalu',
    description:
        'Subito dopo aver terminato la scuola ho cominciato la mia vita da programmatore, concentrandomi su sviluppo Web e Mobile, ma da buon smanettone ho continuato a studiare e a sporcarmi le mani con molte tecnologie diverse.',
    barColor: '#ED702E',
    icon: {
      src: '/icons/self.svg',
      alt: 'self',
    },
    startMonth: 6,
    startYear: 2006,
    endMonth: 12,
    endYear: 2014,
    tagIds: ['dotnet', 'java', 'android', 'ios', 'python', 'php', 'mysql'],
  }
]

export default itCalendarEvents


