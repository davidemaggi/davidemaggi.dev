import type { AppIcon } from './types'

export type AppIconChoice = {
  id: string
  labelKey: string
  icon: AppIcon
}

export const APP_ICON_CHOICES: readonly AppIconChoice[] = [
  {
    id: 'terminal',
    labelKey: 'settings.icons.choice.terminal',
    icon: {
      kind: 'image',
      src: '/icons/terminal.svg',
      alt: 'Terminal icon',
    },
  },
  {
    id: 'folder',
    labelKey: 'settings.icons.choice.folder',
    icon: {
      kind: 'image',
      src: '/icons/folder.svg',
      alt: 'Folder icon',
    },
  },
  {
    id: 'gear',
    labelKey: 'settings.icons.choice.gear',
    icon: {
      kind: 'image',
      src: '/icons/gear.svg',
      alt: 'Gear icon',
    },
  },
  {
    id: 'spark',
    labelKey: 'settings.icons.choice.spark',
    icon: {
      kind: 'image',
      src: '/icons/spark.svg',
      alt: 'Spark icon',
    },
  },
]

export const APP_ICON_CHOICES_BY_ID: Record<string, AppIconChoice> =
  APP_ICON_CHOICES.reduce((result, choice) => {
    result[choice.id] = choice
    return result
  }, {} as Record<string, AppIconChoice>)

