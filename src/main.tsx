import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './tailwind.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/__ithacus/sw.js?v=16', { scope: '/__ithacus/', updateViaCache: 'none' })
}
