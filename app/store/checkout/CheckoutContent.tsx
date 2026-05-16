'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Phone, User, CreditCard, CheckCircle, Building, Package } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { orderAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label, Select } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import Image from 'next/image'

const DELIVERY_FEES: Record<string, number> = {
  Lagos: 1500, Abuja: 2000, Ibadan: 1000, 'Port Harcourt': 2500, Kano: 3000
}
const DEFAULT_FEE = 2000
const CITIES = ['Ibadan', 'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ogbomosho', 'Abeokuta', 'Other']

export default function CheckoutContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, subtotal, discount, coupon, clearCart } = useCart()

  const [delivery, setDelivery] = useState({
    fullname: user?.fullname || '', phone: user?.phone || '',
    address: '', city: 'Ibadan', state: 'Oyo', landmark: '', notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    // Only redirect to cart if order hasn't been placed yet
    if (!items.length && !orderPlaced) {
      router.push('/store/cart')
    }
  }, [items, router, orderPlaced])

  if (!items.length && !orderPlaced) return null

  const d = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDelivery(p => ({ ...p, [key]: e.target.value }))

  const fee = DELIVERY_FEES[delivery.city] ?? DEFAULT_FEE
  const total = subtotal + fee - discount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!delivery.address.trim()) return toast.error('Enter your delivery address')
    if (!delivery.phone.trim())   return toast.error('Enter your phone number')

    setLoading(true)
    try {
      const { data } = await orderAPI.create({
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        deliveryInfo: delivery,
        couponCode: coupon?.code || undefined,
        isSubscription: false,
      })

      // Mark order as placed BEFORE clearing cart
      // so the useEffect doesn't redirect to /store/cart
      setOrderPlaced(true)

      // Clear cart
      clearCart()
      toast.success('Order placed successfully!')

      // Build redirect URL safely
      const orderId = data.order?._id || data.order?.id
      const waLink  = data.whatsappLink || ''

      // Redirect to order success page
      router.replace(
        `/store/order-success/${orderId}?wa=${encodeURIComponent(waLink)}`
      )

    } catch (err: any) {
      console.error('Order error:', err)

      // Check if the order actually went through despite the error
      const status = err.response?.status
      const message = err.response?.data?.message || ''

      if (status === undefined) {
        // Network timeout — order may have been created
        toast.error(
          'Network timeout. Check "My Orders" — your order may have been placed.',
          { duration: 6000 }
        )
      } else {
        toast.error(message || 'Order failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-7">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Delivery */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6">
            <h2 className="font-display font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={17} className="text-green-600" /> Delivery Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input className="pl-10" value={delivery.fullname} onChange={d('fullname')} required placeholder="Recipient name" />
                </div>
              </div>
              <div>
                <Label>Phone Number *</Label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input className="pl-10" value={delivery.phone} onChange={d('phone')} required placeholder="08012345678" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label>Street Address *</Label>
                <Input value={delivery.address} onChange={d('address')} required placeholder="House number, street name" />
              </div>
              <div>
                <Label>City *</Label>
                <Select value={delivery.city} onChange={d('city')} required>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label>State *</Label>
                <Input value={delivery.state} onChange={d('state')} required placeholder="e.g. Oyo" />
              </div>
              <div>
                <Label>Nearest Landmark</Label>
                <Input value={delivery.landmark} onChange={d('landmark')} placeholder="e.g. Beside First Bank" />
              </div>
              <div>
                <Label>Delivery Notes</Label>
                <Input value={delivery.notes} onChange={d('notes')} placeholder="Any special instructions" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6">
            <h2 className="font-display font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={17} className="text-green-600" /> Payment Method
            </h2>
            <div className="border-2 border-green-500 bg-green-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <Building size={15} className="text-green-700" />
                  <span className="font-bold text-green-800 text-sm">Bank Transfer</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-sm space-y-1.5">
                <p className="font-bold text-gray-700 mb-2">Transfer payment to:</p>
                {[
                  ['Bank', 'First Bank Nigeria'],
                  ['Account Number', '1234567890'],
                  ['Account Name', 'PASAM Store Ltd'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold font-mono">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-700 mt-2.5 flex items-start gap-1.5">
                <CheckCircle size={13} className="flex-shrink-0 mt-0.5" />
                Use your order number as payment reference. Upload proof after ordering.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6 sticky top-24">
            <h2 className="font-display font-bold text-base text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2.5 mb-5 max-h-52 overflow-y-auto">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.images?.[0]?.url
                      ? <Image src={item.images[0].url} alt="" width={40} height={40} className="w-full h-full object-cover" />
                      : <Package size={16} className="text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery ({delivery.city})</span>
                <span className="font-semibold">{formatPrice(fee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-display font-extrabold text-xl text-green-600">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full">
              <CheckCircle size={16} />
              {loading ? 'Placing Order…' : 'Place Order'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
