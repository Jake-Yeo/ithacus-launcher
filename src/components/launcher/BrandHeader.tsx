import { OnlineStatus } from './OnlineStatus'

export function BrandHeader() {
  return <header className="flex items-center justify-between gap-4 border-b border-border/80 pb-5 sm:pb-7">
    <div className="flex min-w-0 items-center gap-3.5">
      <img className="size-12 shrink-0 rounded-app shadow-brand sm:size-14" src="/__ithacus/assets/icon-192.png" alt="" />
      <div className="min-w-0"><p className="truncate text-eyebrow font-extrabold uppercase tracking-eyebrow text-sea sm:text-xs">Private workspace</p><p className="truncate text-lg font-bold tracking-brand text-ink sm:text-xl">Isle of Ithaca</p></div>
    </div>
    <OnlineStatus />
  </header>
}
