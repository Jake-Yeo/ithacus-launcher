import type { LauncherApp } from '../../types'
import { AppTileIcon } from './AppTileIcon'

export function AppTileContent({ app }: { app: LauncherApp }) {
  return <><AppTileIcon app={app} /><span className="mt-3 block truncate text-xs font-semibold tracking-tight text-ink sm:text-sm">{app.name}</span><span className="sr-only">{app.description}</span></>
}
