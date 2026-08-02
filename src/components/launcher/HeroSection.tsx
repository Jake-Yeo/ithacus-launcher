import type { LauncherApp } from '../../types'
import { StopAppButton } from './StopAppButton'

type HeroSectionProps = { activeApp: LauncherApp | null; busy: boolean; onStop: () => void }

export function HeroSection({ activeApp, busy, onStop }: HeroSectionProps) {
  return <section className="pb-8 pt-10 sm:pb-10 sm:pt-14"><div className="flex items-end justify-between gap-5">
    <div><p className="mb-2 text-micro font-extrabold uppercase tracking-label text-sea">Your applications</p><h1 className="max-w-xl text-3xl font-extrabold tracking-title text-ink sm:text-4xl md:text-5xl">Where would you like to go?</h1><p className="mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base">Choose an app and it will open here, on your private Mac.</p></div>
    {activeApp && <StopAppButton appName={activeApp.name} disabled={busy} onStop={onStop} className="hidden sm:flex" />}
  </div></section>
}
