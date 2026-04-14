import { resolveAssetPath } from '../desktop/utils/assetPath'

export function ArkanoidApp() {
  return (
    <div className="h-full w-full overflow-hidden bg-(--app-surface-1)">
      <object
        type="image/svg+xml"
        data={resolveAssetPath('/images/arkanoid.svg')}
        aria-label="GtiOut animation"
        className="block h-full w-full"
      />
    </div>
  )
}
