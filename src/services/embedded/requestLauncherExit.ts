export function requestLauncherExit(embeddedWindow: Window) {
  void embeddedWindow.fetch('/__ithacus/api/stop', { method: 'POST', keepalive: true })
  embeddedWindow.parent.location.replace('/__ithacus/')
}
