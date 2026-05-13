'use client'
import Link from 'next/link'
import { Store, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  const WA = process.env.NEXT_PUBLIC_WHATSAPP || '2348012345678'

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">PASAM Store</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fresh, affordable food packages delivered to your doorstep. Serving students, families and organizations across Nigeria.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/products',                       label: 'All Products' },
                { href: '/store/categories/student-packages',    label: 'Student Packages' },
                { href: '/store/categories/family-packages',     label: 'Family Packages' },
                { href: '/store/bulk-quote',                     label: 'Bulk Orders' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-green-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/auth/login',       label: 'Login' },
                { href: '/auth/register',    label: 'Register' },
                { href: '/store/my-orders',  label: 'My Orders' },
                { href: '/store/profile',    label: 'Profile' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-green-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact Us</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-gray-400"><Phone size={14} /> +234 801 234 5678</li>
              <li className="flex items-center gap-2 text-gray-400"><Mail size={14} /> hello@pasamstore.com</li>
              <li className="flex items-center gap-2 text-gray-400"><MapPin size={14} /> Ibadan, Oyo State</li>
              <li>
                <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-colors">
                  <MessageCircle size={14} /> Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} PASAM Store. All rights reserved. Built with care in Nigeria.
        </div>
      </div>
    </footer>
  )
}
