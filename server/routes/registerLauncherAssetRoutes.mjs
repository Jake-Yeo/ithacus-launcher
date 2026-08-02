import express from 'express'
import path from 'node:path'
import { distributionDirectory } from '../config/runtimeConfiguration.mjs'

export function registerLauncherAssetRoutes(expressApplication) {
  expressApplication.use('/__ithacus/assets', express.static(distributionDirectory, { maxAge: 0, etag: true, setHeaders: response => response.set('Cache-Control', 'no-cache') }))
  expressApplication.get('/__ithacus/manifest.webmanifest', (_request, response) => response.sendFile(path.join(distributionDirectory, 'manifest.webmanifest')))
  expressApplication.get('/__ithacus/sw.js', (_request, response) => {
    response.set('Service-Worker-Allowed', '/__ithacus/')
    response.sendFile(path.join(distributionDirectory, 'sw.js'))
  })
  expressApplication.get(['/__ithacus', '/__ithacus/', '/__ithacus/index.html'], (_request, response) => response.sendFile(path.join(distributionDirectory, 'index.html')))
}
