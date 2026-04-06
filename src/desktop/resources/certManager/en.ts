import type { CertificateFolder } from './types'

const enCertFolders: CertificateFolder[] = [
  {
    id: 'personal',
    label: 'Personal',
    certificates: [

      {
        id: 'acn_people',
        commonName: 'People Leadership',
        issuedBy: 'Accenture',
        issuedByLogo: { src: '/icons/accenture.svg', alt: 'Accenture' },
        validFrom: '2024-10',
        description: '',
      },
      {
        id: 'manufacturer',
        commonName: 'Digital Technologies and the Future of Manufacturing Specialization(IIoT, Digital Twins, Additive Manufacturing)',
        issuedBy: 'University of Michigan',
        issuedByLogo: { src: '/icons/mu.svg', alt: 'Michigan' },
        validFrom: '2022-05-01',
        serialNumber: '7W7XFAAZX3KL',
        description: '',
      },
      {
        id: 'gloud_iot',
        commonName: 'Industrial IoT on Google Cloud',
        issuedBy: 'Google',
        issuedByLogo: { src: '/icons/google.svg', alt: 'Google' },
        validFrom: '2022-04-22',
        serialNumber: 'HBBLE3LJ4KWK',
        description: '',
      },



      {
        id: 'nexi',
        commonName: 'Nexi Dev Training Program',
        issuedBy: 'Nexi',
        issuedByLogo: { src: '/icons/nexi.svg', alt: 'Nexi' },
        validFrom: '2020-06-13',
        description: '',
      },
      {
        id: 'english',
        commonName: 'EF SET English Certificate 92/100 (C2 Proficient)',
        issuedBy: 'EF Standard English Test (EF SET)',
        issuedByLogo: { src: '/icons/efset.png', alt: 'Efset' },
        validFrom: '2020-05-17',
        description: '',
      },
      {
        id: 'pmp',
        commonName: 'Project Management Program',
        issuedBy: 'International Business Management Institute (IBMI)',
        issuedByLogo: { src: '/icons/ibmi.svg', alt: 'IbmI' },
        validFrom: '2020-05-14',
        serialNumber: '256514-158-854-3521',
        description: '',
      },
      {
        id: 'marketing',
        commonName: 'Fundamentals of Digital Marketing',
        issuedBy: 'Google',
        issuedByLogo: { src: '/icons/google.svg', alt: 'Google' },
        validFrom: '2020-04-22',
        serialNumber: 'METQ7GMY4',
        description: '',
      },


      {
        id: 'scrum',
        commonName: 'Professional Scrum Master - PSM I',
        issuedBy: 'Scrum.org',
        issuedByLogo: { src: '/icons/scrum.svg', alt: 'scrum' },
        validFrom: '2019-07-13',
        description: '',
      },

      {
        id: 'maritime',
        commonName: 'Maritime Logistics and Supply Chain Management',
        issuedBy: 'Technische Hochschule Lübeck',
        issuedByLogo: { src: '/icons/luebeck.svg', alt: 'Lubeck' },
        validFrom: '2017-06-30',
        description: '',
      },
    ],
  },
  {
    id: 'ai',
    label: 'Artificial Intelligence',
    certificates: [
      {
        id: 'nano_agentic',
        commonName: 'Agentic AI Nanodegree',
        issuedBy: 'Udacity',
        issuedByLogo: { src: '/icons/udacity.svg', alt: 'udacity' },
        validFrom: '2025-11-20',
        description: '',
      },
      {
        id: 'acn_agentic',
        commonName: 'Reinvention with Agentic AI',
        issuedBy: 'Accenture',
        issuedByLogo: { src: '/icons/accenture.svg', alt: 'Accenture' },
        validFrom: '2025-12-01',
        description: '',
      },
      {
        id: 'ms_ai',
        commonName: ' Microsoft Certified: Azure AI Fundamentals',
        issuedBy: 'Microsoft',
        issuedByLogo: { src: '/icons/microsoft.svg', alt: 'Microsoft' },
        validFrom: '2024-12-10',
        description: '',
      },
      {
        id: 'ml_business',
        commonName: 'Machine Learning for Business Professionals',
        issuedBy: 'Google',
        issuedByLogo: { src: '/icons/google.svg', alt: 'Google' },
        validFrom: '2020-04-22',
        serialNumber: '7DC9V29DKWTG',
        description: '',
      },
      {
        id: 'tensor',
        commonName: 'Machine Learning with TensorFlow on Google Cloud Platform Specialization',
        issuedBy: 'Google',
        issuedByLogo: { src: '/icons/google.svg', alt: 'Google' },
        validFrom: '2020-06-17',
        serialNumber: 'AJSYVV98B932',
        description: '',
      },
      {
        id: 'ibm_big',
        commonName: 'Big Data Foundations - Level 2',
        issuedBy: 'IBM',
        issuedByLogo: { src: '/icons/skills/ibm.svg', alt: 'IBM' },
        validFrom: '2017-05',
        description: '',
      },

    ],
  },
  {
    id: 'testing',
    label: 'Software Testing',
    certificates: [
      {
        id: 'CTAL_tae',
        commonName: 'Certified Tester, Advanced Level - Test Automation Engineer (CTAL-TAE)',
        issuedBy: 'ISTQB - International Software Testing Qualifications Board',
        issuedByLogo: { src: '/icons/istqb.svg', alt: 'istqb' },
        validFrom: '2017-07-15',
        serialNumber: '17-CTAL-TAE-00020-USA',
        description: '',
      },
      {
        id: 'CTFL',
        commonName: 'Certificate Software Tester - Foundation Level',
        issuedBy: 'ISTQB - International Software Testing Qualifications Board',
        issuedByLogo: { src: '/icons/istqb.svg', alt: 'istqb' },
        validFrom: '2016-04-11',
        serialNumber: '16_2033',
        description: '',
      },
      {
        id: 'bear',
        commonName: 'SmartBear Academy - TesComplete Graduate',
        issuedBy: 'SmartBear',
        issuedByLogo: { src: '/icons/smartbear.svg', alt: 'smartbear' },
        validFrom: '2017-05',
        description: '',
      },
    ],

  },
  {
    id: 'cloud',
    label: 'Cloud',
    certificates: [
      {
        id: 'aws',
        commonName: 'AWS Learning: Architecting',
        issuedBy: 'Amazon',
        issuedByLogo: { src: '/icons/skills/aws.svg', alt: 'Aws' },
        validFrom: '2023-03',
        description: '',
      },

      {
        id: 'gcloud_dev',
        commonName: 'Google Cloud Platform - Developer Enablement Program',
        issuedBy: 'Google',
        issuedByLogo: { src: '/icons/google.svg', alt: 'Google' },
        validFrom: '2020-06',
        description: '',
      },
    ],

  }
  ,
  {
    id: 'db',
    label: 'Database',
    certificates: [


      {
        id: 'apollo_pro',
        commonName: 'Graph Developer - Professional',
        issuedBy: 'Apollo GrapphQL',
        issuedByLogo: { src: '/icons/apollo.svg', alt: 'Apollo' },
        validFrom: '2023-05-10',
        description: '',
      },
      {
        id: 'apollo_ass',
        commonName: 'Graph Developer - Associate',
        issuedBy: 'Apollo GrapphQL',
        issuedByLogo: { src: '/icons/apollo.svg', alt: 'Apollo' },
        validFrom: '2023-05-11',
        description: '',
      },
      {
        id: 'redis',
        commonName: 'Redis Certified Developer',
        issuedBy: 'Redis',
        issuedByLogo: { src: '/icons/skills/redis.svg', alt: 'Redis' },
        validFrom: '2022-03',
        serialNumber: '47264313',
        description: '',
      },
      {
        id: 'couch',
        commonName: 'Couchbase Certified Associate Architect',
        issuedBy: 'Couchbase',
        issuedByLogo: { src: '/icons/skills/apachecouchdb.svg', alt: 'CouchDb' },
        validFrom: '2021-03',
        description: '',
      },
      {
        id: 'mongo',
        commonName: 'MongoDB',
        issuedBy: 'MongoDB',
        issuedByLogo: { src: '/icons/skills/mongodb.svg', alt: 'MongoDB' },
        validFrom: '2018-09-01',
        description: '',
      },
    ],

  },
]

export default enCertFolders

