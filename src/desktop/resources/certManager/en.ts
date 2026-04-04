import type { CertificateFolder } from './types'

const enCertFolders: CertificateFolder[] = [
  {
    id: 'personal',
    label: 'Personal',
    certificates: [
      {
        id: 'davide-dev-2026',
        commonName: 'davidemaggi.dev',
        issuedBy: 'Lets Encrypt R11',
        issuedByLogo: { src: '/icons/certificate.svg', alt: 'Lets Encrypt logo' },
        validFrom: '2026-01-12',
        validTo: '2026-04-11',
        serialNumber: '07A4F2B931',
        thumbprint: '9A:4C:2D:19:EA:0B:5E:AA:30:1E:91:13:FF:2A:01:8C:45:55:7B:2F',
        description: 'TLS certificate used for personal website and public APIs.',
      },
      {
        id: 'mail-signing-2026',
        commonName: 'Davide Maggi Mail Signing',
        issuedBy: 'GlobalSign PersonalSign 3',
        issuedByLogo: { src: '/icons/certificate.svg', alt: 'GlobalSign logo' },
        validFrom: '2025-09-01',
        validTo: '2027-09-01',
        serialNumber: '8D119B72A0',
        thumbprint: '58:7C:82:19:3F:7A:41:AB:63:22:99:AC:5E:0D:6C:30:66:B8:90:14',
      },
    ],
  },
  {
    id: 'trusted-roots',
    label: 'Trusted Root Certification Authorities',
    certificates: [
      {
        id: 'isrg-root-x1',
        commonName: 'ISRG Root X1',
        issuedBy: 'ISRG Root X1',
        issuedByLogo: { src: '/icons/certificate.svg', alt: 'ISRG logo' },
        validFrom: '2015-06-04',
        validTo: '2035-06-04',
        serialNumber: '8210CFB0D2',
        thumbprint: 'CA:BD:2A:79:A1:07:6A:31:F2:1D:25:36:35:CB:03:9D:43:29:A5:E8',
        description: 'Root CA used in the Lets Encrypt trust chain.',
      },
      {
        id: 'globalsign-root-r3',
        commonName: 'GlobalSign Root R3',
        issuedBy: 'GlobalSign Root R3',
        issuedByLogo: { src: '/icons/certificate.svg', alt: 'GlobalSign logo' },
        validFrom: '2009-03-18',
        validTo: '2029-03-18',
        serialNumber: '040000000001',
        thumbprint: 'CB:B5:22:D7:B7:F1:27:AD:6A:01:13:86:5B:DF:1C:D4:10:2E:7D:07',
      },
    ],
  },
]

export default enCertFolders

