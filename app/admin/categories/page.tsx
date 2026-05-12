'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, X, Upload, Tag } from 'lucide-react'
import { categoryAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea, PageLoader } from '@/components/ui/index'
import toast from 'react-hot-toast'

const BLANK = { name:'', description:'', icon:'', color:'#22c55e', isBulkOnly:false, sortOrder:0 }

export default function CategoriesPage() {
  const [cats,    setCats]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form,    setForm]    = useState<any>(BLANK)
  const [image,   setImage]   = useState<File|null>(null)
  const [preview, setPreview] = useState('')
  const [saving,  setSaving]  = useState(false)

  const load = () => { setLoading(true); categoryAPI.getAll().then(r => setCats(r.data.categories)).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(BLANK); setImage(null); setPreview(''); setModal(true) }
  const openEdit   = (c: any) => { setEditing(c); setForm({ name:c.name, description:c.description||'', icon:c.icon||'', color:c.color||'#22c55e', isBulkOnly:c.isBulkOnly, sortOrder:c.sortOrder||0 }); setImage(null); setPreview(c.image||''); setModal(true) }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData(); Object.entries(form).forEach(([k,v]) => fd.append(k, String(v))); if (image) fd.append('image', image)
      editing ? await categoryAPI.update(editing._id, fd) : await categoryAPI.create(fd)
      toast.success(editing ? 'Updated!' : 'Created!'); setModal(false); load()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try { await categoryAPI.delete(id); toast.success('Deleted'); load() } catch { toast.error('Failed') }
  }

  const f = (key: string) => (e: any) => setForm((p: any) => ({ ...p, [key]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-xl text-gray-900">Categories</h1>
        <Button onClick={openCreate} size="sm"><Plus size={15} /> Add Category</Button>
      </div>

      {loading ? <PageLoader /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cats.map(cat => (
            <div key={cat._id} className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5 group relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: (cat.color||'#22c55e')+'20' }}>
                    {cat.image
                      ? <Image src={cat.image} alt={cat.name} width={48} height={48} className="w-full h-full object-cover" />
                      : <Tag size={22} style={{ color: cat.color||'#22c55e' }} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-500">{cat.isBulkOnly ? 'Bulk Only' : 'All orders'}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(cat._id, cat.name)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{cat.description || 'No description'}</p>
              <div className="mt-2 w-3 h-3 rounded-full inline-block border border-white shadow-sm" style={{ background: cat.color||'#22c55e' }} />
            </div>
          ))}
          {cats.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No categories yet</div>}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg text-gray-900">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={f('name')} required /></div>
              <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={f('description')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Icon (Lucide name or text)</Label><Input value={form.icon} onChange={f('icon')} placeholder="e.g. graduation-cap" /></div>
                <div>
                  <Label>Brand Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" className="w-12 h-11 rounded-xl border-2 border-gray-200 cursor-pointer p-1" value={form.color} onChange={f('color')} />
                    <Input value={form.color} onChange={f('color')} className="flex-1 text-sm font-mono" />
                  </div>
                </div>
              </div>
              <div>
                <Label>Category Image</Label>
                <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                  {preview
                    ? <Image src={preview} alt="" width={48} height={48} className="w-12 h-12 rounded-lg object-cover" />
                    : <Upload size={20} className="text-gray-400" />}
                  <span className="text-sm text-gray-500">{preview ? 'Change image' : 'Upload image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="bulkOnly" checked={form.isBulkOnly} onChange={f('isBulkOnly')} className="w-4 h-4 accent-green-500 rounded" />
                <label htmlFor="bulkOnly" className="text-sm font-semibold text-gray-700 cursor-pointer">Bulk orders only (Premium)</label>
              </div>
              <div className="flex gap-3 pt-1">
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
