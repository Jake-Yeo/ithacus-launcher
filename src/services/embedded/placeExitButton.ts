import { findVisibleBottomNavigation } from './findVisibleBottomNavigation'
import { styleBackTabButton } from './styleExitTabButton'
import { styleFloatingBackButton } from './styleFloatingExitButton'

export function placeBackButton(document: Document, window: Window, backButton: HTMLButtonElement) {
  const bottomNavigation = findVisibleBottomNavigation(document, window)
  if (bottomNavigation) {
    const previousParent = backButton.parentElement
    if (previousParent && previousParent !== bottomNavigation && previousParent !== document.body) previousParent.style.removeProperty('grid-template-columns')
    if (!bottomNavigation.contains(backButton)) bottomNavigation.append(backButton)
    bottomNavigation.style.setProperty('grid-template-columns', `repeat(${bottomNavigation.children.length}, minmax(0, 1fr))`, 'important')
    styleBackTabButton(backButton)
    return
  }
  const previousParent = backButton.parentElement
  if (previousParent && previousParent !== document.body) previousParent.style.removeProperty('grid-template-columns')
  if (backButton.parentElement !== document.body) document.body.append(backButton)
  styleFloatingBackButton(backButton, window.innerWidth >= 800)
}
