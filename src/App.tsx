import { EmbeddedAppStage } from './components/embedded/EmbeddedAppStage'
import { LauncherDashboard } from './components/launcher/LauncherDashboard'
import { useEmbeddedAppControls } from './hooks/useEmbeddedAppControls'
import { useLauncherController } from './hooks/useLauncherController'

export default function App() {
  const launcher = useLauncherController()
  const embeddedControls = useEmbeddedAppControls(launcher.embeddedAppId, launcher.stopCurrentApp)
  return <div className="min-h-dvh bg-canvas font-sans text-ink antialiased selection:bg-mist selection:text-sea-deep">
    <LauncherDashboard state={launcher.launcherState} activeApp={launcher.activeApp} busy={launcher.isBusy} message={launcher.message} onStart={launcher.startSelectedApp} onStop={launcher.stopCurrentApp} />
    <EmbeddedAppStage activeApp={launcher.activeApp} appId={launcher.embeddedAppId} frameRef={embeddedControls.embeddedFrameRef} frameUrl={launcher.embeddedAppUrl} open={launcher.isEmbeddedAppOpen} onLoad={embeddedControls.installControls} />
  </div>
}
