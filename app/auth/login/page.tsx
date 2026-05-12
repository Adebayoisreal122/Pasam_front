'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn, Store } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/store'

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form)
      toast.success(`Welcome back, ${data.user.fullname.split(' ')[0]}!`)
      router.push(data.user.role === 'admin' ? '/admin' : redirect)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed'
      if (err.response?.status === 403 && err.response?.data?.userId) {
        toast.error('Please verify your email first')
        router.push(`/auth/verify-otp?userId=${err.response.data.userId}`)
      } else {
        toast.error(msg)
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-700 to-green-500 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-4 gap-4 h-full w-full p-8">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white" />
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Store size={40} className="text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl mb-3">PASAM Store</h1>
          <p className="text-green-100 text-base leading-relaxed max-w-xs">
            Fresh food packages delivered to your door. Affordable, convenient, nutritious.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[['500+', 'Customers'], ['20+', 'Packages'], ['24hrs', 'Delivery']].map(([v, l]) => (
              <div key={l} className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
                <p className="font-display font-extrabold text-xl">{v}</p>
                <p className="text-green-100 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/store" className="inline-flex items-center gap-2 lg:hidden mb-6">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-green-600">PASAM Store</span>
            </Link>
            <h2 className="font-display font-extrabold text-2xl text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input id="email" type="email" className="pl-10" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <Label htmlFor="password" className="mb-0">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-green-600 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input id="password" type={showPw ? 'text' : 'password'} className="pl-10 pr-10" placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              <LogIn size={16} /> {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-green-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
