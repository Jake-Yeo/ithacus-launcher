const runningManagedApps = new Map()
let selectedManagedAppId = null
let pendingManagedAppTransition = Promise.resolve()

export function getSelectedManagedApp() {
  return selectedManagedAppId ? runningManagedApps.get(selectedManagedAppId) ?? null : null
}

export function setSelectedManagedApp(managedAppId) {
  selectedManagedAppId = managedAppId
}

export function getManagedApp(managedAppId) {
  return runningManagedApps.get(managedAppId) ?? null
}

export function getRunningManagedApps() {
  return [...runningManagedApps.values()]
}

export function setManagedApp(managedApp) {
  runningManagedApps.set(managedApp.app.id, managedApp)
}

export function removeManagedApp(managedAppId, managedApp) {
  if (runningManagedApps.get(managedAppId) === managedApp) runningManagedApps.delete(managedAppId)
  if (selectedManagedAppId === managedAppId) selectedManagedAppId = null
}

export function runManagedAppTransition(operation) {
  const operationResult = pendingManagedAppTransition.then(operation, operation)
  pendingManagedAppTransition = operationResult.catch(() => {})
  return operationResult
}
