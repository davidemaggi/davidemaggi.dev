import type { OpenSourceProject } from './types'

const conrad: OpenSourceProject = {
  id: 'conrad',
  name: 'Conrad',
  repo: 'davidemaggi/Conrad',
  icon: '/projects/conrad/icon.svg',
  accent: ['#3f6b35', '#14290f'],
  category: { en: 'Homelab & security', it: 'Homelab e sicurezza' },
  tagline: {
    en: 'Your homelab, certified.',
    it: 'Il tuo homelab, certificato.',
  },
  description: {
    en: 'A self-hosted certificate authority with a built-in ACME server. Real HTTPS for every service on your LAN, renewed automatically by certbot, Caddy, Traefik or cert-manager, from one small binary. No more "proceed anyway".',
    it: 'Una certificate authority self-hosted con server ACME integrato. HTTPS vero per ogni servizio della tua LAN, rinnovato in automatico da certbot, Caddy, Traefik o cert-manager, da un unico piccolo binario. Basta "procedi comunque".',
  },
  features: {
    en: [
      'Full ACME (RFC 8555): http-01, dns-01 and tls-alpn-01, EAB, ARI and revocation',
      'One root, as many issuers as you want, each with its own directory and policy',
      'Root rollover with cross-signing, so devices keep trusting your certificates',
      'Web UI with manual issuance, PFX export, audit log and command palette',
      'Expiry alerts by email or signed webhooks; OIDC single sign-on',
      'CA keys encrypted at rest or kept in an HSM via PKCS#11',
    ],
    it: [
      'ACME completo (RFC 8555): http-01, dns-01 e tls-alpn-01, EAB, ARI e revoca',
      'Una root e quanti issuer vuoi, ognuno con la sua directory e le sue regole',
      'Rollover della root con cross-signing, così i dispositivi continuano a fidarsi',
      'UI web con emissione manuale, export PFX, audit log e command palette',
      'Avvisi di scadenza via email o webhook firmati; single sign-on OIDC',
      'Chiavi della CA cifrate a riposo o custodite in un HSM via PKCS#11',
    ],
  },
  stack: ['Go', 'react', 'SQLite', 'docker'],
  platforms: ['docker', 'linux', 'macos', 'windows'],
  license: 'GPL-3.0',
  install: ['docker pull ghcr.io/davidemaggi/conrad:latest'],
}

export default conrad
