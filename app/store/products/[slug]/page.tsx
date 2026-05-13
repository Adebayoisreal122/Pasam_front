'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ShoppingCart, Plus, Minus, MessageCircle, CheckCircle, Package, ArrowLeft, Tag } from 'lucide-react'
import { productAPI } from '@/services/api'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/ui/index'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
const { slug } = useParams<{ slug: string }>()
  const { addItem }= useCart()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qty,     setQty]     = useState(1)
  const [imgIdx,  setImgIdx]  = useState(0)

  useEffect(() => {
    if (!slug) return

    setLoading(true)

    productAPI.getBySlug(slug)
      .then(res => setProduct(res.data.product))
      .catch(console.error)
      .finally(() => setLoading(false))

  }, [slug])

  if (loading) return <PageLoader />
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>

  const images = product.images?.length ? product.images : []
  const WA = process.env.NEXT_PUBLIC_WHATSAPP || '2348012345678'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/store/products" className="flex items-center gap-1.5 text-sm text-green-600 font-semibold hover:underline mb-6">
        <ArrowLeft size={14} /> Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 relative">
            {images[imgIdx]?.url ? (
              <Image src={images[imgIdx].url} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={64} className="text-gray-300" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img: any, i: number) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all relative ${i===imgIdx ? 'border-green-500' : 'border-gray-200'}`}>
                  <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category?.name && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 mb-3">
              <Tag size={11} /> {product.category.name}
            </span>
          )}
          <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-display font-extrabold text-3xl text-green-600">{formatPrice(product.price)}</span>
            {product.originalPrice && <s className="text-gray-400 text-lg">{formatPrice(product.originalPrice)}</s>}
          </div>
          <p className="text-gray-600 leading-relaxed mb-5">{product.description}</p>

          {product.contents?.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-4 mb-5">
              <p className="font-bold text-green-800 text-sm mb-2">Package Contents:</p>
              <ul className="space-y-1">
                {product.contents.map((c: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle size={13} className="flex-shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4 text-sm">
            <Package size={14} className="text-gray-400" />
            {product.stock > 0
              ? <span className="text-green-600 font-semibold">{product.stock} in stock</span>
              : <span className="text-red-500 font-semibold">Out of stock</span>}
            {product.weight && <span className="text-gray-400">· {product.weight}</span>}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                <button onClick={() => setQty(q => Math.max(1, q-1))}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm">
                  <Minus size={13} />
                </button>
                <span className="font-bold w-7 text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm">
                  <Plus size={13} />
                </button>
              </div>
              <Button className="flex-1" onClick={() => { addItem(product, qty); toast.success(`${product.name} added to cart!`) }}>
                <ShoppingCart size={16} /> Add to Cart
              </Button>
            </div>
          )}

          <Button variant="whatsapp" className="w-full" asChild>
            <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'd like to order: ${product.name}`)}`} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> Order via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
