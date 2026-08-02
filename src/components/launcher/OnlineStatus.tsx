export function OnlineStatus() {
  return <div className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 text-xs font-semibold text-muted shadow-sm backdrop-blur-sm sm:px-4">
    <span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-35 motion-reduce:hidden" /><span className="relative inline-flex size-2.5 rounded-full bg-success" /></span>
    <span className="hidden sm:inline">Mac online</span><span className="sm:hidden">Online</span>
  </div>
}
