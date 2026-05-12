'use client'
import { useState } from 'react'
import { Building2, User, Mail, Phone, Calendar, MapPin, Plus, Trash2, Send, CheckCircle } from 'lucide-react'
import { quoteAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/index'
import toast from 'react-hot-toast'

const ORG_TYPES = ['church','ngo','school','company','event','welfare','other']

export default function BulkQuotePage() {
  const [form, setForm] = useState({ organizationName:'', contactName:'', email:'', phone:'', organizationType:'church', deliveryAddress:'', deliveryDate:'', additionalNotes:'' })
  const [items, setItems] = useState([{ productName:'', quantity:'', notes:'' }])
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [quoteNum,setQuoteNum]= useState('')

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }))

  const updateItem = (i: number, key: string, val: string) =>
    setItems(prev => prev.map((it, idx) => idx===i ? { ...it, [key]: val } : it))
  const addItem    = () => setItems(prev => [...prev, { productName:'', quantity:'', notes:'' }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.some(it => !it.productName || !it.quantity)) return toast.error('Fill in all item fields')
    setLoading(true)
    try {
      const { data } = await quoteAPI.submit({ ...form, items })
      setQuoteNum(data.quote.quoteNumber); setDone(true)
    } catch (err: any) { toast.error(err.response?.data?.message || 'Submission failed') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-10">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-2">Quote Submitted!</h2>
        <p className="text-gray-500 mb-4">Your reference number:</p>
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl py-3 px-6 text-2xl font-display font-extrabold text-green-700 mb-6 tracking-wide font-mono">
          {quoteNum}
        </div>
        <p className="text-gray-500 text-sm">We&apos;ll contact you within <strong>24 hours</strong> with a detailed quotation.</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mb-8">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 mb-3">Bulk Orders</span>
        <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">Request a Bulk Quote</h1>
        <p className="text-gray-500 leading-relaxed">For churches, NGOs, schools, events, and organizations. Our team will send a custom quotation within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Organization */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6">
            <h2 className="font-display font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
              <Building2 size={17} className="text-green-600" /> Organization Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Organization Name *</Label><Input value={form.organizationName} onChange={f('organizationName')} placeholder="e.g. Grace Baptist Church" required /></div>
              <div><Label>Organization Type *</Label>
                <Select value={form.organizationType} onChange={f('organizationType')}>
                  {ORG_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </Select>
              </div>
              <div>
                <Label>Contact Person *</Label>
                <div className="relative"><User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /><Input className="pl-10" value={form.contactName} onChange={f('contactName')} placeholder="Full name" required /></div>
              </div>
              <div>
                <Label>Phone *</Label>
                <div className="relative"><Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /><Input className="pl-10" value={form.phone} onChange={f('phone')} placeholder="08012345678" required /></div>
              </div>
              <div className="sm:col-span-2">
                <Label>Email *</Label>
                <div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /><Input type="email" className="pl-10" value={form.email} onChange={f('email')} placeholder="contact@org.com" required /></div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-base text-gray-800">Items Needed</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus size={13} /> Add Item</Button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="grid sm:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="sm:col-span-2"><Input className="text-sm h-10" placeholder="Product name (e.g. Rice 50kg)" value={item.productName} onChange={e => updateItem(i,'productName',e.target.value)} required /></div>
                  <div><Input type="number" className="text-sm h-10" placeholder="Qty" min="1" value={item.quantity} onChange={e => updateItem(i,'quantity',e.target.value)} required /></div>
                  <div><Input className="text-sm h-10" placeholder="Notes" value={item.notes} onChange={e => updateItem(i,'notes',e.target.value)} /></div>
                  <div className="flex items-center justify-end">
                    {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={15} /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6">
            <h2 className="font-display font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={17} className="text-green-600" /> Delivery Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Label>Delivery Address</Label><Textarea rows={2} value={form.deliveryAddress} onChange={f('deliveryAddress')} placeholder="Full delivery address" /></div>
              <div>
                <Label>Preferred Date</Label>
                <div className="relative"><Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /><Input type="date" className="pl-10" value={form.deliveryDate} onChange={f('deliveryDate')} min={new Date().toISOString().split('T')[0]} /></div>
              </div>
              <div><Label>Additional Notes</Label><Input value={form.additionalNotes} onChange={f('additionalNotes')} placeholder="Any special requirements" /></div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6 sticky top-24">
            <h3 className="font-display font-bold text-base text-gray-800 mb-4">Summary</h3>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600"><span>Items requested</span><span className="font-bold text-gray-800">{items.filter(i => i.productName).length}</span></div>
              <div className="flex justify-between text-gray-600"><span>Total quantity</span><span className="font-bold text-gray-800">{items.reduce((s,i) => s+(Number(i.quantity)||0),0)}</span></div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 mb-5 text-xs text-green-700 space-y-1.5">
              <p className="font-bold">What happens next:</p>
              {['We review your request','Send you a custom quote in 24hrs','You confirm and make payment','We deliver on agreed date'].map((s,i) => (
                <p key={i} className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-green-200 text-green-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">{i+1}</span>{s}</p>
              ))}
            </div>
            <Button type="submit" loading={loading} className="w-full">
              <Send size={15} /> {loading ? 'Submitting…' : 'Submit Quote Request'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
