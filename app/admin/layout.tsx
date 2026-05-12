'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Ticket,
  FileText, BarChart2, LogOut, Menu, X, ChevronRight, ExternalLink, Store
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard',  exact: true },
  { to: '/admin/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products',   icon: Package,         label: 'Products' },
  { to: '/admin/categories', icon: Tag,             label: 'Categories' },
  { to: '/admin/users',      icon: Users,           label: 'Customers' },
  { to: '/admin/coupons',    icon: Ticket,          label: 'Coupons' },
  { to: '/admin/quotes',     icon: FileText,        label: 'Bulk Quotes' },
  { to: '/admin/analytics',  icon: BarChart2,       label: 'Analytics' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin, loading } = useAuth()
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  const isActive = (item: typeof NAV[0]) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
    </div>
  )

  if (!isAdmin) {
    router.push('/auth/login')
    return null
  }

  const handleLogout = () => { logout(); router.push('/store') }

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link href="/store" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Store size={16} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="block font-display font-extrabold text-base text-green-400 leading-none">PASAM</span>
              <span className="block text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-0.5">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(item => (
            <Link key={item.to} href={item.to} onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive(item)
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]'
                  : 'text-gray-400 hover:bg-white/8 hover:text-white'
              )}>
              <item.icon size={17} />
              <span>{item.label}</span>
              {isActive(item) && <ChevronRight size={13} className="ml-auto opacity-70" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm font-display flex-shrink-0">
              {user?.fullname?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.fullname}</p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:bg-red-500/15 hover:text-red-400 transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 gap-4">
        <button onClick={() => setOpen(true)}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="flex-1 font-display font-bold text-gray-800 text-base">
          {NAV.find(i => isActive(i))?.label || 'Admin'}
        </h1>
        <Link href="/store" target="_blank"
          className="flex items-center gap-1.5 text-sm text-green-600 font-semibold px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
          <ExternalLink size={14} /> View Store
        </Link>
      </header>

      <main className="p-4 sm:p-6">
        {children}
      </main>
    </div>
  )
}
