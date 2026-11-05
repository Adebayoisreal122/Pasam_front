'use client'
import { useEffect, useState, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    setIsInstalled(standalone)

    const ua = navigator.userAgent
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream)

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setIsInstalled(true)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return false
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    return outcome === 'accepted'
  }, [deferred])

  // Show the button on Chromium when the browser says it can install,
  // and on iOS Safari where install is manual (Share > Add to Home Screen)
  const canInstall = !isInstalled && (!!deferred || isIOS)

  return { canInstall, isIOS, isInstalled, install }
}
