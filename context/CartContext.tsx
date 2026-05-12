'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  images?: { url: string }[]
  category?: { name: string }
  stock?: number
  slug?: string
}

interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  maxDiscount?: number
}

interface CartContextType {
  items: CartItem[]
  coupon: Coupon | null
  isOpen: boolean
  subtotal: number
  discount: number
  itemCount: number
  setIsOpen: (v: boolean) => void
  addItem: (product: any, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  setCoupon: (c: Coupon | null) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try { const s = localStorage.getItem('pasam_cart'); if (s) setItems(JSON.parse(s)) } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('pasam_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: any, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        const newQty = existing.quantity + qty
        if (product.stock && newQty > product.stock) { toast.error(`Only ${product.stock} in stock`); return prev }
        toast.success('Cart updated!')
        return prev.map(i => i._id === product._id ? { ...i, quantity: newQty } : i)
      }
      toast.success(`${product.name} added!`)
      return [...prev, { ...product, quantity: qty }]
    })
    setIsOpen(true)
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i._id !== id))
    toast('Removed from cart', { icon: '🗑️' })
  }

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return }
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => { setItems([]); setCoupon(null) }

  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount  = coupon
    ? coupon.type === 'percentage'
      ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount ?? Infinity)
      : coupon.value
    : 0
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, coupon, isOpen, subtotal, discount, itemCount, setIsOpen, addItem, removeItem, updateQty, clearCart, setCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
