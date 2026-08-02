import { useCallback, useEffect, useRef } from 'react'
import { installEmbeddedAppControls } from '../services/embedded/installEmbeddedAppControls'

export function useEmbeddedAppControls(activeAppId: string | null) {
  const embeddedFrameRef = useRef<HTMLIFrameElement>(null)
  const installControls = useCallback(() => {
    if (embeddedFrameRef.current) installEmbeddedAppControls(embeddedFrameRef.current, activeAppId)
  }, [activeAppId])
  useEffect(() => {
    window.addEventListener('resize', installControls)
    return () => window.removeEventListener('resize', installControls)
  }, [installControls])
  return { embeddedFrameRef, installControls }
}
