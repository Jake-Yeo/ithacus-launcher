const observers = new WeakMap<Document, MutationObserver>()

function setZoomLock(document: Document, locked: boolean) {
  document.documentElement.dataset.ithacusZoomLocked = String(locked)
  let viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]')
  if (!viewport) {
    viewport = document.createElement('meta')
    viewport.name = 'viewport'
    document.head?.append(viewport)
  }
  viewport.content = locked
    ? 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
    : 'width=device-width, initial-scale=1, viewport-fit=cover'

  if (document.documentElement.dataset.ithacusZoomHandlers === 'true') return
  document.documentElement.dataset.ithacusZoomHandlers = 'true'
  const preventZoom = (event: Event) => {
    if (document.documentElement.dataset.ithacusZoomLocked === 'true') event.preventDefault()
  }
  document.addEventListener('gesturestart', preventZoom, { passive: false })
  document.addEventListener('gesturechange', preventZoom, { passive: false })
  document.addEventListener('gestureend', preventZoom, { passive: false })
  document.addEventListener('dblclick', preventZoom, { passive: false })
  document.addEventListener('touchmove', (event) => {
    const touchEvent = event as TouchEvent & { scale?: number }
    if (document.documentElement.dataset.ithacusZoomLocked === 'true' && typeof touchEvent.scale === 'number' && touchEvent.scale !== 1) event.preventDefault()
  }, { passive: false })
}

function visibleBottomNavigation(document: Document, window: Window) {
  return [...document.querySelectorAll<HTMLElement>('nav.bottom-nav, nav[data-bottom-nav], nav[aria-label*="bottom" i]')]
    .find(nav => window.getComputedStyle(nav).display !== 'none' && nav.getClientRects().length > 0)
}

function styleTabButton(button: HTMLButtonElement) {
  button.style.cssText = [
    'min-width:0', 'min-height:44px', 'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
    'gap:4px', 'border:0', 'background:transparent', 'color:#a34f54', 'font:inherit', 'cursor:pointer', '-webkit-tap-highlight-color:transparent',
  ].join(';')
  button.querySelector('svg')?.setAttribute('style', 'width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round')
  button.querySelector('span')?.setAttribute('style', 'font-size:10px;font-weight:750')
}

function styleFloatingButton(button: HTMLButtonElement, desktop: boolean) {
  button.style.cssText = [
    'position:fixed', 'z-index:2147483646', 'right:18px', desktop ? 'top:18px' : 'bottom:calc(16px + env(safe-area-inset-bottom))',
    'display:flex', 'align-items:center', 'gap:7px', 'min-height:44px', 'padding:10px 14px', 'border:1px solid #e2c9cb',
    'border-radius:999px', 'background:#fff', 'color:#a34f54', 'box-shadow:0 8px 28px rgba(35,25,28,.18)',
    'font:800 12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', 'cursor:pointer', '-webkit-tap-highlight-color:transparent',
  ].join(';')
  button.querySelector('svg')?.setAttribute('style', 'width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round')
  button.querySelector('span')?.setAttribute('style', 'font-size:12px;font-weight:800')
}

export function installEmbeddedAppControls(frame: HTMLIFrameElement, activeAppId: string | null, onExit: () => void) {
  let document: Document | null
  let window: Window | null
  try {
    document = frame.contentDocument
    window = frame.contentWindow
  } catch {
    return
  }
  if (!document?.body || !window) return

  const framedAppId = new URL(frame.src, window.location.href).searchParams.get('app') || activeAppId
  setZoomLock(document, framedAppId === 'nourish')
  if (!framedAppId) {
    document.querySelector<HTMLButtonElement>('button[data-ithacus-exit]')?.remove()
    return
  }
  const bottomNav = visibleBottomNavigation(document, window)
  let button = document.querySelector<HTMLButtonElement>('button[data-ithacus-exit]')
  if (!button) {
    button = document.createElement('button')
    button.type = 'button'
    button.dataset.ithacusExit = 'true'
    button.setAttribute('aria-label', 'Exit to Isle of Ithaca launcher')
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></svg><span>Exit</span>'
  }
  button.onclick = onExit

  if (bottomNav) {
    const previousParent = button.parentElement
    if (previousParent && previousParent !== bottomNav && previousParent !== document.body) previousParent.style.removeProperty('grid-template-columns')
    if (!bottomNav.contains(button)) bottomNav.append(button)
    bottomNav.style.setProperty('grid-template-columns', `repeat(${bottomNav.children.length}, minmax(0, 1fr))`, 'important')
    styleTabButton(button)
  } else {
    const previousParent = button.parentElement
    if (previousParent && previousParent !== document.body) previousParent.style.removeProperty('grid-template-columns')
    if (button.parentElement !== document.body) document.body.append(button)
    styleFloatingButton(button, window.innerWidth >= 800)
  }

  if (!observers.has(document)) {
    const observer = new MutationObserver(() => installEmbeddedAppControls(frame, activeAppId, onExit))
    observer.observe(document.body, { childList: true, subtree: true })
    observers.set(document, observer)
  }
}
