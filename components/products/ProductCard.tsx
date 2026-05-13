'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Package, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

interface Product {
  _id: string
  name: string
  slug: string
  shortDescription?: string
  price: number
  originalPrice?: number
  images?: { url: string }[]
  category?: { name: string }
  stock: number
  isFeatured?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const image = product.images?.[0]?.url

  const href = `/products/${product.slug}`

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="group bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">

      {/* IMAGE */}
      <Link href={href} className="relative block aspect-square overflow-hidden bg-gray-50">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-gray-300" />
          </div>
        )}

        {/* DISCOUNT */}
        {discount && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        {/* FEATURED */}
        {product.isFeatured && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star size={10} /> Featured
          </span>
        )}

        {/* OUT OF STOCK */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* INFO */}
      <div className="p-3 flex flex-col flex-1">

        {/* CATEGORY */}
        {product.category?.name && (
          <span className="text-xs font-bold text-orange-500 uppercase mb-1">
            {product.category.name}
          </span>
        )}

        {/* NAME */}
        <Link href={href}>
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-green-600">
            {product.name}
          </h3>
        </Link>

        {/* DESCRIPTION */}
        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2 flex-1 mt-1">
            {product.shortDescription}
          </p>
        )}

        {/* PRICE + CART */}
        <div className="flex items-center justify-between mt-3">

          <div>
            <span className="font-bold text-green-600">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice && (
              <s className="text-xs text-gray-400 ml-1">
                {formatPrice(product.originalPrice)}
              </s>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center hover:scale-110 transition disabled:bg-gray-300"
          >
            <ShoppingCart size={15} />
          </button>

        </div>
      </div>
    </div>
  )
}