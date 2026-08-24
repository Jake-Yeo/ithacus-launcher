import { useRef, useState, type PointerEvent } from 'react'
import type { LauncherApp } from '../../types'
import { AppTileIcon } from './AppTileIcon'

type RunningAppRowProps = { app: LauncherApp; disabled: boolean; onOpen: (app: LauncherApp) => void; onStop: (appId: string) => void }

const swipeThreshold = 96

export function RunningAppRow({ app, disabled, onOpen, onStop }: RunningAppRowProps) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef<number | null>(null)
  const moved = useRef(false)

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    startX.current = event.clientX
    moved.current = false
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null || !dragging) return
    const nextOffset = Math.max(0, event.clientX - startX.current)
    if (nextOffset > 8) moved.current = true
    setOffset(Math.min(nextOffset, 140))
  }
  const handlePointerEnd = () => {
    if (startX.current === null) return
    const shouldStop = offset >= swipeThreshold
    startX.current = null
    setDragging(false)
    if (shouldStop) { setOffset(0); onStop(app.id) }
    else setOffset(0)
  }
  const handleClick = () => { if (!moved.current && !disabled) onOpen(app) }

  return <div className="relative overflow-hidden rounded-2xl bg-danger-soft" role="button" tabIndex={disabled ? -1 : 0} aria-label={`Open ${app.name}`} onClick={handleClick} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(app) } }}>
    <div className="absolute inset-y-0 left-0 flex items-center gap-2 px-4 text-xs font-bold uppercase tracking-label text-danger"><span aria-hidden="true">→</span>Stop</div>
    <div className="relative flex min-h-20 touch-pan-y select-none items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2 shadow-sm" style={{ transform: `translateX(${offset}px)`, transition: dragging ? 'none' : 'transform 180ms ease-out' }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd}>
      <div className="size-14 shrink-0"><AppTileIcon app={app} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink">{app.name}</p><p className="truncate text-xs text-muted">{app.state === 'starting' ? 'Starting…' : 'Running'}</p></div><span className="text-muted" aria-hidden="true">⋯</span>
    </div>
  </div>
}
