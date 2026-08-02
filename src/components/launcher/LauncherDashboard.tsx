import type { LauncherApp, LauncherState } from '../../types'
import { StatusMessage } from '../ui/StatusMessage'
import { AppGrid } from './AppGrid'
import { BrandHeader } from './BrandHeader'
import { HeroSection } from './HeroSection'
import { LauncherBackground } from './LauncherBackground'
import { LauncherFooter } from './LauncherFooter'
import { StopAppButton } from './StopAppButton'

type LauncherDashboardProps = { state: LauncherState; activeApp: LauncherApp | null; busy: boolean; message: string; onStart: (app: LauncherApp) => void; onStop: () => void }

export function LauncherDashboard(props: LauncherDashboardProps) {
  return <main className="relative isolate mx-auto min-h-dvh w-full max-w-6xl overflow-hidden px-page-mobile pb-page-bottom pt-page-top sm:px-page-tablet md:px-12 lg:px-page-desktop">
    <LauncherBackground />
    <BrandHeader />
    <HeroSection activeApp={props.activeApp} busy={props.busy} onStop={props.onStop} />
    <AppGrid apps={props.state.apps} disabled={props.busy} onStart={props.onStart} />
    {props.activeApp && <StopAppButton appName={props.activeApp.name} disabled={props.busy} onStop={props.onStop} className="mt-5 flex w-full sm:hidden" />}
    <LauncherFooter />
    <StatusMessage message={props.message} />
  </main>
}
