'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Truck, ShieldCheck, Clock, MessageCircle,
  Star, ChevronLeft, ChevronRight, GraduationCap,
  Home, Users, Award, TrendingUp, Package
} from 'lucide-react'
import { productAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/products/ProductCard'
import { formatPrice } from '@/lib/utils'

const TESTIMONIALS = [
  { name: 'Amaka Johnson',   role: 'University Student',   text: 'The student pack is amazing! Feeds me well all week and saves me so much money compared to buying individually.', rating: 5 },
  { name: 'Pastor David Obi',role: 'Church Administrator', text: 'We use PASAM for all our welfare distributions. The bulk order service is professional and always on time.',     rating: 5 },
  { name: 'Mrs. Folake A.',  role: 'Mother of 4',          text: 'The family pack is a lifesaver. Fresh, affordable, and delivered right to my door. Highly recommended!',         rating: 5 },
  { name: 'Emeka Nze',       role: 'Young Professional',   text: 'As a bachelor living alone, the singles pack is perfect. No food waste and great value for money.',              rating: 5 },
]

const CATEGORIES = [
  { slug: 'student-packages', icon: GraduationCap, name: 'Student Packages', desc: 'Budget-friendly packs for students', bg: 'bg-green-50',  border: 'border-green-200',  iconColor: 'text-green-600',  iconBg: 'bg-green-100' },
  { slug: 'singles-packages', icon: Home,          name: 'Singles Package',  desc: 'Perfect for bachelors & workers',   bg: 'bg-orange-50', border: 'border-orange-200', iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
  { slug: 'family-packages',  icon: Users,         name: 'Family Package',   desc: 'Monthly supply for households',     bg: 'bg-yellow-50', border: 'border-yellow-200', iconColor: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  { slug: 'premium-packages', icon: Award,         name: 'Premium / Bulk',   desc: 'Churches, NGOs & organizations',    bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
]

const LOCATIONS = ['Ibadan', 'Ogbomosho', 'Oyo', 'Iseyin', 'Saki', 'Abeokuta', 'Ijebu-Ode', 'Sagamu', 'Lagos', 'Osogbo']

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [tIdx,     setTIdx]     = useState(0)

  useEffect(() => {
    productAPI.getFeatured()
      .then(r => setFeatured(r.data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-70px)] flex items-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-green-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] translate-y-1/4 -translate-x-1/4 rounded-full bg-orange-400/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 py-16 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-5 border border-green-200">
              <TrendingUp size={12} /> Nigeria&apos;s #1 Food Package Store
            </div>
            <h1 className="font-display font-extrabold text-gray-900 leading-[1.1] mb-5" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)' }}>
              Fresh Food Packs<br />
              <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                Delivered Fast
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mb-8">
              Affordable food packages for students, families, singles and organizations.
              Order now and get doorstep delivery across Oyo State and beyond.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Button size="lg" asChild>
                <Link href="/products">Shop Now <ArrowRight size={17} /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/store/bulk-quote">Request Bulk Quote</Link>
              </Button>
            </div>
            <div className="flex gap-8">
              {[['500+', 'Happy Customers'], ['20+', 'Package Options'], ['24hrs', 'Delivery Time']].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display font-extrabold text-2xl text-green-600">{v}</p>
                  <p className="text-xs text-gray-500">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual with icon cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { icon: GraduationCap, label: 'Student Pack',  price: 5500,  color: 'bg-green-50  border-green-200',  iconColor: 'text-green-600' },
              { icon: Users,         label: 'Family Pack',   price: 35000, color: 'bg-yellow-50 border-yellow-200', iconColor: 'text-yellow-600' },
              { icon: Home,          label: 'Singles Pack',  price: 12000, color: 'bg-orange-50 border-orange-200', iconColor: 'text-orange-600' },
              { icon: Award,         label: 'Premium Pack',  price: 120000,color: 'bg-purple-50 border-purple-200', iconColor: 'text-purple-600' },
            ].map((card, i) => (
              <div key={card.label}
                className={`border-2 rounded-2xl p-5 flex flex-col gap-3 animate-float ${card.color}`}
                style={{ animationDelay: `${i * 0.4}s` }}>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <card.icon size={20} className={card.iconColor} />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-gray-800">{card.label}</p>
                  <p className="text-xs font-bold text-green-600">from {formatPrice(card.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature strip ── */}
      <section className="bg-white border-y border-gray-100 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck,          title: 'Fast Delivery',    desc: 'Same-day in Ibadan' },
            { icon: ShieldCheck,    title: 'Fresh & Quality',  desc: 'Quality-checked items' },
            { icon: Clock,          title: 'Easy Ordering',    desc: 'Order in minutes' },
            { icon: MessageCircle,  title: 'WhatsApp Support', desc: 'Quick response' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <f.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-extrabold text-2xl text-gray-900">Shop by Category</h2>
            <Link href="/products" className="flex items-center gap-1 text-green-600 font-semibold text-sm hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/store/categories/${cat.slug}`}
                className={`group p-5 rounded-2xl border-2 ${cat.bg} ${cat.border} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col gap-3`}>
                <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center`}>
                  <cat.icon size={20} className={cat.iconColor} />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-gray-800">{cat.name}</h3>
                  <p className="text-xs text-gray-500 leading-snug mt-0.5">{cat.desc}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm group-hover:translate-x-1 transition-transform mt-auto">
                  <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-extrabold text-2xl text-gray-900">Featured Packages</h2>
            <Link href="/products?featured=true" className="flex items-center gap-1 text-green-600 font-semibold text-sm hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Products coming soon!</p>
              <Button asChild variant="outline"><Link href="/products">Browse All</Link></Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Bulk CTA ── */}
      <section className="py-16 bg-gradient-to-r from-green-700 to-green-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-display font-extrabold text-white text-2xl lg:text-3xl mb-3">
                Churches, NGOs &amp; Organizations
              </h2>
              <p className="text-green-100 leading-relaxed mb-6">
                Need food packages in bulk? We handle welfare distributions, events, and monthly supply for organizations. Get a custom quote today.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white text-green-700 hover:bg-green-50 shadow-none" asChild>
                  <Link href="/store/bulk-quote">Get Free Quote</Link>
                </Button>
                <Button variant="outline" className="border-white/60 text-white hover:bg-white/10" asChild>
                  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '2348012345678'}`} target="_blank" rel="noreferrer">
                    <MessageCircle size={16} /> WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3 opacity-80">
              {[
                { icon: Users,  label: 'Churches' },
                { icon: Award,  label: 'NGOs' },
                { icon: Package,label: 'Events' },
                { icon: ShieldCheck, label: 'Welfare' },
              ].map(item => (
                <div key={item.label} className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
                  <item.icon size={24} className="text-white mx-auto mb-1.5" />
                  <p className="text-white text-xs font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-2xl text-gray-900 text-center mb-10">
            What Customers Say
          </h2>
          <div className="flex items-center gap-4 max-w-xl mx-auto">
            <button onClick={() => setTIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex-shrink-0">
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 bg-white rounded-3xl p-7 shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] border border-gray-100 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <span className="font-display font-extrabold text-green-700 text-lg">
                  {TESTIMONIALS[tIdx].name.charAt(0)}
                </span>
              </div>
              <div className="flex justify-center gap-0.5 mb-4">
                {Array.from({ length: TESTIMONIALS[tIdx].rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#f97316" className="text-orange-400" />
                ))}
              </div>
              <p className="text-gray-600 italic text-sm leading-relaxed mb-4">
                &ldquo;{TESTIMONIALS[tIdx].text}&rdquo;
              </p>
              <p className="font-bold text-gray-800 text-sm">{TESTIMONIALS[tIdx].name}</p>
              <p className="text-orange-500 text-xs font-semibold">{TESTIMONIALS[tIdx].role}</p>
            </div>
            <button onClick={() => setTIdx(i => (i + 1) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex-shrink-0">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTIdx(i)}
                className={`h-2 rounded-full transition-all ${i === tIdx ? 'bg-green-500 w-6' : 'bg-gray-300 w-2'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Delivery Locations ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-2xl text-gray-900 text-center mb-6 flex items-center justify-center gap-2">
            <MapPinIcon /> Delivery Locations
          </h2>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {LOCATIONS.map(loc => (
              <span key={loc} className="px-4 py-2 bg-white border-2 border-green-200 text-green-700 text-sm font-semibold rounded-full hover:bg-green-50 transition-colors cursor-default">
                {loc}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Don&apos;t see your area?{' '}
            <a href="https://wa.me/2348012345678" className="text-green-600 font-semibold hover:underline">
              Contact us
            </a>{' '}
            — we may still deliver!
          </p>
        </div>
      </section>
    </div>
  )
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
