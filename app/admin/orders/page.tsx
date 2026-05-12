'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'
import { orderAPI } from '@/services/api'
import { Input, Select, PageLoader } from '@/components/ui/index'
import { formatPrice, formatDate } from '@/lib/utils'

const DELIVERY_BADGE: Record<string, string> = { pending:'bg-orange-100 text-orange-700', processing:'bg-blue-100 text-blue-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' }
const PAYMENT_BADGE:  Record<string, string> = { pending:'bg-orange-100 text-orange-700', paid:'bg-green-100 text-green-700', failed:'bg-red-100 text-red-700', refunded:'bg-gray-100 text-gray-600' }

export default function AdminOrdersPage() {
  const [orders,     setOrders]     = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total,      setTotal]      = useState(0)
  const [search,     setSearch]     = useState('')
  const [status,     setStatus]     = useState('')
  const [payStatus,  setPayStatus]  = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await orderAPI.getAllAdmin({ page, limit:20, search, status, paymentStatus:payStatus })
      setOrders(data.orders); setTotalPages(data.pages); setTotal(data.total)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, search, status, payStatus])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-xl text-gray-900">
          Orders <span className="text-gray-400 font-normal text-base">({total})</span>
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input className="pl-9 h-10 text-sm" placeholder="Search order number…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <Select className="h-10 text-sm w-auto" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">All Statuses</option>
          {['pending','processing','shipped','delivered','cancelled'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </Select>
        <Select className="h-10 text-sm w-auto" value={payStatus} onChange={e => { setPayStatus(e.target.value); setPage(1) }}>
          <option value="">All Payments</option>
          {['pending','paid','failed','refunded'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </Select>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Order #','Customer','Items','Total','Delivery','Payment','Date','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-gray-800 text-xs">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{order.user?.fullname}</p>
                      <p className="text-xs text-gray-400">{order.user?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length}</td>
                    <td className="px-4 py-3 font-bold text-green-600 font-display">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${DELIVERY_BADGE[order.deliveryStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${PAYMENT_BADGE[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order._id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${page===p ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}
