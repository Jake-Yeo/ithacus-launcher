import { StopIcon } from '../icons/StopIcon'
import { Button } from '../ui/Button'

type StopAppButtonProps = { appName: string; disabled: boolean; onStop: () => void; className?: string }

export function StopAppButton({ appName, disabled, onStop, className }: StopAppButtonProps) {
  return <Button disabled={disabled} onClick={onStop} className={className}><StopIcon className="size-4" />Stop {appName}</Button>
}
