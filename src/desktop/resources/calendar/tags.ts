import type { Locale } from '../../types'
import type { CalendarTag, CalendarTagRegistryEntry } from './types'

const calendarTagRegistry: CalendarTagRegistryEntry[] = [
  {
    id: 'microservice',
    labels: { it: 'MicroServices', en: 'MicroServices' },
    icon: { src: '/icons/skills/microservice.svg', alt: 'microservice tag icon' },
  },
  {
    id: 'microfrontend',
    labels: { it: 'MicroFrontends', en: 'MicroFrontends' },
    icon: { src: '/icons/skills/microfronted.svg', alt: 'microfrontend tag icon' },
  },
  {
    id: 'kubernetes',
    labels: { it: 'Kubernetes', en: 'Kubernetes' },
    icon: { src: '/icons/skills/kubernetes.svg', alt: 'kubernetes tag icon' },
  },
  {
    id: 'dotnet',
    labels: { it: '.Net', en: '.Net' },
    icon: { src: '/icons/skills/dotnet.svg', alt: 'dotnet tag icon' },
  },
  {
    id: 'pgsql',
    labels: { it: 'PostgreSQL', en: 'PostgreSQL' },
    icon: { src: '/icons/skills/postgresql.svg', alt: 'pgsql tag icon' },
  },
  {
    id: 'mssql',
    labels: { it: 'MSSQL', en: 'MSSQL' },
    icon: { src: '/icons/skills/mssql.svg', alt: 'mssql tag icon' },
  },
  {
    id: 'azure',
    labels: { it: 'Azure', en: 'Azure' },
    icon: { src: '/icons/skills/azure.svg', alt: 'azure tag icon' },
  },
  {
    id: 'mongo',
    labels: { it: 'MongoDB', en: 'MongoDB' },
    icon: { src: '/icons/skills/mongodb.svg', alt: 'mongo tag icon' },
  },
  {
    id: 'react',
    labels: { it: 'ReactJS', en: 'ReactJS' },
    icon: { src: '/icons/skills/react.svg', alt: 'react tag icon' },
  },
  {
    id: 'iot',
    labels: { it: 'IoT', en: 'IoT' },
    icon: { src: '/icons/skills/iot.svg', alt: 'iot tag icon' },
  },
  {
    id: 'rabbitmq',
    labels: { it: 'RabbitMQ', en: 'RabbitMQ' },
    icon: { src: '/icons/skills/rabbitmq.svg', alt: 'rabbitmq tag icon' },
  },
  {
    id: 'gql',
    labels: { it: 'GraphQL', en: 'GraphQL' },
    icon: { src: '/icons/skills/graphql.svg', alt: 'gql tag icon' },
  },
  {
    id: 'redis',
    labels: { it: 'Redis', en: 'Redis' },
    icon: { src: '/icons/skills/redis.svg', alt: 'redis tag icon' },
  },
  {
    id: 'aws',
    labels: { it: 'AWS', en: 'AWS' },
    icon: { src: '/icons/skills/aws.svg', alt: 'aws tag icon' },
  },
  {
    id: 'gcloud',
    labels: { it: 'Google Cloud', en: 'Google Cloud' },
    icon: { src: '/icons/skills/googlecloud.svg', alt: 'gcloud tag icon' },
  },
  {
    id: 'docker',
    labels: { it: 'Docker', en: 'Docker' },
    icon: { src: '/icons/skills/docker.svg', alt: 'docker tag icon' },
  },
  {
    id: 'openshift',
    labels: { it: 'OpenShift', en: 'OpenShift' },
    icon: { src: '/icons/skills/redhatopenshift.svg', alt: 'openshift tag icon' },
  },
  {
    id: 'gitlab',
    labels: { it: 'GitLab CI/CD', en: 'GitLab CI/CD' },
    icon: { src: '/icons/skills/gitlab.svg', alt: 'gitlab tag icon' },
  },
  {
    id: 'sonarqube',
    labels: { it: 'SonarQube', en: 'SonarQube' },
    icon: { src: '/icons/skills/sonarqubeserver.svg', alt: 'sonarqube tag icon' },
  },
  {
    id: 'java',
    labels: { it: 'Java', en: 'Java' },
    icon: { src: '/icons/skills/java.svg', alt: 'java tag icon' },
  },
  {
    id: 'spring',
    labels: { it: 'Spring', en: 'Spring' },
    icon: { src: '/icons/skills/spring.svg', alt: 'spring tag icon' },
  },
  {
    id: 'angular',
    labels: { it: 'Angular', en: 'Angular' },
    icon: { src: '/icons/skills/angular.svg', alt: 'angular tag icon' },
  },
  {
    id: 'node',
    labels: { it: 'NodeJs', en: 'NodeJs' },
    icon: { src: '/icons/skills/nodedotjs.svg', alt: 'node tag icon' },
  },
  {
    id: 'electron',
    labels: { it: 'ElectronJs', en: 'ElectronJs' },
    icon: { src: '/icons/skills/electron.svg', alt: 'electron tag icon' },
  },
  {
    id: 'couchdb',
    labels: { it: 'CouchDb', en: 'CouchDb' },
    icon: { src: '/icons/skills/apachecouchdb.svg', alt: 'couchdb tag icon' },
  },
  {
    id: 'db2',
    labels: { it: 'DB2', en: 'DB2' },
    icon: { src: '/icons/skills/db2.svg', alt: 'db2 tag icon' },
  },
  {
    id: 'ibm',
    labels: { it: 'IBM Cloud', en: 'IBM Cloud' },
    icon: { src: '/icons/skills/ibm.svg', alt: 'ibm tag icon' },
  },
  {
    id: 'kafka',
    labels: { it: 'Kafka', en: 'Kafka' },
    icon: { src: '/icons/skills/apachekafka.svg', alt: 'kafka tag icon' },
  },
  {
    id: 'elastic',
    labels: { it: 'Elastic', en: 'Elastic' },
    icon: { src: '/icons/skills/elastic.svg', alt: 'elastic tag icon' },
  },
  {
    id: 'devops',
    labels: { it: 'Azure DevOps', en: 'Azure DevOps' },
    icon: { src: '/icons/skills/devops.svg', alt: 'devops tag icon' },
  },
  {
    id: 'splunk',
    labels: { it: 'Splunk', en: 'Splunk' },
    icon: { src: '/icons/skills/splunk.svg', alt: 'splunk tag icon' },
  },
  {
    id: 'android',
    labels: { it: 'Android', en: 'Android' },
    icon: { src: '/icons/skills/android.svg', alt: 'android tag icon' },
  },
  {
    id: 'ios',
    labels: { it: 'iOS', en: 'iOS' },
    icon: { src: '/icons/skills/apple.svg', alt: 'ios tag icon' },
  },
  {
    id: 'python',
    labels: { it: 'Python', en: 'Python' },
    icon: { src: '/icons/skills/python.svg', alt: 'python tag icon' },
  },
  {
    id: 'php',
    labels: { it: 'Php', en: 'Php' },
    icon: { src: '/icons/skills/php.svg', alt: 'php tag icon' },
  },
  {
    id: 'mysql',
    labels: { it: 'MySQL', en: 'MySQL' },
    icon: { src: '/icons/skills/mysql.svg', alt: 'mysql tag icon' },
  },
  {
    id: 'sybase',
    labels: { it: 'Sybase', en: 'Sybase' },
    icon: { src: '/icons/skills/sybase.svg', alt: 'sybase tag icon' },
  },
  {
    id: 'pb',
    labels: { it: 'PowerBuilder', en: 'PowerBuilder' },
    icon: { src: '/icons/skills/powerbuilder.svg', alt: 'pb tag icon' },
  },
  {
    id: 'oracle',
    labels: { it: 'Oracle', en: 'Oracle' },
    icon: { src: '/icons/skills/oracle.svg', alt: 'oracle tag icon' },
  },
  {
    id: 'testautomation',
    labels: { it: 'Test Automation', en: 'Test Automation' },
    icon: { src: '/icons/skills/testautomation.svg', alt: 'testautomation tag icon' },
  },
  {
    id: 'jenkins',
    labels: { it: 'Jenkins', en: 'Jenkins' },
    icon: { src: '/icons/skills/jenkins.svg', alt: 'jenkins tag icon' },
  }
]

export const getCalendarTags = (locale: Locale): CalendarTag[] => {
  return calendarTagRegistry.map((tag) => ({
    id: tag.id,
    label: tag.labels[locale] ?? tag.labels.it,
    icon: tag.icon,
  }))
}

export const getCalendarTagById = (locale: Locale, tagId: string): CalendarTag | null => {
  const tag = calendarTagRegistry.find((entry) => entry.id === tagId)
  if (!tag) return null
  return {
    id: tag.id,
    label: tag.labels[locale] ?? tag.labels.it,
    icon: tag.icon,
  }
}

