'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Truck, ShieldCheck, Clock, MessageCircle,
  Star, ChevronLeft, ChevronRight, GraduationCap,
  Home, Users, Award, TrendingUp, Package
} from 'lucide-react'
import InstallBanner from '@/components/pwa/InstallBanner'
import { productAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/products/ProductCard'
   import CategoriesSection from '@/components/products/Categoriessection'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import BuildYourOwnBanner from '@/components/products/BuildYourOwnBanner'

const TESTIMONIALS = [
  { name: 'Amaka Johnson',   role: 'University Student',   text: 'The student pack is amazing! Feeds me well all week and saves me so much money compared to buying individually.', rating: 5 },
  { name: 'Pastor David Obi',role: 'Church Administrator', text: 'We use PASAM for all our welfare distributions. The bulk order service is professional and always on time.',     rating: 5 },
  { name: 'Mrs. Folake A.',  role: 'Mother of 4',          text: 'The family pack is a lifesaver. Fresh, affordable, and delivered right to my door. Highly recommended!',         rating: 5 },
  { name: 'Emeka Nze',       role: 'Young Professional',   text: 'As a bachelor living alone, the singles pack is perfect. No food waste and great value for money.',              rating: 5 },
]

const LOCATIONS = ['Abeokuta', 'Ikeja', 'Ogun', 'Sango-Ota', 'Lekki', 'Iwo-road', 'Sagamu', 'Lagos', 'Badagry', 'Mowe', 'Agbara', 'Challenge', 'Ojoo']

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
      <InstallBanner />
     

{/*  PREMIUM FOOD PACKAGE HERO */}

<section className="food-hero relative isolate min-h-[650px] overflow-hidden bg-[#fffdf7] lg:min-h-[calc(100vh-70px)]">

  {/* Background decorations */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

    <div className="hero-glow hero-glow-green absolute -right-20 top-10 h-[450px] w-[450px] rounded-full bg-green-400/20 blur-[100px]" />

    <div className="hero-glow hero-glow-orange absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-orange-400/20 blur-[100px]" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(34,197,94,0.06),transparent_40%)]" />

  </div>

  <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-20">

    {/* LEFT CONTENT */}
    <div className="hero-content relative z-20">

      {/* Announcement badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold text-green-700 shadow-sm">

        <TrendingUp size={15} />

        Nigeria&apos;s #1 Food Package Store

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

      </div>

      {/* Main heading */}
      <h1
        className="max-w-2xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl xl:text-7xl"
      >
        Fresh Food Packs

        <span className="mt-2 block bg-gradient-to-r from-green-600 via-green-500 to-orange-500 bg-clip-text text-transparent">
          Delivered Fast.
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
        Affordable food packages for students, families, singles and
        organizations. Get quality food essentials delivered straight
        to your doorstep across Ogun State and beyond.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-4">

        <Button
          size="lg"
          className="group h-14 rounded-full bg-green-600 px-8 text-base font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
          asChild
        >
          <Link href="/store/products">
            Shop Now

            <ArrowRight
              size={19}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-14 rounded-full border-2 border-gray-200 bg-white px-7 text-base font-bold text-gray-800 transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:bg-green-50"
          asChild
        >
          <Link href="/store/bulk-quote">
            Request Bulk Quote
          </Link>
        </Button>

      </div>

      {/* Trust statistics */}
      <div className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-gray-200">

        {[
          ["500+", "Happy Customers"],
          ["20+", "Package Options"],
          ["24hrs", "Delivery Time"],
        ].map(([value, label]) => (

          <div key={label} className="px-3 first:pl-0 last:pr-0">

            <p className="font-display text-2xl font-extrabold text-green-700 sm:text-3xl">
              {value}
            </p>

            <p className="mt-1 text-[11px] font-medium text-gray-500 sm:text-xs">
              {label}
            </p>

          </div>

        ))}

      </div>

      {/* Small reassurance */}
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-gray-500">

        <span className="flex items-center gap-1.5">
          <span className="text-green-600">✓</span>
          Quality food products
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-green-600">✓</span>
          Affordable prices
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-green-600">✓</span>
          Doorstep delivery
        </span>

      </div>

    </div>


    {/* RIGHT CONTENT - FOOD SHOWCASE */}
    <div className="hero-showcase relative mx-auto w-full max-w-xl lg:ml-auto">

      {/* Background decorative circle */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-green-100 via-green-50 to-orange-100 blur-2xl" />

      <div className="absolute left-1/2 top-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-200/70" />

      <div className="absolute left-1/2 top-1/2 aspect-square w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/60" />


      {/* Main food package image */}
      <div className="hero-package relative z-10 mx-auto aspect-square w-full max-w-[520px]">

        <Image
          src="/images/pasam-hero.png"
          alt="Premium Nigerian food package containing rice, beans and other groceries"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 45vw"
          className="object-contain drop-shadow-2xl"
        />

      </div>


      {/* Student pack floating card */}
      <div className="hero-card hero-card-one absolute left-0 top-[12%] z-20 rounded-2xl border border-green-100 bg-white/95 p-3 shadow-xl shadow-green-900/10 backdrop-blur-md sm:left-[-15px] sm:p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <GraduationCap size={23} />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800">
              Student Pack
            </p>

            <p className="text-xs font-bold text-green-600">
              From {formatPrice(5500)}
            </p>
          </div>

        </div>

      </div>


      {/* Family pack floating card */}
      <div className="hero-card hero-card-two absolute right-0 top-[35%] z-20 rounded-2xl border border-orange-100 bg-white/95 p-3 shadow-xl shadow-orange-900/10 backdrop-blur-md sm:right-[-15px] sm:p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Users size={23} />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800">
              Family Pack
            </p>

            <p className="text-xs font-bold text-orange-600">
              From {formatPrice(35000)}
            </p>
          </div>

        </div>

      </div>


      {/* Delivery information card */}
      <div className="hero-card hero-card-three absolute bottom-[7%] left-[8%] z-20 rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-xl shadow-gray-900/10 backdrop-blur-md sm:p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Truck size={23} />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800">
              Fast Delivery
            </p>

            <p className="text-xs text-gray-500">
              Right to your doorstep
            </p>
          </div>

        </div>

      </div>


      {/* Premium quality badge */}
      <div className="hero-card hero-card-four absolute bottom-[15%] right-[2%] z-20 hidden rounded-2xl border border-purple-100 bg-white/95 p-3 shadow-xl backdrop-blur-md sm:block">

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Award size={20} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-800">
              Premium Quality
            </p>

            <p className="text-[10px] text-gray-500">
              Carefully selected
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>

</section>


      {/* ── Feature strip ── */}
      <section className="bg-white border-y border-gray-100 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck,          title: 'Fast Delivery',    desc: 'Same-day in Abeokuta' },
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

   <CategoriesSection />

   <BuildYourOwnBanner />

      {/* ── Featured Products ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-extrabold text-2xl text-gray-900">Featured Packages</h2>
            <Link href="/store/products?featured=true" className="flex items-center gap-1 text-green-600 font-semibold text-sm hover:gap-2 transition-all">
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
              <Button asChild variant="outline"><Link href="/store/products">Browse All</Link></Button>
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
                  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '2349078757151'}`} target="_blank" rel="noreferrer">
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
            <a href="https://wa.me/2349078757151" className="text-green-600 font-semibold hover:underline">
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
