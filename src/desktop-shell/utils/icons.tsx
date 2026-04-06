import type { AppIcon, AppId, DesktopPreferences } from '../../desktop/types'
import { APP_ICON_CHOICES_BY_ID } from '../../desktop/appIcons'
import { DESKTOP_PLUGINS } from '../../desktop/plugins'
import { resolveAssetPath } from '../../desktop/utils/assetPath'

export const renderAppIcon = (icon: AppIcon, className: string) => {
  if (icon.kind === 'image') {
    return <img className={className} src={resolveAssetPath(icon.src)} alt={icon.alt} />
  }

  return <span className={className}>{icon.value}</span>
}

export const resolveAppIcon = (id: AppId, preferences: DesktopPreferences): AppIcon => {
  const selectedIconId = preferences.appIcons[id]
  if (selectedIconId && APP_ICON_CHOICES_BY_ID[selectedIconId]) {
    return APP_ICON_CHOICES_BY_ID[selectedIconId].icon
  }

  return DESKTOP_PLUGINS[id].icon
}

