'use client'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <WifiOff size={36} className="text-gray-400" />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-2">You&apos;re offline</h1>
        <p className="text-gray-500 text-sm mb-6">
          Check your internet connection and try again. Your cart is saved on this device.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw size={15} /> Try again
        </Button>
      </div>
    </div>
  )
}
