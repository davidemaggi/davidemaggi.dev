import type { OpenSourceProject } from './types'

const hodor: OpenSourceProject = {
  id: 'hodor',
  name: 'Hodor',
  repo: 'davidemaggi/Hodor',
  icon: '/projects/hodor/icon.svg',
  accent: ['#3b82f6', '#1e1b4b'],
  featured: true,
  category: { en: 'Developer tools', it: 'Strumenti per sviluppatori' },
  tagline: {
    en: 'Holds the door to your Kubernetes clusters.',
    it: 'Tiene la porta dei tuoi cluster Kubernetes.',
  },
  description: {
    en: 'Port-forwards you can save, share and run on any cluster, without seven terminal tabs of kubectl port-forward. A desktop app for macOS, Windows and Linux plus the interactive hodor CLI.',
    it: 'Port-forward da salvare, condividere e lanciare su qualsiasi cluster, senza sette tab di kubectl port-forward aperte. App desktop per macOS, Windows e Linux più la CLI interattiva hodor.',
  },
  features: {
    en: [
      'Templates: bundle the forwards you always need and run them with one command',
      'Cluster-agnostic: the same template works on dev, staging and prod',
      'Reads every kubeconfig in ~/.kube and shows which clusters are up',
      'Linked secrets and config maps, masked until you ask',
      'Tray mode: close the window, forwards keep running',
      'Merge and export kubeconfigs with a preview first',
    ],
    it: [
      'Template: raggruppa i forward che usi sempre e lanciali con un comando',
      'Indipendente dal cluster: lo stesso template funziona su dev, staging e prod',
      'Legge ogni kubeconfig in ~/.kube e mostra quali cluster sono attivi',
      'Secret e config map collegati, mascherati finché non li chiedi',
      'Modalità tray: chiudi la finestra, i forward restano attivi',
      'Unisci ed esporta kubeconfig con anteprima',
    ],
  },
  stack: ['kubernetes', 'electron', 'react', 'TypeScript'],
  platforms: ['macos', 'windows', 'linux'],
  license: 'Apache-2.0',
  install: ['winget install DavideMaggi.Hodor', 'choco install hodor'],
}

export default hodor
