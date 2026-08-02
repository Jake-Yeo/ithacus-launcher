import { useCallback, useEffect, useRef } from 'react'
import { installEmbeddedAppControls } from '../services/embedded/installEmbeddedAppControls'

export function useEmbeddedAppControls(activeAppId: string | null, onExit: () => void) {
  const embeddedFrameRef = useRef<HTMLIFrameElement>(null)
  const installControls = useCallback(() => {
    if (embeddedFrameRef.current) installEmbeddedAppControls(embeddedFrameRef.current, activeAppId, onExit)
  }, [activeAppId, onExit])
  useEffect(() => {
    window.addEventListener('resize', installControls)
    return () => window.removeEventListener('resize', installControls)
  }, [installControls])
  return { embeddedFrameRef, installControls }
}
