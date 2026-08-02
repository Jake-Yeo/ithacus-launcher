export function requestLauncherExit(embeddedWindow: Window) {
  embeddedWindow.parent.postMessage({ type: 'ithacus:exit' }, embeddedWindow.location.origin)
}
