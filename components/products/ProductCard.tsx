'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Package, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Badge } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'

interface Product {
  _id: string
  name: string
  slug?: string
  description?: string
  shortDescription?: string
  price: number
  originalPrice?: number
  images?: { url: string; public_id?: string }[]
  category?: { name: string; slug?: string }
  stock: number
  isFeatured?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const image    = product.images?.[0]?.url
  const href     = `/store/products/${product.slug || product._id}`
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="group bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={href} className="relative block aspect-square overflow-hidden bg-gray-50">
        {image ? (
          <Image
            src={image} alt={product.name} fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
            <Package size={40} className="text-gray-300" />
          </div>
        )}

        {/* Badges */}
        {discount && (
          <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-2.5 right-2.5 bg-black/55 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
            <Star size={9} fill="currentColor" /> Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-bold text-sm">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3.5 flex-1 flex flex-col">
        {product.category?.name && (
          <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wide mb-1">
            {product.category.name}
          </span>
        )}
        <Link href={href}>
          <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 hover:text-green-600 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-2">{product.shortDescription}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-green-600 text-base">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <s className="text-gray-400 text-xs">{formatPrice(product.originalPrice)}</s>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-green-500 text-white flex items-center justify-center shadow-[0_4px_10px_rgba(22,163,74,0.35)] hover:scale-110 hover:shadow-[0_6px_14px_rgba(22,163,74,0.45)] transition-all disabled:bg-gray-300 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed">
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
