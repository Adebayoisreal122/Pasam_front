'use client'
import { useEffect, useState } from 'react'
import { Eye, X, Send } from 'lucide-react'
import { quoteAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Label, Select, Textarea, Input, PageLoader } from '@/components/ui/index'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_BADGE: Record<string,string> = { pending:'bg-orange-100 text-orange-700', reviewed:'bg-blue-100 text-blue-700', quoted:'bg-purple-100 text-purple-700', accepted:'bg-green-100 text-green-700', rejected:'bg-red-100 text-red-700' }
const STATUSES = ['pending','reviewed','quoted','accepted','rejected']

export default function QuotesPage() {
  const [quotes,  setQuotes]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected,setSelected]= useState<any>(null)
  const [status,  setStatus]  = useState('')
  const [adminQ,  setAdminQ]  = useState({ totalAmount:'', breakdown:'', notes:'' })
  const [saving,  setSaving]  = useState(false)
  const [filter,  setFilter]  = useState('')

  const load = () => { setLoading(true); quoteAPI.getAllAdmin({ status: filter }).then(r => setQuotes(r.data.quotes)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [filter])

  const open = (q: any) => { setSelected(q); setStatus(q.status); setAdminQ({ totalAmount: q.adminQuote?.totalAmount||'', breakdown: q.adminQuote?.breakdown||'', notes: q.adminQuote?.notes||'' }) }

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const payload: any = { status }
      if (adminQ.totalAmount) payload.adminQuote = { ...adminQ, totalAmount: Number(adminQ.totalAmount), validUntil: new Date(Date.now()+7*24*60*60*1000) }
      await quoteAPI.updateAdmin(selected._id, payload)
      toast.success('Quote updated!'); setSelected(null); load()
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-extrabold text-xl text-gray-900">Bulk Quote Requests</h1>
        <Select className="h-10 text-sm w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </Select>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Quote #','Organization','Contact','Type','Items','Status','Date','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quotes.map(q => (
                  <tr key={q._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-xs text-green-700">{q.quoteNumber}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{q.organizationName}</td>
                    <td className="px-4 py-3"><p className="text-gray-700">{q.contactName}</p><p className="text-xs text-gray-400">{q.phone}</p></td>
                    <td className="px-4 py-3 capitalize"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{q.organizationType}</span></td>
                    <td className="px-4 py-3 text-center text-gray-600">{q.items?.length}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[q.status]||'bg-gray-100 text-gray-600'}`}>{q.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(q.createdAt)}</td>
                    <td className="px-4 py-3"><button onClick={() => open(q)} className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"><Eye size={14} /></button></td>
                  </tr>
                ))}
                {quotes.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No quote requests yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div><h2 className="font-display font-bold text-lg text-gray-900">{selected.quoteNumber}</h2><p className="text-sm text-gray-500">{selected.organizationName}</p></div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-gray-700">Organization Details</h3>
                {[['Name',selected.organizationName],['Type',selected.organizationType],['Contact',selected.contactName],['Email',selected.email],['Phone',selected.phone],['Address',selected.deliveryAddress||'—']].map(([k,v]) => (
                  <div key={k}><p className="text-xs text-gray-400">{k}</p><p className="text-sm font-semibold text-gray-700 capitalize">{v}</p></div>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-700 mb-2">Items Requested</h3>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    {selected.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.productName}</span>
                        <span className="font-bold text-gray-800">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div><Label className="text-xs">Update Status</Label>
                  <Select className="h-10 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </Select>
                </div>
                {(status==='quoted'||status==='accepted') && (
                  <>
                    <div><Label className="text-xs">Quote Amount (₦) *</Label><Input type="number" className="h-10 text-sm" value={adminQ.totalAmount} onChange={e => setAdminQ(p => ({...p, totalAmount:e.target.value}))} placeholder="e.g. 150000" /></div>
                    <div><Label className="text-xs">Breakdown</Label><Textarea rows={2} className="text-sm" value={adminQ.breakdown} onChange={e => setAdminQ(p => ({...p, breakdown:e.target.value}))} placeholder="Rice: ₦50,000…" /></div>
                    <div><Label className="text-xs">Notes</Label><Textarea rows={2} className="text-sm" value={adminQ.notes} onChange={e => setAdminQ(p => ({...p, notes:e.target.value}))} /></div>
                  </>
                )}
                <Button onClick={handleUpdate} loading={saving} className="w-full" size="sm">
                  <Send size={14} /> {saving ? 'Saving…' : 'Update Quote'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
