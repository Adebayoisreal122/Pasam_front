import { Suspense } from 'react'
import QuoteContent from './QuoteContent'

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    }>
      <QuoteContent />
    </Suspense>
  )
}
