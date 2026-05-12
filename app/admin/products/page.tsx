'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, Search, Package, X, Upload, Star } from 'lucide-react'
import { productAPI, categoryAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea, PageLoader } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

const BLANK = { name:'', description:'', shortDescription:'', category:'', price:'', originalPrice:'', stock:'', targetAudience:'all', weight:'', isFeatured:false, isSubscribable:false, tags:'', contents:'', minOrderQty:1 }

export default function AdminProductsPage() {
  const [products,   setProducts]   = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [editing,    setEditing]    = useState<any>(null)
  const [form,       setForm]       = useState<any>(BLANK)
  const [images,     setImages]     = useState<File[]>([])
  const [previews,   setPreviews]   = useState<string[]>([])
  const [saving,     setSaving]     = useState(false)
  const [search,     setSearch]     = useState('')
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = async () => {
    setLoading(true)
    try {
      const [pRes, cRes] = await Promise.all([productAPI.getAll({ page, limit:15, search }), categoryAPI.getAll()])
      setProducts(pRes.data.products); setTotalPages(pRes.data.pages); setCategories(cRes.data.categories)
    } catch { toast.error('Load failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, search])

  const openCreate = () => { setEditing(null); setForm(BLANK); setImages([]); setPreviews([]); setModal(true) }
  const openEdit   = (p: any) => {
    setEditing(p)
    setForm({ name:p.name, description:p.description, shortDescription:p.shortDescription||'', category:p.category?._id||'', price:p.price, originalPrice:p.originalPrice||'', stock:p.stock, targetAudience:p.targetAudience||'all', weight:p.weight||'', isFeatured:p.isFeatured, isSubscribable:p.isSubscribable, tags:p.tags?.join(', ')||'', contents:p.contents?.join('\n')||'', minOrderQty:p.minOrderQty||1 })
    setImages([]); setPreviews([]); setModal(true)
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files); setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]: any) => {
        if (k === 'tags')     fd.append(k, JSON.stringify(String(v).split(',').map((s:string)=>s.trim()).filter(Boolean)))
        else if (k==='contents') fd.append(k, JSON.stringify(String(v).split('\n').map((s:string)=>s.trim()).filter(Boolean)))
        else fd.append(k, v)
      })
      images.forEach(img => fd.append('images', img))
      editing ? await productAPI.update(editing._id, fd) : await productAPI.create(fd)
      toast.success(editing ? 'Product updated!' : 'Product created!'); setModal(false); load()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try { await productAPI.delete(id); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const f = (key: string) => (e: any) => setForm((p: any) => ({ ...p, [key]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-xl text-gray-900">Products</h1>
        <Button onClick={openCreate} size="sm"><Plus size={15} /> Add Product</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input className="pl-10 h-10 text-sm" placeholder="Search products…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Product','Category','Price','Stock','Featured','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {p.images?.[0]?.url
                            ? <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                            : <Package size={16} className="text-gray-400" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{p.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{p.category?.name || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-green-600">{formatPrice(p.price)}</span>
                      {p.originalPrice && <s className="text-xs text-gray-400 ml-1">{formatPrice(p.originalPrice)}</s>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.stock===0 ? 'bg-red-100 text-red-700' : p.stock<10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.isFeatured ? <Star size={15} className="text-yellow-400 fill-yellow-400 mx-auto" /> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No products found</td></tr>}
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg text-gray-900">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Label>Product Name *</Label><Input value={form.name} onChange={f('name')} required /></div>
                <div><Label>Category *</Label>
                  <Select value={form.category} onChange={f('category')} required>
                    <option value="">Select category…</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </Select>
                </div>
                <div><Label>Target Audience</Label>
                  <Select value={form.targetAudience} onChange={f('targetAudience')}>
                    {['all','student','singles','family','premium'].map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
                  </Select>
                </div>
                <div><Label>Price (₦) *</Label><Input type="number" value={form.price} onChange={f('price')} required min="0" /></div>
                <div><Label>Original Price (₦)</Label><Input type="number" value={form.originalPrice} onChange={f('originalPrice')} min="0" /></div>
                <div><Label>Stock *</Label><Input type="number" value={form.stock} onChange={f('stock')} required min="0" /></div>
                <div><Label>Weight / Size</Label><Input value={form.weight} onChange={f('weight')} placeholder="e.g. 5kg" /></div>
                <div className="sm:col-span-2"><Label>Short Description</Label><Input value={form.shortDescription} onChange={f('shortDescription')} /></div>
                <div className="sm:col-span-2"><Label>Full Description *</Label><Textarea rows={3} value={form.description} onChange={f('description')} required /></div>
                <div className="sm:col-span-2"><Label>Package Contents (one per line)</Label><Textarea rows={3} value={form.contents} onChange={f('contents')} placeholder={"2kg Rice\n1kg Beans\n1 Vegetable oil"} /></div>
                <div className="sm:col-span-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={f('tags')} placeholder="budget, student, weekly" /></div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={f('isFeatured')} className="w-4 h-4 accent-green-500 rounded" />
                  <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">Featured Product</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="sub" checked={form.isSubscribable} onChange={f('isSubscribable')} className="w-4 h-4 accent-green-500 rounded" />
                  <label htmlFor="sub" className="text-sm font-semibold text-gray-700 cursor-pointer">Subscription Available</label>
                </div>
                <div className="sm:col-span-2">
                  <Label>Product Images</Label>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                    <Upload size={22} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload images (max 5)</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                  </label>
                  {previews.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {previews.map((p, i) => (
                        <Image key={i} src={p} alt="" width={56} height={56} className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1 border border-gray-200" onClick={() => setModal(false)}>Cancel</Button>
                <Button type="submit" loading={saving} className="flex-1">{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
