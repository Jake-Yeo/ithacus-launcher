export function findVisibleBottomNavigation(document: Document, window: Window) {
  return [...document.querySelectorAll<HTMLElement>('nav.bottom-nav, nav[data-bottom-nav], nav[aria-label*="bottom" i]')]
    .find(navigation => window.getComputedStyle(navigation).display !== 'none' && navigation.getClientRects().length > 0)
}
