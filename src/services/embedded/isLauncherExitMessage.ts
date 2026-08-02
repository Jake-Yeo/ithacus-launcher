export function isLauncherExitMessage(event: MessageEvent, embeddedFrame: HTMLIFrameElement | null) {
  return event.origin === window.location.origin
    && event.source === embeddedFrame?.contentWindow
    && event.data?.type === 'ithacus:exit'
}
