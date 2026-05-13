'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Package } from 'lucide-react'
import { productAPI, categoryAPI } from '@/services/api'
import ProductCard from '@/components/products/ProductCard'
import { PageLoader } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()

  const [products,   setProducts]   = useState<any[]>([])
  const [category,   setCategory]   = useState<any>(null)
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total,      setTotal]      = useState(0)
  const [sort,       setSort]       = useState('-createdAt')

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      setLoading(true)
      try {
        const catRes = await categoryAPI.getAll()
        const found  = catRes.data.categories.find((c: any) => c.slug === slug)
        setCategory(found || null)
        if (found) {
          const prodRes = await productAPI.getAll({ category: found._id, page, limit: 12, sort })
          setProducts(prodRes.data.products)
          setTotal(prodRes.data.total)
          setTotalPages(prodRes.data.pages)
        } else {
          setProducts([])
          setTotal(0)
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [slug, page, sort])

  if (loading) return <PageLoader />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-7">
        <Link href="/products" className="text-sm text-green-600 hover:underline font-medium">
          ← All Products
        </Link>
        <h1 className="font-display font-extrabold text-2xl text-gray-900 mt-2">
          {category?.name || (slug as string)?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
        </h1>
        {category?.description && (
          <p className="text-gray-500 text-sm mt-1">{category.description}</p>
        )}
        <p className="text-gray-400 text-sm mt-1">{total} product{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-500 font-medium">Sort by:</span>
        {[
          { label: 'Newest',   value: '-createdAt' },
          { label: 'Price ↑', value: 'price' },
          { label: 'Price ↓', value: '-price' },
          { label: 'Popular', value: '-salesCount' },
        ].map(opt => (
          <button key={opt.value} onClick={() => { setSort(opt.value); setPage(1) }}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              sort === opt.value
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-300" />
          </div>
          <h3 className="font-display font-bold text-lg text-gray-700 mb-2">No products yet</h3>
          <p className="text-gray-500 text-sm mb-5">
            This category has no products yet. Check back soon!
          </p>
          <Button asChild variant="outline">
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                page === p
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}