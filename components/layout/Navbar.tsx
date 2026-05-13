'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart, Menu, X, User, LogOut, Package,
  ChevronDown, Search, ShieldCheck, Store
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home',          href: '/store' },
  { label: 'Products',      href: '/products' },
  { label: 'Student Packs', href: '/store/categories/student-packages' },
  { label: 'Family Packs',  href: '/store/categories/family-packages' },
  { label: 'Bulk Orders',   href: '/store/bulk-quote' },
]

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { itemCount, setIsOpen } = useCart()
  const pathname = usePathname()
  const router   = useRouter()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [userOpen,  setUserOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/store' ? pathname === href : pathname.startsWith(href)

  const handleLogout = () => { logout(); router.push('/store') }

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300',
      scrolled ? 'shadow-md' : 'border-b border-gray-100'
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px] gap-4">

          {/* Logo */}
          <Link href="/store" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="block font-display font-extrabold text-lg text-green-600 leading-none">PASAM</span>
              <span className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest">Mobile Store</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(l.href)
                    ? 'text-green-600 bg-green-50 font-semibold'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                )}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full"
              onClick={() => router.push('/products')}>
              <Search size={18} />
            </Button>

            {/* Cart */}
            <button onClick={() => setIsOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserOpen(o => !o)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm font-display">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
                </button>

                {userOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="font-semibold text-gray-800 text-sm">{user?.fullname}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { href: '/store/profile',    icon: User,        label: 'Profile' },
                          { href: '/store/my-orders',  icon: Package,     label: 'My Orders' },
                        ].map(item => (
                          <Link key={item.href} href={item.href}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <item.icon size={15} className="text-gray-400" /> {item.label}
                          </Link>
                        ))}
                        {isAdmin && (
                          <Link href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-700 font-semibold hover:bg-green-50 transition-colors">
                            <ShieldCheck size={15} /> Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild><Link href="/auth/login">Login</Link></Button>
                <Button size="sm" asChild><Link href="/auth/register">Sign Up</Link></Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(o => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-1 shadow-lg animate-slide-up">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={cn(
                'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive(l.href) ? 'text-green-600 bg-green-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              )}>
              {l.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" size="sm" asChild><Link href="/auth/login">Login</Link></Button>
              <Button className="flex-1" size="sm" asChild><Link href="/auth/register">Sign Up</Link></Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
