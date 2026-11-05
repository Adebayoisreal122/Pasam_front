'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import IOSInstallModal from './IOSInstallModal'
import { Button } from '@/components/ui/button'

export default function InstallButton() {
  const { canInstall, isIOS, install } = useInstallPrompt()
  const [showIOS, setShowIOS] = useState(false)

  if (!canInstall) return null

  const handleClick = () => {
    if (isIOS) setShowIOS(true)
    else install()
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleClick} className="gap-1.5">
        <Download size={14} />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </Button>
      {showIOS && <IOSInstallModal onClose={() => setShowIOS(false)} />}
    </>
  )
}
