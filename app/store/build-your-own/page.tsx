'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Search, Package, ShoppingCart, Trash2, Puzzle, Info } from 'lucide-react'
import API from '@/services/api'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Input, PageLoader } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PkgItem {
  _id: string
  name: string
  group: string
  unit: string
  price: number
  stock: number
  maxQty: number
  description?: string
  image?: string
}

const limitFor = (i: PkgItem) => Math.max(0, Math.min(i.maxQty, i.stock))

function ItemCard({ item, qty, onChange }: { item: PkgItem; qty: number; onChange: (delta: number) => void }) {
  const soldOut = item.stock <= 0
  const atLimit = qty >= limitFor(item)
  return (
    <div className={`bg-white rounded-2xl border-2 p-3 flex gap-3 transition-colors ${qty > 0 ? 'border-green-500' : 'border-gray-100'} ${soldOut ? 'opacity-60' : ''}`}>
      <div className="relative w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {item.image
          ? <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
          : <Package size={22} className="text-gray-300" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
        <p className="text-sm font-bold text-green-600">
          {formatPrice(item.price)} <span className="text-xs font-normal text-gray-400">/ {item.unit}</span>
        </p>
        {soldOut && <p className="text-xs text-red-500 font-semibold mt-0.5">Sold out</p>}
        {!soldOut && item.stock <= 5 && <p className="text-xs text-orange-500 mt-0.5">Only {item.stock} left</p>}
        <div className="flex items-center gap-2 mt-2 bg-gray-100 rounded-full px-2 py-0.5 w-fit">
          <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => onChange(-1)} disabled={qty === 0}
            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600">
            <Minus size={12} />
          </button>
          <span className="text-sm font-bold w-6 text-center">{qty}</span>
          <button type="button" aria-label={`Add one ${item.name}`} onClick={() => onChange(1)} disabled={soldOut || atLimit}
            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600">
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BuildYourOwnPage() {
  const { addItem } = useCart()
  const [items, setItems]       = useState<PkgItem[]>([])
  const [minTotal, setMinTotal] = useState(5000)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [qty, setQty]           = useState<Record<string, number>>({})
  const [query, setQuery]       = useState('')
  const [group, setGroup]       = useState('All')
  const [label, setLabel]       = useState('')

  useEffect(() => {
    API.get('/custom-package/items')
      .then(r => {
        setItems(r.data.items || [])
        setMinTotal(r.data.rules?.minTotal || 5000)
      })
      .catch(() => setError('Could not load the items. Please refresh the page.'))
      .finally(() => setLoading(false))
  }, [])

  const change = (item: PkgItem, delta: number) =>
    setQty(q => {
      const next = Math.max(0, Math.min(limitFor(item), (q[item._id] || 0) + delta))
      const copy = { ...q }
      if (next === 0) delete copy[item._id]
      else copy[item._id] = next
      return copy
    })

  const groups = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.group)))], [items])

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const map = new Map<string, PkgItem[]>()
    items
      .filter(i => (group === 'All' || i.group === group) && (!q || i.name.toLowerCase().includes(q)))
      .forEach(i => map.set(i.group, [...(map.get(i.group) || []), i]))
    return Array.from(map.entries())
  }, [items, group, query])

  const selected  = items.filter(i => (qty[i._id] || 0) > 0)
  const subtotal  = selected.reduce((s, i) => s + i.price * qty[i._id], 0)
  const remaining = Math.max(0, minTotal - subtotal)
  const canAdd    = selected.length > 0 && subtotal >= minTotal
  const progress  = Math.min(100, Math.round((subtotal / minTotal) * 100))

  const addToCart = () => {
    if (!canAdd) {
      toast.error(selected.length ? `Add ${formatPrice(remaining)} more to reach the minimum` : 'Pick at least one item first')
      return
    }
    const cleanLabel = label.trim()
    addItem({
      _id: `custom_${Date.now()}`,
      name: cleanLabel || `Custom Package (${selected.length} item${selected.length === 1 ? '' : 's'})`,
      label: cleanLabel || undefined,
      price: subtotal,
      images: [],
      category: { name: 'Custom package' },
      isCustom: true,
      customItems: selected.map(i => ({
        itemId: i._id, name: i.name, unit: i.unit, price: i.price, quantity: qty[i._id],
      })),
    }, 1)
    setQty({})
    setLabel('')
  }

  if (loading) return <PageLoader />

  const summary = (
    <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-5">
      <h2 className="font-display font-bold text-base text-gray-800 mb-3">Your package</h2>

      {selected.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">Nothing yet. Add items from the list.</p>
      ) : (
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
          {selected.map(i => (
            <div key={i._id} className="flex items-center gap-2 text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-700 truncate">{i.name}</p>
                <p className="text-xs text-gray-400">{qty[i._id]} {i.unit} x {formatPrice(i.price)}</p>
              </div>
              <span className="font-bold text-gray-700 flex-shrink-0">{formatPrice(i.price * qty[i._id])}</span>
              <button type="button" aria-label={`Remove ${i.name}`} onClick={() => change(i, -qty[i._id])}
                className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="font-semibold text-gray-700">Package price</span>
        <span className="font-display font-extrabold text-xl text-green-600">{formatPrice(subtotal)}</span>
      </div>

      <div className="mt-3">
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${canAdd ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: `${progress}%` }} />
        </div>
        <p className={`text-xs mt-1.5 ${canAdd ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
          {canAdd
            ? 'Minimum reached. You can add this to your cart.'
            : `Minimum package value is ${formatPrice(minTotal)}. Add ${formatPrice(remaining)} more.`}
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="pkg-label" className="block text-xs font-semibold text-gray-600 mb-1">Name your package (optional)</label>
        <Input id="pkg-label" className="h-10 text-sm" maxLength={40} placeholder="e.g. Mum's monthly pack"
          value={label} onChange={e => setLabel(e.target.value)} />
      </div>

      <Button className="w-full mt-4" onClick={addToCart} disabled={!canAdd}>
        <ShoppingCart size={16} /> Add to cart
      </Button>
      <p className="flex items-start gap-1.5 text-xs text-gray-400 mt-3">
        <Info size={13} className="flex-shrink-0 mt-0.5" />
        Delivery fee is added at checkout. The final price is confirmed when you place your order.
      </p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-10">
      <div className="mb-6 flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Puzzle size={22} className="text-orange-600" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-gray-900">Build your own package</h1>
          <p className="text-gray-500 text-sm mt-1">Choose exactly what you need. Your price updates as you go, and we pack and deliver it.</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-5">{error}</div>}

      {!error && items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-300" />
          </div>
          <h3 className="font-display font-bold text-lg text-gray-700 mb-1">Nothing to pick from yet</h3>
          <p className="text-gray-500 text-sm">Custom packages will be available soon. Please check back.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-3 items-center mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input className="pl-10 h-10 text-sm" placeholder="Search items…" value={query} onChange={e => setQuery(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                {groups.map(g => (
                  <button key={g} type="button" onClick={() => setGroup(g)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${group === g ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {grouped.length === 0 ? (
              <p className="text-center text-gray-400 py-12 text-sm">No items match your search.</p>
            ) : grouped.map(([name, list]) => (
              <section key={name} className="mb-7">
                <h2 className="font-display font-bold text-sm text-gray-500 uppercase tracking-wide mb-3">{name}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {list.map(i => <ItemCard key={i._id} item={i} qty={qty[i._id] || 0} onChange={d => change(i, d)} />)}
                </div>
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 self-start">{summary}</aside>
        </div>
      )}

      {/* Mobile bottom bar */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">
              {selected.length === 0 ? 'No items yet' : canAdd ? `${selected.length} item${selected.length === 1 ? '' : 's'}` : `Add ${formatPrice(remaining)} more`}
            </p>
            <p className="font-display font-extrabold text-green-600">{formatPrice(subtotal)}</p>
          </div>
          <Button onClick={addToCart} disabled={!canAdd}><ShoppingCart size={16} /> Add to cart</Button>
        </div>
      )}
    </div>
  )
}
