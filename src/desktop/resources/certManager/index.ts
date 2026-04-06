import type { Locale } from '../../types'
import enCertFolders from './en'
import itCertFolders from './it'
import type { CertificateFolder } from './types'

const certFoldersByLocale: Record<Locale, CertificateFolder[]> = {
  it: itCertFolders,
  en: enCertFolders,
}

export const getCertificateFolders = (locale: Locale): CertificateFolder[] => {
  return certFoldersByLocale[locale] ?? certFoldersByLocale.it
}

