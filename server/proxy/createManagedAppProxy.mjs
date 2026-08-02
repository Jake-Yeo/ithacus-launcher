import { createProxyMiddleware } from 'http-proxy-middleware'
import { getActiveManagedApp } from '../state/managedAppRuntime.mjs'

export function createManagedAppProxy() {
  return createProxyMiddleware({
    changeOrigin: true,
    ws: true,
    router: () => {
      const activeManagedApp = getActiveManagedApp()
      return activeManagedApp ? `http://127.0.0.1:${activeManagedApp.app.port}` : 'http://127.0.0.1:9'
    },
    on: { error: (_error, _request, response) => {
      if (typeof response.writeHead !== 'function' || typeof response.end !== 'function') return response.destroy?.()
      if (!response.headersSent) response.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('The selected app is unavailable.')
    } },
  })
}
