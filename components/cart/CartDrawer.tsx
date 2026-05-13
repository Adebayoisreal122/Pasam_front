'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, subtotal, itemCount, updateQty, removeItem } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    setIsOpen(false)
    router.push(isAuthenticated ? '/store/checkout' : '/auth/login?redirect=/store/checkout')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] animate-fade-in"
          onClick={() => setIsOpen(false)} />
      )}

      <div className={cn(
        'fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[110] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 font-display font-bold text-gray-800">
            <ShoppingBag size={19} className="text-green-600" />
            <span>My Cart</span>
            {itemCount > 0 && (
              <span className="w-5 h-5 bg-green-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add products to get started</p>
            </div>
            <Button size="sm" asChild onClick={() => setIsOpen(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {items.map(item => (
                <div key={item._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {item.images?.[0]?.url ? (
                      <Image src={item.images[0].url} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={22} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm font-bold text-green-600 mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 bg-gray-100 rounded-full px-2 py-0.5 w-fit">
                      <button onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm">
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm">
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item._id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Subtotal</span>
                <span className="font-display font-extrabold text-green-600 text-lg">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-gray-400">Delivery fee calculated at checkout</p>
              <Button className="w-full" onClick={handleCheckout}>
                Checkout <ArrowRight size={15} />
              </Button>
              <Link href="/store/cart" onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-gray-500 hover:text-green-600 font-medium transition-colors">
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
