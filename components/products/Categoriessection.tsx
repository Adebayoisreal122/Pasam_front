'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Tag, GraduationCap, Home, Users, Award, Star, Package, ShoppingBag,
  Utensils, Wheat, Apple, Heart, Gift, Truck, Building2, Briefcase, Baby,
  type LucideIcon,
} from 'lucide-react'
import { categoryAPI } from '@/services/api'

interface Category {
  _id: string
  name: string
  slug?: string
  description?: string
  icon?: string
  image?: string
  color?: string
}

// Admin types an icon name (for example "graduation-cap") in the category form.
// Add more icons here any time.
const ICONS: Record<string, LucideIcon> = {
  'graduation-cap': GraduationCap, home: Home, users: Users, award: Award, star: Star,
  package: Package, 'shopping-bag': ShoppingBag, utensils: Utensils, wheat: Wheat,
  apple: Apple, heart: Heart, gift: Gift, truck: Truck, 'building-2': Building2,
  building2: Building2, briefcase: Briefcase, baby: Baby, tag: Tag,
}

const resolveIcon = (name?: string): LucideIcon => {
  if (!name) return Package
  const key = name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // GraduationCap -> Graduation-Cap
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
  return ICONS[key] || Package // emojis and unknown names fall back to a package icon
}

const safeColor = (c?: string) => (c && /^#[0-9a-f]{6}$/i.test(c) ? c : '#22c55e')

function CategoryCard({ cat }: { cat: Category }) {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = resolveIcon(cat.icon)
  const color = safeColor(cat.color)
  const href = cat.slug ? `/store/categories/${cat.slug}` : `/store/products?category=${cat._id}`
  const hasImage = !!cat.image && !imgFailed

  // With a photo: image card with the name over it
  if (hasImage) {
    return (
      <Link
        href={href}
        className="group relative block aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      >
        <Image
          src={cat.image as string}
          alt={cat.name}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgFailed(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display font-extrabold text-sm sm:text-base text-white leading-tight">{cat.name}</h3>
            {cat.description && (
              <p className="hidden sm:block text-xs text-white/80 leading-snug mt-1 line-clamp-2">{cat.description}</p>
            )}
          </div>
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    )
  }

  // No photo: icon card tinted with the category's colour
  return (
    <Link
      href={href}
      className="group aspect-[4/3] rounded-2xl border-2 p-4 flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      style={{ backgroundColor: `${color}14`, borderColor: `${color}40` }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}26` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-extrabold text-sm sm:text-base text-gray-800 leading-tight">{cat.name}</h3>
          {cat.description && (
            <p className="text-xs text-gray-500 leading-snug mt-1 line-clamp-2">{cat.description}</p>
          )}
        </div>
        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryAPI
      .getAll()
      .then(r => setCategories(r.data.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Nothing to show (no categories yet, or the request failed): hide the section
  if (!loading && categories.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-extrabold text-2xl text-gray-900">Shop by Category</h2>
          <Link href="/store/products" className="flex items-center gap-1 text-green-600 font-semibold text-sm hover:gap-2 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-100 animate-pulse" />
              ))
            : categories.map(cat => <CategoryCard key={cat._id} cat={cat} />)}
        </div>
      </div>
    </section>
  )
}