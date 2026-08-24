import { createBackButton } from './createExitButton'
import { embeddedAppObservers } from './embeddedAppObservers'
import { placeBackButton } from './placeExitButton'
import { requestLauncherBack } from './requestLauncherExit'
import { setEmbeddedZoomLock } from './setEmbeddedZoomLock'

export function installEmbeddedAppControls(frame: HTMLIFrameElement, activeAppId: string | null) {
  let embeddedDocument: Document | null
  let embeddedWindow: Window | null
  try { embeddedDocument = frame.contentDocument; embeddedWindow = frame.contentWindow } catch { return }
  if (!embeddedDocument?.body || !embeddedWindow) return
  const framedAppId = new URL(frame.src, embeddedWindow.location.href).searchParams.get('app') || activeAppId
  setEmbeddedZoomLock(embeddedDocument, framedAppId === 'nourish')
  if (!framedAppId) { embeddedDocument.querySelector<HTMLButtonElement>('button[data-ithacus-back]')?.remove(); return }
  const backButton = embeddedDocument.querySelector<HTMLButtonElement>('button[data-ithacus-back]') || createBackButton(embeddedDocument)
  backButton.onclick = () => requestLauncherBack(embeddedWindow)
  placeBackButton(embeddedDocument, embeddedWindow, backButton)
  if (embeddedAppObservers.has(embeddedDocument)) return
  const embeddedAppObserver = new MutationObserver(() => installEmbeddedAppControls(frame, activeAppId))
  embeddedAppObserver.observe(embeddedDocument.body, { childList: true, subtree: true })
  embeddedAppObservers.set(embeddedDocument, embeddedAppObserver)
}
