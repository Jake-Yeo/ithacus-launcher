import { findVisibleBottomNavigation } from './findVisibleBottomNavigation'
import { styleExitTabButton } from './styleExitTabButton'
import { styleFloatingExitButton } from './styleFloatingExitButton'

export function placeExitButton(document: Document, window: Window, exitButton: HTMLButtonElement) {
  const bottomNavigation = findVisibleBottomNavigation(document, window)
  if (bottomNavigation) {
    const previousParent = exitButton.parentElement
    if (previousParent && previousParent !== bottomNavigation && previousParent !== document.body) previousParent.style.removeProperty('grid-template-columns')
    if (!bottomNavigation.contains(exitButton)) bottomNavigation.append(exitButton)
    bottomNavigation.style.setProperty('grid-template-columns', `repeat(${bottomNavigation.children.length}, minmax(0, 1fr))`, 'important')
    styleExitTabButton(exitButton)
    return
  }
  const previousParent = exitButton.parentElement
  if (previousParent && previousParent !== document.body) previousParent.style.removeProperty('grid-template-columns')
  if (exitButton.parentElement !== document.body) document.body.append(exitButton)
  styleFloatingExitButton(exitButton, window.innerWidth >= 800)
}
