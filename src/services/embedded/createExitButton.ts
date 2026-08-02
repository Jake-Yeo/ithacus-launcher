export function createExitButton(document: Document) {
  const exitButton = document.createElement('button')
  exitButton.type = 'button'
  exitButton.dataset.ithacusExit = 'true'
  exitButton.setAttribute('aria-label', 'Exit to Isle of Ithaca launcher')
  exitButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></svg><span>Exit</span>'
  return exitButton
}
