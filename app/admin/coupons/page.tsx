'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Ticket } from 'lucide-react'
import { couponAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, PageLoader } from '@/components/ui/index'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const BLANK = { code:'', type:'percentage', value:'', minOrderAmount:0, maxDiscount:'', usageLimit:'', isActive:true, expiresAt:'' }

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState<any>(BLANK)
  const [saving,  setSaving]  = useState(false)

  const load = () => { setLoading(true); couponAPI.getAll().then(r => setCoupons(r.data.coupons)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try { await couponAPI.create({ ...form, code: form.code.toUpperCase() }); toast.success('Coupon created!'); setModal(false); load() }
    catch (err: any) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return
    try { await couponAPI.delete(id); toast.success('Deleted'); load() } catch { toast.error('Failed') }
  }

  const toggleActive = async (id: string, current: boolean) => {
    try { await couponAPI.update(id, { isActive: !current }); load() } catch { toast.error('Failed') }
  }

  const f = (key: string) => (e: any) => setForm((p: any) => ({ ...p, [key]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-xl text-gray-900">Coupons</h1>
        <Button onClick={() => { setForm(BLANK); setModal(true) }} size="sm"><Plus size={15} /> Add Coupon</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Code','Type','Value','Min Order','Uses','Expires','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg text-xs">{c.code}</span>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">{c.type}</td>
                    <td className="px-4 py-3 font-bold text-gray-800">{c.type==='percentage' ? `${c.value}%` : formatPrice(c.value)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatPrice(c.minOrderAmount||0)}</td>
                    <td className="px-4 py-3 text-gray-600">{c.usedCount}/{c.usageLimit||'∞'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(c._id, c.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${c.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(c._id, c.code)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No coupons yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg text-gray-900">New Coupon</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><Label>Coupon Code *</Label><Input className="font-mono uppercase" value={form.code} onChange={e => setForm((p:any) => ({ ...p, code: e.target.value.toUpperCase() }))} required placeholder="e.g. SAVE10" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Type</Label>
                  <Select value={form.type} onChange={f('type')}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₦)</option>
                  </Select>
                </div>
                <div><Label>Value *</Label><Input type="number" value={form.value} onChange={f('value')} required min="0" placeholder={form.type==='percentage' ? '10' : '500'} /></div>
                <div><Label>Min Order (₦)</Label><Input type="number" value={form.minOrderAmount} onChange={f('minOrderAmount')} min="0" /></div>
                {form.type==='percentage' && <div><Label>Max Discount (₦)</Label><Input type="number" value={form.maxDiscount} onChange={f('maxDiscount')} min="0" /></div>}
                <div><Label>Usage Limit</Label><Input type="number" value={form.usageLimit} onChange={f('usageLimit')} min="1" placeholder="Unlimited" /></div>
                <div><Label>Expires</Label><Input type="date" value={form.expiresAt} onChange={f('expiresAt')} /></div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-gray-200" onClick={() => setModal(false)}>Cancel</Button>
                <Button type="submit" loading={saving} className="flex-1 gap-1.5">
                  <Ticket size={14} /> {saving ? 'Creating…' : 'Create Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
