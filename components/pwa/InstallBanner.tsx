'use client'
import { useEffect, useState } from 'react'
import { Download, Smartphone, X } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import IOSInstallModal from './IOSInstallModal'
import { Button } from '@/components/ui/button'

const DISMISS_KEY = 'pasam_install_banner_dismissed'

export default function InstallBanner() {
  const { canInstall, isIOS, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(true) // hidden until we read storage
  const [showIOS, setShowIOS] = useState(false)

  useEffect(() => {
    try { setDismissed(localStorage.getItem(DISMISS_KEY) === '1') } catch { setDismissed(false) }
  }, [])

  if (!canInstall || dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch {}
  }

  return (
    <>
      <section className="bg-gradient-to-r from-green-600 to-green-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Smartphone size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Get the PASAM app</p>
            <p className="text-green-100 text-xs truncate">Order faster and track deliveries from your home screen</p>
          </div>
          <Button
            size="sm"
            className="bg-white text-green-700 hover:bg-green-50 shadow-none gap-1.5 flex-shrink-0"
            onClick={() => (isIOS ? setShowIOS(true) : install())}
          >
            <Download size={14} /> Install
          </Button>
          <button onClick={dismiss} aria-label="Dismiss" className="text-white/70 hover:text-white p-1 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      </section>
      {showIOS && <IOSInstallModal onClose={() => setShowIOS(false)} />}
    </>
  )
}
