import type { WorkExperienceEvent } from './types'

const enCalendarEvents: WorkExperienceEvent[] = [
  {
    id: 'accenture_22',
    role: 'System Architect',
    companyName: 'Accenture Industry X',
    description:
        'I am a System Architect at Accenture Industry X, leading the development of a quality management solution. In my role, I design the overall architecture of the system while also acting as a technical lead, guiding the development team through the implementation process. I collaborate closely with management to ensure alignment on project goals and deliverables, ensuring the solution meets both business and technical requirements.',
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
        'In my current position as Head of Java developments for Travel, Hospitality & Logistics business unit I’m responsabile for the success of projects relying on Java technologies.\n' +
        '\n' +
        ' \n' +
        '\n' +
        ' My duties include the engagement of the customer, the complete design of the solution, the selection, management and mentoring of the dev team, and if the project requires it I still love to make my hands dirty partecipating in the developments of both, Front-End and Back-end, parts of the project.',
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
        'Reporting directly to the IT top management I’m leading the developments for both Group-wide and branded solutions.' ,
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
        'Designing solutions and leading dev teams in the Hospitality BU, working together with Customers like Carnival, GNV, MSC & Alpitour',
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
        'I started my experience with Engineering as a BA @ Carnival due to my experience in Asset Management solutions, but then I switched back to a technical role proposing, designing and developing a corporation wide Asset Management Solution.',
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
        'Started as a Tester I built my way up Leading the Test Automation efforts and then managing the QA Department.',
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
        'Right After Highschool I started my life as a developer, focusing on Mobile and Web solutions but as programming enthusiast I continued to study and making my hands dirty with many different technologies.',
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

export default enCalendarEvents


