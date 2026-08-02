import { useCallback, useEffect, useRef } from 'react'
import { installEmbeddedAppControls } from '../services/embedded/installEmbeddedAppControls'
import { isLauncherExitMessage } from '../services/embedded/isLauncherExitMessage'

export function useEmbeddedAppControls(activeAppId: string | null, onExit: () => void) {
  const embeddedFrameRef = useRef<HTMLIFrameElement>(null)
  const installControls = useCallback(() => {
    if (embeddedFrameRef.current) installEmbeddedAppControls(embeddedFrameRef.current, activeAppId)
  }, [activeAppId])
  useEffect(() => {
    window.addEventListener('resize', installControls)
    return () => window.removeEventListener('resize', installControls)
  }, [installControls])
  useEffect(() => {
    const handleExitMessage = (event: MessageEvent) => { if (isLauncherExitMessage(event, embeddedFrameRef.current)) onExit() }
    window.addEventListener('message', handleExitMessage)
    return () => window.removeEventListener('message', handleExitMessage)
  }, [onExit])
  return { embeddedFrameRef, installControls }
}
