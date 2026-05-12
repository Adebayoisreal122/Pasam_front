'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { orderAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/ui/index'
import { formatPrice, formatDate } from '@/lib/utils'

const STATUS: Record<string, string> = { pending:'bg-orange-100 text-orange-700', processing:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' }

export default function MyOrdersPage() {
  const [orders,  setOrders]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getMyOrders().then(r => setOrders(r.data.orders)).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-7">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)]">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-gray-300" />
          </div>
          <h3 className="font-display font-bold text-lg text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500 text-sm mb-5">Start shopping to see your orders here!</p>
          <Button asChild><Link href="/store/products">Browse Products</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Link key={order._id} href={`/store/my-orders/${order._id}`}
              className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5 flex items-center justify-between gap-4 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.14)] transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                  <Package size={22} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 font-mono text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="font-display font-extrabold text-green-600">{formatPrice(order.totalAmount)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS[order.deliveryStatus]||'bg-gray-100 text-gray-600'}`}>
                    {order.deliveryStatus}
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
