import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const distributionDirectory = path.join(projectDirectory, 'dist')
export const managedApps = JSON.parse(await readFile(path.join(projectDirectory, 'apps.json'), 'utf8'))
export const managedAppsById = new Map(managedApps.map(managedApp => [managedApp.id, managedApp]))
export const launcherPort = Number(process.env.PORT || 8787)
