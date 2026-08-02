import { createServer } from 'node:http'
import express from 'express'
import { launcherPort } from './server/config/runtimeConfiguration.mjs'
import { registerShutdownHandlers } from './server/lifecycle/registerShutdownHandlers.mjs'
import { createManagedAppProxy } from './server/proxy/createManagedAppProxy.mjs'
import { registerManagedAppProxy } from './server/proxy/registerManagedAppProxy.mjs'
import { registerLauncherApiRoutes } from './server/routes/registerLauncherApiRoutes.mjs'
import { registerLauncherAssetRoutes } from './server/routes/registerLauncherAssetRoutes.mjs'

const expressApplication = express()
expressApplication.disable('x-powered-by')
registerLauncherApiRoutes(expressApplication)
registerLauncherAssetRoutes(expressApplication)

const httpServer = createServer(expressApplication)
registerManagedAppProxy(expressApplication, httpServer, createManagedAppProxy())
registerShutdownHandlers(httpServer)
httpServer.listen(launcherPort, '127.0.0.1', () => console.log(`Ithacus Launcher listening on http://127.0.0.1:${launcherPort}/__ithacus/`))
