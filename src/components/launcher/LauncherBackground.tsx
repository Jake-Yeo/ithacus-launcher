export function LauncherBackground() {
  return <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
    <div className="absolute -right-32 -top-40 size-background-large rounded-full bg-mist/50 blur-3xl" />
    <div className="absolute -bottom-48 -left-36 size-background-medium rounded-full bg-sand/55 blur-3xl" />
  </div>
}
