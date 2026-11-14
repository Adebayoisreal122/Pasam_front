'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, X, Upload, Package, Search } from 'lucide-react'
import API from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea, PageLoader } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

const BLANK = { name: '', group: '', unit: '', price: '', stock: '', maxQty: 20, sortOrder: 0, description: '', isActive: true }
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

export default function CustomItemsPage() {
  const [items, setItems]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm]       = useState<any>(BLANK)
  const [image, setImage]     = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving]   = useState(false)

  const load = () => {
    setLoading(true)
    API.get('/custom-package/admin/items')
      .then(r => setItems(r.data.items))
      .catch(() => toast.error('Could not load items'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const groups = useMemo(() => Array.from(new Set(items.map(i => i.group).filter(Boolean))), [items])
  const shown = items.filter(i => !search.trim() || i.name.toLowerCase().includes(search.trim().toLowerCase()))

  const openCreate = () => { setEditing(null); setForm(BLANK); setImage(null); setPreview(''); setModal(true) }
  const openEdit = (i: any) => {
    setEditing(i)
    setForm({
      name: i.name, group: i.group || '', unit: i.unit || '', price: i.price, stock: i.stock,
      maxQty: i.maxQty, sortOrder: i.sortOrder || 0, description: i.description || '', isActive: i.isActive,
    })
    setImage(null); setPreview(i.image || ''); setModal(true)
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      if (image) fd.append('image', image)
      if (editing) await API.put(`/custom-package/admin/items/${editing._id}`, fd, multipart)
      else await API.post('/custom-package/admin/items', fd, multipart)
      toast.success(editing ? 'Item updated' : 'Item added')
      setModal(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (i: any) => {
    try { await API.put(`/custom-package/admin/items/${i._id}`, { isActive: !i.isActive }); load() }
    catch { toast.error('Could not update') }
  }

  const remove = async (i: any) => {
    if (!window.confirm(`Delete "${i.name}"? Past orders keep their own record of it.`)) return
    try { await API.delete(`/custom-package/admin/items/${i._id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const f = (key: string) => (e: any) =>
    setForm((p: any) => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-xl text-gray-900">Build Your Own: items</h1>
          <p className="text-sm text-gray-500 mt-0.5">The ingredients customers can choose from when building a custom package.</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus size={15} /> Add Item</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input className="pl-10 h-10 text-sm" placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Item', 'Group', 'Price', 'Stock', 'Max per package', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shown.map(i => (
                  <tr key={i._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {i.image ? <Image src={i.image} alt={i.name} fill sizes="40px" className="object-cover" /> : <Package size={16} className="text-gray-400" />}
                        </div>
                        <span className="font-semibold text-gray-800">{i.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{i.group}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{formatPrice(i.price)} <span className="text-xs font-normal text-gray-400">/ {i.unit}</span></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${i.stock === 0 ? 'bg-red-100 text-red-700' : i.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{i.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{i.maxQty}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(i)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${i.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {i.isActive ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(i)} aria-label="Edit" className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50"><Edit2 size={14} /></button>
                        <button onClick={() => remove(i)} aria-label="Delete" className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {shown.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No items yet. Click Add Item to create the first one.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg text-gray-900">{editing ? 'Edit item' : 'New item'}</h2>
              <button onClick={() => setModal(false)} aria-label="Close" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Label>Item name *</Label><Input value={form.name} onChange={f('name')} required placeholder="e.g. Rice" /></div>
                <div>
                  <Label>Group</Label>
                  <Input list="item-groups" value={form.group} onChange={f('group')} placeholder="e.g. Grains and staples" />
                  <datalist id="item-groups">{groups.map((g: any) => <option key={g} value={g} />)}</datalist>
                </div>
                <div><Label>Unit *</Label><Input value={form.unit} onChange={f('unit')} required placeholder="kg, litre, tin, pack" /></div>
                <div><Label>Price per unit (₦) *</Label><Input type="number" min="0" value={form.price} onChange={f('price')} required /></div>
                <div><Label>Stock (units) *</Label><Input type="number" min="0" value={form.stock} onChange={f('stock')} required /></div>
                <div><Label>Max per package</Label><Input type="number" min="1" value={form.maxQty} onChange={f('maxQty')} /></div>
                <div><Label>Sort order</Label><Input type="number" value={form.sortOrder} onChange={f('sortOrder')} /></div>
                <div className="sm:col-span-2"><Label>Short note (optional)</Label><Textarea rows={2} value={form.description} onChange={f('description')} placeholder="e.g. Long grain, 1kg bag" /></div>
                <div className="sm:col-span-2">
                  <Label>Photo (optional)</Label>
                  <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                    {preview
                      ? <Image src={preview} alt="" width={48} height={48} className="w-12 h-12 rounded-lg object-cover" />
                      : <Upload size={20} className="text-gray-400" />}
                    <span className="text-sm text-gray-500">{preview ? 'Change photo' : 'Upload photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  </label>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="item-active" checked={form.isActive} onChange={f('isActive')} className="w-4 h-4 accent-green-500 rounded" />
                  <label htmlFor="item-active" className="text-sm font-semibold text-gray-700 cursor-pointer">Visible to customers</label>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1 border border-gray-200" onClick={() => setModal(false)}>Cancel</Button>
                <Button type="submit" loading={saving} className="flex-1">{saving ? 'Saving…' : editing ? 'Update' : 'Add item'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
