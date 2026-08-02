import { createExitButton } from './createExitButton'
import { embeddedAppObservers } from './embeddedAppObservers'
import { placeExitButton } from './placeExitButton'
import { setEmbeddedZoomLock } from './setEmbeddedZoomLock'

export function installEmbeddedAppControls(frame: HTMLIFrameElement, activeAppId: string | null, onExit: () => void) {
  let embeddedDocument: Document | null
  let embeddedWindow: Window | null
  try { embeddedDocument = frame.contentDocument; embeddedWindow = frame.contentWindow } catch { return }
  if (!embeddedDocument?.body || !embeddedWindow) return
  const framedAppId = new URL(frame.src, embeddedWindow.location.href).searchParams.get('app') || activeAppId
  setEmbeddedZoomLock(embeddedDocument, framedAppId === 'nourish')
  if (!framedAppId) { embeddedDocument.querySelector<HTMLButtonElement>('button[data-ithacus-exit]')?.remove(); return }
  const exitButton = embeddedDocument.querySelector<HTMLButtonElement>('button[data-ithacus-exit]') || createExitButton(embeddedDocument)
  exitButton.onclick = onExit
  placeExitButton(embeddedDocument, embeddedWindow, exitButton)
  if (embeddedAppObservers.has(embeddedDocument)) return
  const embeddedAppObserver = new MutationObserver(() => installEmbeddedAppControls(frame, activeAppId, onExit))
  embeddedAppObserver.observe(embeddedDocument.body, { childList: true, subtree: true })
  embeddedAppObservers.set(embeddedDocument, embeddedAppObserver)
}
