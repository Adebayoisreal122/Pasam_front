'use client'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, MessageCircle, Package, ArrowRight, Building, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function OrderSuccessContent() {
  const { id }  = useParams<{ id: string }>()
  const params  = useSearchParams()
  const waLink  = params.get('wa') ? decodeURIComponent(params.get('wa')!) : null
  const [copied, setCopied] = useState(false)

  const copyOrderId = () => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-10">

        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={44} className="text-green-500" />
        </div>

        <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-500 mb-2 text-sm">
          Thank you for your order. Please complete your payment below.
        </p>

        {/* Order ID */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs text-gray-400">Order ID:</span>
          <span className="font-mono text-sm font-bold text-gray-700">{id?.slice(-8).toUpperCase()}</span>
          <button onClick={copyOrderId}
            className="text-gray-400 hover:text-green-600 transition-colors">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Bank details */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Building size={16} className="text-green-700" />
            <p className="font-bold text-green-800 text-sm">Complete Your Payment</p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ['Bank',      'First Bank Nigeria'],
              ['Account',   '1234567890'],
              ['Name',      'PASAM Store Ltd'],
              ['Reference', id?.slice(-8).toUpperCase() || 'Your Order ID'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <span className="text-green-700">{k}</span>
                <span className="font-bold font-mono text-green-900 text-xs">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-green-600 mt-3 border-t border-green-200 pt-2">
            After payment, upload your proof in My Orders so we can confirm quickly.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">

          {/* WhatsApp button — always show with fallback link */}
          <Button
            variant="whatsapp"
            className="w-full"
            asChild
          >
            <a
              href={waLink || `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '2348012345678'}?text=${encodeURIComponent(`Hi PASAM Store! I just placed an order. Order ID: ${id?.slice(-8).toUpperCase()}. Please confirm receipt.`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} /> Notify Us on WhatsApp
            </a>
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href={`/store/my-orders/${id}`}>
              <Package size={17} /> Track My Order
            </Link>
          </Button>

          <Link
            href="/store/products"
            className="text-sm text-gray-500 hover:text-green-600 transition-colors flex items-center justify-center gap-1 mt-1"
          >
            Continue Shopping <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Info note */}
      <p className="text-xs text-gray-400 mt-4 px-4">
        A confirmation email has been sent to your email address. Check spam if you don&apos;t see it.
      </p>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
