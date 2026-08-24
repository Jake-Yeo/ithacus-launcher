import { EmbeddedAppStage } from './components/embedded/EmbeddedAppStage'
import { LauncherBackground } from './components/launcher/LauncherBackground'
import { LauncherDashboard } from './components/launcher/LauncherDashboard'
import { useEmbeddedAppControls } from './hooks/useEmbeddedAppControls'
import { useLauncherController } from './hooks/useLauncherController'

export default function App() {
  const launcher = useLauncherController()
  const embeddedControls = useEmbeddedAppControls(launcher.embeddedAppId)
  return <div className="relative isolate min-h-dvh bg-canvas font-sans text-ink antialiased selection:bg-mist selection:text-sea-deep">
    <LauncherBackground />
    <LauncherDashboard state={launcher.launcherState} busy={launcher.isBusy} message={launcher.message} onReload={launcher.reloadLauncherState} onStart={launcher.startSelectedApp} onStop={launcher.stopApp} />
    <EmbeddedAppStage activeApp={launcher.activeApp} appId={launcher.embeddedAppId} frameRef={embeddedControls.embeddedFrameRef} frameUrl={launcher.embeddedAppUrl} open={launcher.isEmbeddedAppOpen} onLoad={embeddedControls.installControls} />
  </div>
}
