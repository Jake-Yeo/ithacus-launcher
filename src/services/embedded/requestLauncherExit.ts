export function requestLauncherBack(embeddedWindow: Window) {
  embeddedWindow.parent.location.replace('/__ithacus/')
}
