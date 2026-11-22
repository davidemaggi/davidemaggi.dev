import type { OpenSourceProject } from './types'

const spellbook: OpenSourceProject = {
  id: 'spellbook',
  name: 'spellbook',
  repo: 'davidemaggi/spellbook',
  icon: '/projects/spellbook/icon.svg',
  accent: ['#7e22ce', '#1e1b4b'],
  category: { en: 'AI agents', it: 'Agenti AI' },
  tagline: {
    en: 'Teach your AI agent new tricks. One command, any agent.',
    it: 'Insegna nuovi trucchi al tuo agente AI. Un comando, qualsiasi agente.',
  },
  description: {
    en: 'A book of ready-to-use skills for AI coding agents, written in the open Agent Skills format. Install a spell once and it works in Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot, OpenCode and every other agent that speaks the format.',
    it: 'Un libro di skill pronte all’uso per gli agenti AI di coding, scritte nel formato aperto Agent Skills. Installi un incantesimo una volta e funziona in Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot, OpenCode e in ogni altro agente che parla il formato.',
  },
  features: {
    en: [
      'Agent-agnostic: plain Agent Skills, switch agents and keep your spells',
      'Install only what you need: one spell, a handful or the whole book',
      'Local-first: heavy lifting like transcription never hits a cloud API',
      'Spells bring their own scripts and set up their environment on first use',
      'First spell: transcribe, local audio/video transcription with faster-whisper',
    ],
    it: [
      'Indipendente dall’agente: Agent Skills standard, cambi agente e tieni gli incantesimi',
      'Installi solo quello che ti serve: un incantesimo, qualcuno o tutto il libro',
      'Local-first: i lavori pesanti come la trascrizione non passano da API cloud',
      'Gli incantesimi portano i loro script e si preparano l’ambiente al primo uso',
      'Primo incantesimo: transcribe, trascrizione locale di audio e video con faster-whisper',
    ],
  },
  stack: ['python', 'Agent Skills'],
  platforms: ['macos', 'windows', 'linux'],
  license: 'MIT',
  install: ['npx skills add davidemaggi/spellbook', 'claude plugin marketplace add davidemaggi/spellbook'],
  downloadUrl: 'https://github.com/davidemaggi/spellbook#-installation',
}

export default spellbook
