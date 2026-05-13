'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Package } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { couponAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'

const DELIVERY_FEE = 2000

export default function CartPage() {
  const { items, subtotal, discount, itemCount, coupon, updateQty, removeItem, setCoupon } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [couponCode, setCouponCode] = useState('')
  const [applying, setApplying] = useState(false)

  const total = subtotal + DELIVERY_FEE - discount

  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error('Enter a coupon code')
    setApplying(true)
    try {
      const { data } = await couponAPI.validate({ code: couponCode, orderAmount: subtotal })
      setCoupon({ ...data.coupon, maxDiscount: data.coupon.maxDiscount })
      toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
    } finally { setApplying(false) }
  }

  const removeCoupon = () => { setCoupon(null); setCouponCode(''); toast('Coupon removed') }

  if (!items.length) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
        <ShoppingBag size={40} className="text-gray-300" />
      </div>
      <h2 className="font-display font-extrabold text-2xl text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
      <Button asChild><Link href="/store/products">Browse Products</Link></Button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-6">
        Shopping Cart <span className="text-gray-400 text-lg font-normal">({itemCount} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-4 flex gap-4 items-start">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
                {item.images?.[0]?.url
                  ? <Image src={item.images[0].url} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                  : <Package size={28} className="text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/store/products/${item.slug||item._id}`}
                  className="font-semibold text-gray-800 hover:text-green-600 transition-colors line-clamp-2 leading-snug text-sm">
                  {item.name}
                </Link>
                {item.category?.name && <p className="text-xs text-orange-500 font-semibold mt-0.5">{item.category.name}</p>}
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                    <button onClick={() => updateQty(item._id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm">
                      <Minus size={11} />
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm">
                      <Plus size={11} />
                    </button>
                  </div>
                  <span className="font-display font-extrabold text-green-600">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item._id)}
                className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6 sticky top-24">
            <h2 className="font-display font-bold text-base text-gray-800 mb-5">Order Summary</h2>

            {/* Coupon */}
            {!coupon ? (
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input className="pl-9 h-10 text-sm" placeholder="Coupon code"
                    value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0" onClick={applyCoupon} disabled={applying}>
                  {applying ? <span className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" /> : 'Apply'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5 mb-5">
                <div className="flex items-center gap-2 text-green-700">
                  <Tag size={14} />
                  <span className="text-sm font-bold">{coupon.code}</span>
                </div>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline font-semibold">Remove</button>
              </div>
            )}

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span className="font-semibold text-gray-800">{formatPrice(DELIVERY_FEE)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-semibold">-{formatPrice(discount)}</span></div>}
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-display font-extrabold text-xl text-green-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Button className="w-full" onClick={() => router.push(isAuthenticated ? '/store/checkout' : '/auth/login?redirect=/store/checkout')}>
              Proceed to Checkout <ArrowRight size={15} />
            </Button>
            <Link href="/store/products"
              className="flex items-center justify-center gap-1.5 mt-3 text-sm text-gray-500 hover:text-green-600 transition-colors">
              <ShoppingBag size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
