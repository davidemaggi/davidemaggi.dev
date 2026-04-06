import type { DesktopAppProps } from '../desktop/types'

export function HelpApp({ i18nApi }: DesktopAppProps) {
  const locale = i18nApi?.locale ?? 'it'

  const lines = locale === 'en'
    ? [
        'DavideMaggi.dev Help System v. 1.1.4',
        '',
        'TOPIC',
        '    How to navigate this website',
        '',
        'DESCRIPTION',
        "    This is my Personal WebPage, it's not a regular website, so it's fine to look for help",
        '',
        'AVAILABLE COMMANDS',
        "    Type ' i | im | whoami | about | info ' to show an about me page.",
        "    Type ' e | cv | exp | experience | job | work | calendar ' to see my work experiences.",
        "    Type ' c | s | skill | skills | cert | certs | certifications | certmanager ' to discover my Skills & Interests.",
        "    Type ' dev | credits ' to discover how this website has been made.",
        "    Type ' tr | translate <it | en> | lang ' to translate the website in the desired language.",
        "    Type ' clear | cls ' to clear the console.",
        "    Type ' h | help ' to reopen this help view.",
        '----------------------------------------------------------------------------------------------------',
      ]
    : [
        'DavideMaggi.dev Help System v. 1.1.4',
        '',
        'TOPIC',
        '    Come navigare questo sito',
        '',
        'DESCRIPTION',
        '    Questa e una pagina personale, non un sito classico, quindi e normale usare help',
        '',
        'AVAILABLE COMMANDS',
        "    Digita ' i | im | whoami | about | info ' per mostrare una pagina about me.",
        "    Digita ' e | cv | exp | experience | job | work | calendar ' per vedere le esperienze lavorative.",
        "    Digita ' c | s | skill | skills | cert | certs | certifications | certmanager ' per scoprire Skills & Interests.",
        "    Digita ' dev | credits ' per scoprire come e stato realizzato questo sito.",
        "    Digita ' tr | translate <it | en> | lang ' per cambiare lingua.",
        "    Digita ' clear | cls ' per pulire la console.",
        "    Digita ' h | help ' per riaprire questa vista help.",
        '----------------------------------------------------------------------------------------------------',
      ]

  return (
    <div className="h-full overflow-auto bg-(--app-surface-1) p-4 text-(--window-text)">
      <pre className="whitespace-pre-wrap font-mono text-sm leading-6">{lines.join('\n')}</pre>
    </div>
  )
}

