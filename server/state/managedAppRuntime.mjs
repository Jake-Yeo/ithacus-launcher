let activeManagedApp = null
let pendingManagedAppTransition = Promise.resolve()

export function getActiveManagedApp() {
  return activeManagedApp
}

export function setActiveManagedApp(nextActiveManagedApp) {
  activeManagedApp = nextActiveManagedApp
}

export function runManagedAppTransition(operation) {
  const operationResult = pendingManagedAppTransition.then(operation, operation)
  pendingManagedAppTransition = operationResult.catch(() => {})
  return operationResult
}
