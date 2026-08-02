import { spawn } from 'node:child_process'
import { getActiveManagedApp, setActiveManagedApp } from '../state/managedAppRuntime.mjs'
import { stopActiveManagedApp } from './stopActiveManagedApp.mjs'
import { waitForManagedApp } from './waitForManagedApp.mjs'

export async function startManagedApp(managedApp) {
  const currentManagedApp = getActiveManagedApp()
  if (currentManagedApp?.app.id === managedApp.id && currentManagedApp.state === 'running') return
  await stopActiveManagedApp()
  const recentLogs = []
  const childProcess = spawn(managedApp.command, managedApp.args, { cwd: managedApp.cwd, env: { ...process.env, ...managedApp.env }, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
  const activeManagedApp = { app: managedApp, child: childProcess, logs: recentLogs, state: 'starting' }
  setActiveManagedApp(activeManagedApp)
  const captureRecentLog = logChunk => { recentLogs.push(logChunk.toString()); if (recentLogs.length > 80) recentLogs.shift() }
  childProcess.stdout.on('data', captureRecentLog)
  childProcess.stderr.on('data', captureRecentLog)
  childProcess.once('exit', () => { if (getActiveManagedApp()?.child === childProcess) activeManagedApp.state = 'failed' })
  try {
    await waitForManagedApp(managedApp, childProcess)
    if (getActiveManagedApp()?.child === childProcess) activeManagedApp.state = 'running'
  } catch (error) {
    await stopActiveManagedApp()
    throw error
  }
}
