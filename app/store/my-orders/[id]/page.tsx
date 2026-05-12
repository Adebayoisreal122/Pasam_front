'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Upload, MessageCircle, XCircle, Package } from 'lucide-react'
import { orderAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/ui/index'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS: Record<string,string> = { pending:'bg-orange-100 text-orange-700', processing:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' }
const STEPS = ['pending','processing','shipped','delivered']

export default function OrderDetailPage() {
  const { id }    = useParams<{ id: string }>()
  const [order,   setOrder]    = useState<any>(null)
  const [loading, setLoading]  = useState(true)
  const [uploading,setUploading]=useState(false)
  const [cancelling,setCancelling]=useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    orderAPI.getMyOrder(id).then(r => setOrder(r.data.order)).catch(console.error).finally(() => setLoading(false))
  }, [id])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const fd = new FormData(); fd.append('proof', file)
    setUploading(true)
    try { const { data } = await orderAPI.uploadPayment(id, fd); setOrder(data.order); toast.success('Payment proof uploaded!') }
    catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    setCancelling(true)
    try { const { data } = await orderAPI.cancel(id); setOrder(data.order); toast.success('Order cancelled') }
    catch (err: any) { toast.error(err.response?.data?.message || 'Cannot cancel') }
    finally { setCancelling(false) }
  }

  if (loading) return <PageLoader />
  if (!order)  return <div className="text-center py-20 text-gray-500">Order not found</div>

  const currentStep  = STEPS.indexOf(order.deliveryStatus)
  const WA = process.env.NEXT_PUBLIC_WHATSAPP || '2348012345678'
  const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi! Checking on order ${order.orderNumber}`)}`

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/store/my-orders" className="flex items-center gap-1.5 text-sm text-green-600 hover:underline mb-6 font-semibold">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-xl text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS[order.deliveryStatus]||'bg-gray-100 text-gray-600'}`}>
          {order.deliveryStatus}
        </span>
      </div>

      {/* Progress */}
      {order.deliveryStatus !== 'cancelled' && (
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5 mb-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0" />
            <div className="absolute left-0 top-4 h-0.5 bg-green-500 z-0 transition-all"
              style={{ width: currentStep >= 0 ? `${(currentStep/(STEPS.length-1))*100}%` : '0%' }} />
            {STEPS.map((step, i) => (
              <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i<=currentStep ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                  {i < currentStep ? '✓' : i+1}
                </div>
                <span className={`text-[10px] font-semibold capitalize ${i<=currentStep ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5 mb-5">
        <h2 className="font-display font-bold text-sm text-gray-800 mb-3">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {item.image ? <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" /> : <Package size={18} className="text-gray-300" />}
              </div>
              <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.quantity}</p></div>
              <span className="font-bold text-sm text-gray-700">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <hr className="my-3 border-gray-100" />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{formatPrice(order.deliveryFee)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between font-bold text-gray-800"><span>Total</span><span className="text-green-600 font-display text-base">{formatPrice(order.totalAmount)}</span></div>
        </div>
      </div>

      {/* Payment proof upload */}
      {order.paymentStatus === 'pending' && order.deliveryStatus !== 'cancelled' && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 mb-5">
          <h3 className="font-bold text-orange-800 mb-2 text-sm flex items-center gap-2">
            <Upload size={15} /> Payment Required
          </h3>
          <p className="text-xs text-orange-700 mb-3">
            Transfer {formatPrice(order.totalAmount)} to First Bank (1234567890) and upload proof below.
          </p>
          <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleUpload} />
          {order.paymentProof?.url ? (
            <p className="text-green-700 text-sm font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /> Proof uploaded — awaiting confirmation
            </p>
          ) : (
            <Button variant="orange" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading…' : 'Upload Payment Proof'}
            </Button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="whatsapp" size="sm" asChild>
          <a href={waLink} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Chat on WhatsApp</a>
        </Button>
        {['pending','processing'].includes(order.deliveryStatus) && (
          <Button variant="ghost" size="sm" className="border border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleCancel} disabled={cancelling}>
            {cancelling ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <XCircle size={15} />}
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  )
}
