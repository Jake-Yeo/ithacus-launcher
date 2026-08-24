import { spawn } from 'node:child_process'
import { getManagedApp, removeManagedApp, setManagedApp, setSelectedManagedApp } from '../state/managedAppRuntime.mjs'
import { stopManagedApp } from './stopManagedApp.mjs'
import { waitForManagedApp } from './waitForManagedApp.mjs'

export async function startManagedApp(managedApp) {
  const existingManagedApp = getManagedApp(managedApp.id)
  if (existingManagedApp?.state === 'running') {
    setSelectedManagedApp(managedApp.id)
    return
  }
  if (existingManagedApp) await stopManagedApp(managedApp.id)
  const recentLogs = []
  const childProcess = spawn(managedApp.command, managedApp.args, { cwd: managedApp.cwd, env: { ...process.env, ...managedApp.env }, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
  const managedAppProcess = { app: managedApp, child: childProcess, logs: recentLogs, state: 'starting' }
  setManagedApp(managedAppProcess)
  setSelectedManagedApp(managedApp.id)
  const captureRecentLog = logChunk => { recentLogs.push(logChunk.toString()); if (recentLogs.length > 80) recentLogs.shift() }
  childProcess.stdout.on('data', captureRecentLog)
  childProcess.stderr.on('data', captureRecentLog)
  childProcess.once('exit', () => { if (getManagedApp(managedApp.id) === managedAppProcess) removeManagedApp(managedApp.id, managedAppProcess) })
  try {
    await waitForManagedApp(managedApp, childProcess)
    if (getManagedApp(managedApp.id) === managedAppProcess) managedAppProcess.state = 'running'
  } catch (error) {
    await stopManagedApp(managedApp.id)
    throw error
  }
}
