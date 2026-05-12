'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, Package } from 'lucide-react'
import { productAPI, categoryAPI } from '@/services/api'
import ProductCard from '@/components/products/ProductCard'
import { Input, Select, Badge, PageLoader } from '@/components/ui/index'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  const searchParams  = useSearchParams()
  const params        = useParams()
  const slug          = params?.slug as string | undefined

  const [products,   setProducts]   = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [total,      setTotal]      = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [search,     setSearch]     = useState(searchParams.get('search') || '')
  const [catFilter,  setCatFilter]  = useState(searchParams.get('category') || '')
  const [sort,       setSort]       = useState(searchParams.get('sort') || '-createdAt')
  const [page,       setPage]       = useState(1)

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories)).catch(console.error)
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        let categoryId = catFilter
        if (slug && !catFilter) {
          const found = categories.find((c: any) => c.slug === slug)
          if (found) categoryId = found._id
        }
        const p: any = { page, limit: 12, sort }
        if (search)     p.search   = search
        if (categoryId) p.category = categoryId
        if (searchParams.get('featured')) p.featured = 'true'

        const { data } = await productAPI.getAll(p)
        setProducts(data.products)
        setTotal(data.total)
        setTotalPages(data.pages)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [search, catFilter, sort, page, slug, categories])

  const activeCategory = categories.find((c: any) =>
    catFilter ? c._id === catFilter : slug ? c.slug === slug : false
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl text-gray-900">
          {activeCategory?.name || (searchParams.get('featured') ? 'Featured Packages' : 'All Products')}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{total} product{total !== 1 ? 's' : ''} found</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input className="pl-10 h-10 text-sm" placeholder="Search products…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <Select className="h-10 text-sm w-auto" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-salesCount">Most Popular</option>
        </Select>
        <Button variant="ghost" size="sm" className="border border-gray-200 gap-1.5"
          onClick={() => setShowFilter(s => !s)}>
          <SlidersHorizontal size={14} /> Filters
          {catFilter && <span className="w-2 h-2 rounded-full bg-green-500" />}
        </Button>
        {(search || catFilter) && (
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 gap-1"
            onClick={() => { setSearch(''); setCatFilter(''); setPage(1) }}>
            <X size={14} /> Clear
          </Button>
        )}
      </div>

      {/* Filter chips */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-full mb-1">Category</span>
          <button onClick={() => { setCatFilter(''); setPage(1) }}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${!catFilter && !slug ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
            All
          </button>
          {categories.map((cat: any) => (
            <button key={cat._id} onClick={() => { setCatFilter(cat._id); setPage(1) }}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${catFilter === cat._id ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Products */}
      {loading ? (
        <PageLoader />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-300" />
          </div>
          <h3 className="font-display font-bold text-lg text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === p ? 'bg-green-500 text-white shadow-[0_4px_10px_rgba(34,197,94,0.35)]' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
