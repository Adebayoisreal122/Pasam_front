'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ArrowLeft, Save, Printer, Package } from 'lucide-react'
import { orderAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Label, Select, Textarea, PageLoader } from '@/components/ui/index'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_BADGE: Record<string,string> = { pending:'bg-orange-100 text-orange-700', processing:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' }

export default function AdminOrderDetailPage() {
  const { id }    = useParams<{ id: string }>()
  const [order,   setOrder]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [dStatus, setDStatus] = useState('')
  const [pStatus, setPStatus] = useState('')
  const [note,    setNote]    = useState('')

  useEffect(() => {
    orderAPI.getAdminOrder(id)
      .then(r => { setOrder(r.data.order); setDStatus(r.data.order.deliveryStatus); setPStatus(r.data.order.paymentStatus) })
      .catch(console.error).finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const { data } = await orderAPI.updateStatus(id, { deliveryStatus:dStatus, paymentStatus:pStatus, note })
      setOrder(data.order); toast.success('Order updated!'); setNote('')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  if (loading) return <PageLoader />
  if (!order)  return <div className="text-center py-12 text-gray-500">Order not found</div>

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="flex items-center gap-1.5 text-sm text-green-600 hover:underline font-semibold">
          <ArrowLeft size={14} /> Back to Orders
        </Link>
        <Button variant="ghost" size="sm" className="border border-gray-200 gap-1.5" onClick={() => window.print()}>
          <Printer size={14} /> Print Invoice
        </Button>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-xl text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_BADGE[order.deliveryStatus] || 'bg-gray-100 text-gray-600'}`}>{order.deliveryStatus}</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize ${order.paymentStatus==='paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{order.paymentStatus}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5">
            <h2 className="font-display font-bold text-sm text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image
                      ? <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                      : <Package size={18} className="text-gray-300" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-bold text-sm text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <hr className="my-3 border-gray-100" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>{formatPrice(order.deliveryFee)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t border-gray-100">
                <span>Total</span><span className="text-green-600 font-display">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5">
            <h2 className="font-display font-bold text-sm text-gray-800 mb-3">Delivery Info</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[['Name',order.deliveryInfo?.fullname],['Phone',order.deliveryInfo?.phone],['Address',order.deliveryInfo?.address],['City',order.deliveryInfo?.city],['State',order.deliveryInfo?.state],['Landmark',order.deliveryInfo?.landmark||'—'],['Notes',order.deliveryInfo?.notes||'—']].map(([k,v]) => (
                <div key={k}><p className="text-xs text-gray-400 mb-0.5">{k}</p><p className="font-semibold text-gray-700">{v}</p></div>
              ))}
            </div>
          </div>

          {/* Payment proof */}
          {order.paymentProof?.url && (
            <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5">
              <h2 className="font-display font-bold text-sm text-gray-800 mb-3">Payment Proof</h2>
              <Image src={order.paymentProof.url} alt="Payment proof" width={300} height={200} className="rounded-xl border border-gray-200 max-w-xs" />
              <p className="text-xs text-gray-400 mt-2">Uploaded: {new Date(order.paymentProof.uploadedAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5">
            <h2 className="font-display font-bold text-sm text-gray-800 mb-3">Customer</h2>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm font-display">
                {order.user?.fullname?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{order.user?.fullname}</p>
                <p className="text-xs text-gray-500">{order.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5 space-y-3">
            <h2 className="font-display font-bold text-sm text-gray-800">Update Status</h2>
            <div>
              <Label className="text-xs">Delivery Status</Label>
              <Select className="h-10 text-sm" value={dStatus} onChange={e => setDStatus(e.target.value)}>
                {['pending','processing','shipped','delivered','cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="text-xs">Payment Status</Label>
              <Select className="h-10 text-sm" value={pStatus} onChange={e => setPStatus(e.target.value)}>
                {['pending','paid','failed','refunded'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="text-xs">Note (optional)</Label>
              <Textarea rows={2} className="text-sm" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Out for delivery" />
            </div>
            <Button onClick={handleUpdate} loading={saving} className="w-full" size="sm">
              <Save size={14} /> {saving ? 'Saving…' : 'Update Order'}
            </Button>
          </div>

          {/* Status history */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5">
            <h2 className="font-display font-bold text-sm text-gray-800 mb-3">Status History</h2>
            <div className="space-y-2.5">
              {order.statusHistory?.slice().reverse().map((h: any, i: number) => (
                <div key={i} className="flex gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-700 capitalize">{h.status}{h.note ? ` — ${h.note}` : ''}</p>
                    <p className="text-gray-400">{new Date(h.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
