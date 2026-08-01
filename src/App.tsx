import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getLauncherState, startManagedApp, stopManagedApp } from './api'
import { ArrowIcon, CallumployedIcon, DefaultAppIcon, ExperienceIcon, NourishIcon, PortfolioIcon, StopIcon } from './AppIcons'
import { installEmbeddedAppControls } from './embeddedApp'
import type { LauncherApp, LauncherState } from './types'

const initialState: LauncherState = { activeAppId: null, apps: [] }

const appVisuals: Record<string, { gradient: string; icon: typeof PortfolioIcon }> = {
  portfolio: { gradient: 'from-[#22A77D] to-[#096149]', icon: PortfolioIcon },
  experience: { gradient: 'from-[#EF8B63] to-[#AD3F26]', icon: ExperienceIcon },
  callumployed: { gradient: 'from-[#648BDC] to-[#294D9B]', icon: CallumployedIcon },
  nourish: { gradient: 'from-[#65B984] to-[#237044]', icon: NourishIcon },
}

function AppTile({ app, disabled, onStart }: { app: LauncherApp; disabled: boolean; onStart: (app: LauncherApp) => void }) {
  const visual = appVisuals[app.id] || { gradient: 'from-[#1597A8] to-[#06384F]', icon: DefaultAppIcon }
  const Icon = visual.icon
  const running = app.state !== 'stopped'
  const content = <>
    <span className={`relative mx-auto grid aspect-square w-full max-w-36 place-items-center overflow-hidden rounded-[27%] bg-gradient-to-br ${visual.gradient} text-white shadow-[0_18px_36px_rgba(23,37,33,0.16),inset_0_0_0_1px_rgba(255,255,255,0.22)] transition-[translate,scale,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_22px_42px_rgba(23,37,33,0.2),inset_0_0_0_1px_rgba(255,255,255,0.24)] group-active:scale-[0.96] motion-reduce:transition-none`}>
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/14 to-transparent" />
      <Icon className="relative size-[58%]" />
      {running && <span className="absolute right-2.5 top-2.5 size-3 rounded-full border-2 border-white/90 bg-[#D8F46C] shadow-sm" aria-label={`${app.state}`} />}
    </span>
    <span className="mt-3 block truncate text-xs font-semibold tracking-[-0.015em] text-[#172521] sm:text-sm">{app.name}</span>
    <span className="sr-only">{app.description}</span>
  </>

  if (app.kind === 'link') return <a className="group block min-w-0 rounded-3xl p-1 text-center outline-none focus-visible:ring-3 focus-visible:ring-[#1597A8]/35" href={app.url}>{content}</a>
  return <button type="button" className="group min-w-0 rounded-3xl p-1 text-center outline-none focus-visible:ring-3 focus-visible:ring-[#1597A8]/35 disabled:cursor-wait disabled:opacity-55" disabled={disabled} onClick={() => onStart(app)}>{content}</button>
}

function App() {
  const [state, setState] = useState<LauncherState>(initialState)
  const [busy, setBusy] = useState(false)
  const [stageOpen, setStageOpen] = useState(false)
  const [frameUrl, setFrameUrl] = useState('about:blank')
  const [frameAppId, setFrameAppId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const frameRef = useRef<HTMLIFrameElement>(null)
  const busyRef = useRef(false)
  const activeApp = useMemo(() => state.apps.find(app => app.id === state.activeAppId) || null, [state])

  useEffect(() => {
    getLauncherState().then(setState).catch(error => setMessage(error instanceof Error ? error.message : 'Could not reach the launcher service.'))
  }, [])

  const stop = useCallback(async () => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setMessage('Returning to the island…')
    setFrameAppId(null)
    setFrameUrl('about:blank')
    setStageOpen(false)
    try {
      setState(await stopManagedApp())
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not stop the current app.')
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }, [])

  const start = async (app: LauncherApp) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setMessage(`Opening ${app.name}…`)
    try {
      const nextState = await startManagedApp(app.id)
      setState(nextState)
      setFrameAppId(app.id)
      setFrameUrl(`/?app=${encodeURIComponent(app.id)}&t=${Date.now()}`)
      setStageOpen(true)
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Could not open ${app.name}.`)
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  const installControls = useCallback(() => {
    if (frameRef.current) installEmbeddedAppControls(frameRef.current, frameRef.current.dataset.ithacusAppId || null, stop)
  }, [stop])

  useEffect(() => {
    window.addEventListener('resize', installControls)
    return () => window.removeEventListener('resize', installControls)
  }, [installControls])

  return <div className="min-h-[100dvh] bg-[#F3F7F5] font-sans text-[#172521] antialiased selection:bg-[#DDF4F2] selection:text-[#06384F]">
    <main className="relative isolate mx-auto min-h-[100dvh] w-full max-w-6xl overflow-hidden px-5 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))] sm:px-8 md:px-12 lg:px-16">
      <div className="pointer-events-none absolute -right-32 -top-40 -z-10 size-[34rem] rounded-full bg-[#9BE1D9]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-36 -z-10 size-[32rem] rounded-full bg-[#FFF4CE]/55 blur-3xl" />

      <header className="flex items-center justify-between gap-4 border-b border-[#DDE7E2]/80 pb-5 sm:pb-7">
        <div className="flex min-w-0 items-center gap-3.5">
          <img className="size-12 shrink-0 rounded-[26%] shadow-[0_8px_20px_rgba(6,56,79,0.16)] sm:size-14" src="/__ithacus/assets/icon-192.png" alt="" />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#075F78] sm:text-xs">Private workspace</p>
            <p className="truncate text-lg font-bold tracking-[-0.035em] text-[#172521] sm:text-xl">Isle of Ithaca</p>
          </div>
        </div>
        <div className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#DDE7E2] bg-white/80 px-3.5 text-xs font-semibold text-[#526660] shadow-sm backdrop-blur-sm sm:px-4">
          <span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1F9D72] opacity-35 motion-reduce:hidden" /><span className="relative inline-flex size-2.5 rounded-full bg-[#1F9D72]" /></span>
          <span className="hidden sm:inline">Mac online</span><span className="sm:hidden">Online</span>
        </div>
      </header>

      <section className="pb-8 pt-10 sm:pb-10 sm:pt-14">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#075F78]">Your applications</p>
            <h1 className="max-w-xl text-3xl font-extrabold tracking-[-0.055em] text-[#172521] sm:text-4xl md:text-5xl">Where would you like to go?</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#687A74] sm:text-base">Choose an app and it will open here, on your private Mac.</p>
          </div>
          {activeApp && <button type="button" disabled={busy} onClick={stop} className="hidden min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#E8D2D1] bg-white px-4 text-xs font-bold text-[#C45B59] shadow-sm transition hover:border-[#C45B59]/35 hover:bg-[#FFF7F6] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C45B59]/25 disabled:opacity-50 sm:flex"><StopIcon className="size-4" />Stop {activeApp.name}</button>}
        </div>
      </section>

      <section aria-label="Applications" className="rounded-[2rem] border border-white/80 bg-white/60 p-5 shadow-[0_24px_70px_rgba(30,65,53,0.08)] backdrop-blur-xl sm:p-8 md:p-10">
        {state.apps.length ? <div className="grid grid-cols-3 gap-x-5 gap-y-7 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-10 md:gap-x-12">
          {state.apps.map(app => <AppTile key={app.id} app={app} disabled={busy} onStart={start} />)}
        </div> : <div className="grid min-h-40 place-items-center"><div className="size-8 animate-spin rounded-full border-3 border-[#DDE7E2] border-t-[#1597A8] motion-reduce:animate-none" aria-label="Loading applications" /></div>}
      </section>

      {activeApp && <button type="button" disabled={busy} onClick={stop} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#E8D2D1] bg-white text-sm font-bold text-[#C45B59] shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C45B59]/25 disabled:opacity-50 sm:hidden"><StopIcon className="size-4" />Stop {activeApp.name}</button>}

      <footer className="mt-8 flex items-center justify-between gap-4 text-[11px] font-medium text-[#7D8D87]">
        <span>Tailnet only</span><span className="flex items-center gap-1.5">Private by design <ArrowIcon className="size-3.5" /></span>
      </footer>
      <p className={`mt-4 min-h-5 text-sm font-semibold ${message.toLowerCase().includes('could not') ? 'text-[#C45B59]' : 'text-[#075F78]'}`} role="status" aria-live="polite">{message}</p>
    </main>

    <section className={`fixed inset-0 z-50 bg-white ${stageOpen ? 'block' : 'hidden'}`} aria-hidden={!stageOpen}>
      <iframe ref={frameRef} className="size-full border-0 bg-white" src={frameUrl} data-ithacus-app-id={frameAppId || undefined} title={activeApp ? activeApp.name : 'Selected Isle of Ithaca application'} onLoad={installControls} />
    </section>
  </div>
}

export default App
