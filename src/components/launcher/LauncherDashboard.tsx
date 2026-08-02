import type { LauncherApp, LauncherState } from '../../types'
import { StatusMessage } from '../ui/StatusMessage'
import { AppGrid } from './AppGrid'
import { BrandHeader } from './BrandHeader'
import { HeroSection } from './HeroSection'
import { LauncherFooter } from './LauncherFooter'

type LauncherDashboardProps = { state: LauncherState; busy: boolean; message: string; onStart: (app: LauncherApp) => void }

export function LauncherDashboard(props: LauncherDashboardProps) {
  return <main className="relative mx-auto min-h-dvh w-full max-w-6xl px-page-mobile pb-page-bottom pt-page-top sm:px-page-tablet md:px-12 lg:px-page-desktop">
    <BrandHeader />
    <HeroSection />
    <AppGrid apps={props.state.apps} disabled={props.busy} onStart={props.onStart} />
    <LauncherFooter />
    <StatusMessage message={props.message} />
  </main>
}
