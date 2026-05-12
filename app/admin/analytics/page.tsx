'use client'
import { useEffect, useState } from 'react'
import { adminAPI } from '@/services/api'
import { Select, PageLoader } from '@/components/ui/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#16a34a','#f97316','#3b82f6','#8b5cf6','#ef4444','#06b6d4']

export default function AnalyticsPage() {
  const [data,    setData]    = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period,  setPeriod]  = useState('30')

  useEffect(() => {
    setLoading(true)
    adminAPI.getAnalytics({ period }).then(r => setData(r.data.analytics)).catch(console.error).finally(() => setLoading(false))
  }, [period])

  if (loading) return <PageLoader />
  if (!data)   return <div className="text-center py-12 text-gray-500">Failed to load analytics</div>

  const totalRevenue = data.dailySales.reduce((s: number, d: any) => s + d.revenue, 0)
  const totalOrders  = data.dailySales.reduce((s: number, d: any) => s + d.orders, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-extrabold text-xl text-gray-900">Analytics</h1>
        <Select className="h-10 text-sm w-auto" value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue',   value: formatPrice(totalRevenue),                                                  color:'text-green-600' },
          { label:'Total Orders',    value: totalOrders,                                                                color:'text-blue-600' },
          { label:'Avg Order Value', value: totalOrders ? formatPrice(Math.round(totalRevenue/totalOrders)) : '₦0',    color:'text-purple-600' },
          { label:'Active Categories',value: data.revenueByCategory.length,                                             color:'text-orange-600' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{k.label}</p>
            <p className={`font-display font-extrabold text-2xl ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Daily Revenue (₦)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.dailySales} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="_id" tick={{ fontSize:10 }} tickFormatter={(d:string) => d?.slice(5)} />
                <YAxis tick={{ fontSize:10 }} tickFormatter={(v:number) => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [formatPrice(v), 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Daily Orders Count</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.dailySales} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="_id" tick={{ fontSize:10 }} tickFormatter={(d:string) => d?.slice(5)} />
                <YAxis tick={{ fontSize:10 }} allowDecimals={false} />
                <Tooltip formatter={(v: any) => [v, 'Orders']} />
                <Bar dataKey="orders" fill="#f97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            {data.revenueByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data.revenueByCategory} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={80}
                    label={({ _id, percent }: any) => `${_id} ${(percent*100).toFixed(0)}%`}>
                    {data.revenueByCategory.map((_: any, i: number) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [formatPrice(v), 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-400 py-12 text-sm">No revenue data yet</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Orders by Status</CardTitle></CardHeader>
          <CardContent>
            {data.ordersByStatus.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={data.ordersByStatus} layout="vertical" margin={{ top:0, right:20, left:20, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis type="number" tick={{ fontSize:10 }} allowDecimals={false} />
                    <YAxis dataKey="_id" type="category" tick={{ fontSize:10 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0,4,4,0]}>
                      {data.ordersByStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {data.ordersByStatus.map((s: any, i: number) => (
                    <div key={s._id} className="text-center p-2 rounded-xl" style={{ background: COLORS[i%COLORS.length]+'15' }}>
                      <p className="font-display font-extrabold text-xl" style={{ color: COLORS[i%COLORS.length] }}>{s.count}</p>
                      <p className="text-xs text-gray-500 capitalize">{s._id}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : <p className="text-center text-gray-400 py-12 text-sm">No orders yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
