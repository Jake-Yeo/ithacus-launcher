import { cn } from '../../lib/cn'

export function StatusMessage({ message }: { message: string }) {
  const hasError = message.toLowerCase().includes('could not')
  return <p className={cn('mt-4 min-h-5 text-sm font-semibold', hasError ? 'text-danger' : 'text-sea')} role="status" aria-live="polite">{message}</p>
}
