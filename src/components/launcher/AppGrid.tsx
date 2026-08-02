import type { LauncherApp } from '../../types'
import { AppTile } from './AppTile'
import { LoadingApps } from './LoadingApps'

type AppGridProps = { apps: LauncherApp[]; disabled: boolean; onStart: (app: LauncherApp) => void }

export function AppGrid({ apps, disabled, onStart }: AppGridProps) {
  return <section aria-label="Applications" className="rounded-panel border border-surface/80 bg-surface/60 p-5 shadow-panel backdrop-blur-xl sm:p-8 md:p-10">
    {apps.length ? <div className="grid grid-cols-3 gap-x-5 gap-y-7 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-10 md:gap-x-12">{apps.map(app => <AppTile key={app.id} app={app} disabled={disabled} onStart={onStart} />)}</div> : <LoadingApps />}
  </section>
}
