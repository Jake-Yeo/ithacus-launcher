import type { RefObject } from 'react'
import type { LauncherApp } from '../../types'

type EmbeddedAppStageProps = { activeApp: LauncherApp | null; appId: string | null; frameRef: RefObject<HTMLIFrameElement | null>; frameUrl: string; open: boolean; onLoad: () => void }

export function EmbeddedAppStage(props: EmbeddedAppStageProps) {
  return <section className={props.open ? 'fixed inset-0 z-50 block bg-surface' : 'hidden'} aria-hidden={!props.open}>
    <iframe ref={props.frameRef} className="size-full border-0 bg-surface" src={props.frameUrl} data-ithacus-app-id={props.appId || undefined} title={props.activeApp ? props.activeApp.name : 'Selected Isle of Ithaca application'} onLoad={props.onLoad} />
  </section>
}
