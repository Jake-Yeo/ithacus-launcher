import express from 'express'
import { managedAppsById } from '../config/runtimeConfiguration.mjs'
import { startManagedApp } from '../process/startManagedApp.mjs'
import { stopActiveManagedApp } from '../process/stopActiveManagedApp.mjs'
import { createLauncherStatus } from '../state/createLauncherStatus.mjs'
import { runManagedAppTransition } from '../state/managedAppRuntime.mjs'

export function registerLauncherApiRoutes(expressApplication) {
  expressApplication.use('/__ithacus/api', express.json({ limit: '16kb' }))
  expressApplication.get('/__ithacus/api/status', (_request, response) => response.json(createLauncherStatus()))
  expressApplication.post('/__ithacus/api/apps/:id/start', async (request, response) => {
    const selectedManagedApp = managedAppsById.get(request.params.id)
    if (!selectedManagedApp || selectedManagedApp.kind === 'link') return response.status(404).json({ error: 'Unknown managed app' })
    try {
      await runManagedAppTransition(() => startManagedApp(selectedManagedApp))
      response.json(createLauncherStatus())
    } catch (error) {
      response.status(500).json({ error: error.message, ...createLauncherStatus() })
    }
  })
  expressApplication.post('/__ithacus/api/stop', async (_request, response) => {
    await runManagedAppTransition(stopActiveManagedApp)
    response.json(createLauncherStatus())
  })
}
