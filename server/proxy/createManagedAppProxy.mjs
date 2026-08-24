import { createProxyMiddleware } from 'http-proxy-middleware'
import { getSelectedManagedApp } from '../state/managedAppRuntime.mjs'

export function createManagedAppProxy() {
  return createProxyMiddleware({
    changeOrigin: true,
    ws: true,
    router: () => {
      const selectedManagedApp = getSelectedManagedApp()
      return selectedManagedApp ? `http://127.0.0.1:${selectedManagedApp.app.port}` : 'http://127.0.0.1:9'
    },
    on: { error: (_error, _request, response) => {
      if (typeof response.writeHead !== 'function' || typeof response.end !== 'function') return response.destroy?.()
      if (!response.headersSent) response.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('The selected app is unavailable.')
    } },
  })
}
