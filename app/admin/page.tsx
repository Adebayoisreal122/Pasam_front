'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, ShoppingBag, Users, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { adminAPI } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle, PageLoader } from '@/components/ui/index'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '@/lib/utils'

const STATUS_DOT: Record<string, string> = {
  pending:'bg-orange-400', processing:'bg-blue-400',
  shipped:'bg-purple-400', delivered:'bg-green-400', cancelled:'bg-red-400'
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getDashboard().then(r => setStats(r.data.stats)).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />
  if (!stats)  return <div className="text-center py-12 text-gray-500">Failed to load dashboard</div>

  const kpis = [
    { label:'Total Revenue',  value: formatPrice(stats.totalRevenue),  sub: `${formatPrice(stats.monthlyRevenue)} this month`, icon: DollarSign, border: 'border-l-green-400',  iconClass: 'bg-green-100 text-green-600' },
    { label:'Total Orders',   value: stats.totalOrders,                 sub: `${stats.pendingOrders} pending`,                  icon: ShoppingBag, border: 'border-l-blue-400',   iconClass: 'bg-blue-100 text-blue-600' },
    { label:'Customers',      value: stats.totalUsers,                  sub: 'Registered users',                                icon: Users,       border: 'border-l-purple-400', iconClass: 'bg-purple-100 text-purple-600' },
    { label:'Monthly Growth', value: `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}%`, sub: 'vs last month',    icon: TrendingUp,  border: `border-l-${stats.revenueGrowth >= 0 ? 'green' : 'red'}-400`, iconClass: `bg-${stats.revenueGrowth >= 0 ? 'green' : 'red'}-100 text-${stats.revenueGrowth >= 0 ? 'green' : 'red'}-600` },
  ]

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-xl text-gray-900">Dashboard Overview</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className={`bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5 border-l-4 ${k.border}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{k.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.iconClass}`}>
                <k.icon size={17} />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-gray-900 leading-none mb-1">{k.value}</p>
            <p className="text-xs text-gray-500">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Chart */}
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.monthlyChart} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [formatPrice(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Link href="/admin/products" className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
                All <ArrowUpRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.map((p: any, i: number) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category?.name}</p>
                  </div>
                  <span className="text-xs font-bold text-orange-500 flex-shrink-0">{p.salesCount} sold</span>
                </div>
              ))}
              {stats.topProducts.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No sales yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Recent orders */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders" className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
                All <ArrowUpRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {stats.recentOrders.map((order: any) => (
                <Link key={order._id} href={`/admin/orders/${order._id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-gray-800 font-mono">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.user?.fullname}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[order.deliveryStatus] || 'bg-gray-400'}`} />
                      <span className="text-xs font-semibold capitalize text-gray-600">{order.deliveryStatus}</span>
                    </div>
                    <p className="text-sm font-extrabold text-green-600 font-display">{formatPrice(order.totalAmount)}</p>
                  </div>
                </Link>
              ))}
              {stats.recentOrders.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No orders yet</p>}
            </div>
          </CardContent>
        </Card>

        {/* Low stock */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-orange-500" /> Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {stats.lowStockProducts.map((p: any) => (
                <div key={p._id} className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 truncate flex-1">{p.name}</p>
                  <span className={`ml-2 flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.stock === 0 ? 'Out' : `${p.stock} left`}
                  </span>
                </div>
              ))}
              {stats.lowStockProducts.length === 0 && (
                <p className="text-sm text-green-600 font-semibold text-center py-4">All well stocked!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
