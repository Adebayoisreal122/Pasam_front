'use client'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { CheckCircle, MessageCircle, Package, ArrowRight, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderSuccessPage() {
  const { id }    = useParams<{ id: string }>()
  const params    = useSearchParams()
  const waLink    = params.get('wa') ? decodeURIComponent(params.get('wa')!) : null

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-10">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your order. We&apos;ll process it as soon as your payment is confirmed.
        </p>

        {/* Bank details */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Building size={16} className="text-green-700" />
            <p className="font-bold text-green-800 text-sm">Complete Your Payment</p>
          </div>
          <div className="space-y-1.5 text-sm">
            {[['Bank','First Bank Nigeria'],['Account','1234567890'],['Name','PASAM Store Ltd'],['Reference','Your Order Number']].map(([k,v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-green-700">{k}</span>
                <span className="font-bold font-mono text-green-900">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {waLink && (
            <Button variant="whatsapp" className="w-full" asChild>
              <a href={waLink} target="_blank" rel="noreferrer">
                <MessageCircle size={16} /> Notify Us on WhatsApp
              </a>
            </Button>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/store/my-orders/${id}`}>
              <Package size={16} /> Track My Order
            </Link>
          </Button>
          <Link href="/store/products"
            className="text-sm text-gray-500 hover:text-green-600 transition-colors flex items-center justify-center gap-1">
            Continue Shopping <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
