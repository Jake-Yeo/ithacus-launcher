import type { LauncherApp } from '../../types'
import { Button } from '../ui/Button'
import { AppTileContent } from './AppTileContent'

type AppTileProps = { app: LauncherApp; disabled: boolean; onStart: (app: LauncherApp) => void }

export function AppTile({ app, disabled, onStart }: AppTileProps) {
  if (app.kind === 'link') return <a className="group block min-w-0 rounded-3xl p-1 text-center outline-none focus-visible:ring-3 focus-visible:ring-turquoise/35" href={app.url}><AppTileContent app={app} /></a>
  return <Button variant="tile" fullWidth disabled={disabled} onClick={() => onStart(app)}><span className="min-w-0"><AppTileContent app={app} /></span></Button>
}
