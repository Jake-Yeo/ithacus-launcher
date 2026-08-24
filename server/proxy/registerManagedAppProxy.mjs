import { getSelectedManagedApp } from '../state/managedAppRuntime.mjs'

export function registerManagedAppProxy(expressApplication, httpServer, managedAppProxy) {
  expressApplication.use((request, response, next) => {
    const selectedManagedApp = getSelectedManagedApp()
    if (!selectedManagedApp || selectedManagedApp.state !== 'running') return response.redirect(302, '/__ithacus/')
    return managedAppProxy(request, response, next)
  })
  httpServer.on('upgrade', (request, socket, head) => {
    const selectedManagedApp = getSelectedManagedApp()
    if (!selectedManagedApp || selectedManagedApp.state !== 'running') return socket.destroy()
    managedAppProxy.upgrade(request, socket, head)
  })
}
