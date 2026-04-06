export type CertificateItem = {
  id: string
  commonName: string
  issuedBy: string
  issuedByLogo?: {
    src: string
    alt: string
  }
  validFrom: string
  validTo?: string
  serialNumber?: string
  thumbprint?: string
  description?: string
}

export type CertificateFolder = {
  id: string
  label: string
  certificates: CertificateItem[]
}

