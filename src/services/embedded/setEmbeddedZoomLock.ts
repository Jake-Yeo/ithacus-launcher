export function setEmbeddedZoomLock(document: Document, locked: boolean) {
  document.documentElement.dataset.ithacusZoomLocked = String(locked)
  let viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
  if (!viewport) { viewport = document.createElement('meta'); viewport.name = 'viewport'; document.head?.append(viewport) }
  viewport.content = locked ? 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' : 'width=device-width, initial-scale=1, viewport-fit=cover'
  if (document.documentElement.dataset.ithacusZoomHandlers === 'true') return
  document.documentElement.dataset.ithacusZoomHandlers = 'true'
  const preventLockedZoom = (event: Event) => { if (document.documentElement.dataset.ithacusZoomLocked === 'true') event.preventDefault() }
  document.addEventListener('gesturestart', preventLockedZoom, { passive: false })
  document.addEventListener('gesturechange', preventLockedZoom, { passive: false })
  document.addEventListener('gestureend', preventLockedZoom, { passive: false })
  document.addEventListener('dblclick', preventLockedZoom, { passive: false })
  document.addEventListener('touchmove', event => {
    const touchEvent = event as TouchEvent & { scale?: number }
    if (document.documentElement.dataset.ithacusZoomLocked === 'true' && typeof touchEvent.scale === 'number' && touchEvent.scale !== 1) event.preventDefault()
  }, { passive: false })
}
