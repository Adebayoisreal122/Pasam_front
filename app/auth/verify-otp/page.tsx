import { Suspense } from 'react'
import VerifyOTPContent from './VerifyOTPContent'

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}
