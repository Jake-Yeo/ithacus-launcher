import type { LauncherApp, LauncherState } from '../../types'
import { StatusMessage } from '../ui/StatusMessage'
import { AppGrid } from './AppGrid'
import { BrandHeader } from './BrandHeader'
import { HeroSection } from './HeroSection'
import { LauncherFooter } from './LauncherFooter'
import { RunningAppsList } from './RunningAppsList'

type LauncherDashboardProps = { state: LauncherState; busy: boolean; message: string; onReload: () => void; onStart: (app: LauncherApp) => void; onStop: (appId: string) => void }

export function LauncherDashboard(props: LauncherDashboardProps) {
  return <main className="relative mx-auto min-h-dvh w-full max-w-6xl px-page-mobile pb-page-bottom pt-page-top sm:px-page-tablet md:px-12 lg:px-page-desktop">
    <BrandHeader busy={props.busy} onReload={props.onReload} />
    <HeroSection />
    <AppGrid apps={props.state.apps} disabled={props.busy} onStart={props.onStart} />
    <RunningAppsList apps={props.state.apps.filter(app => props.state.runningAppIds.includes(app.id))} disabled={props.busy} onOpen={props.onStart} onStop={props.onStop} />
    <LauncherFooter />
    <StatusMessage message={props.message} />
  </main>
}
