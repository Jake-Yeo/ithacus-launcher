export function createBackButton(document: Document) {
  const backButton = document.createElement('button')
  backButton.type = 'button'
  backButton.dataset.ithacusBack = 'true'
  backButton.setAttribute('aria-label', 'Back to Isle of Ithaca launcher')
  backButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6M9 12h12" /></svg><span>Back</span>'
  return backButton
}
