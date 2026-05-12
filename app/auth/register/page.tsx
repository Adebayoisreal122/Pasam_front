'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus, Store } from 'lucide-react'
import { authAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router  = useRouter()
  const [form,    setForm]    = useState({ fullname: '', email: '', password: '', phone: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      toast.success('Account created! Check your email for OTP.')
      router.push(`/auth/verify-otp?userId=${data.userId}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-600 to-orange-400 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-4 gap-4 h-full w-full p-8">
            {Array.from({ length: 32 }).map((_, i) => <div key={i} className="rounded-2xl bg-white" />)}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <UserPlus size={40} className="text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl mb-3">Join PASAM Store</h1>
          <p className="text-orange-100 text-base leading-relaxed max-w-xs">
            Create your account and start ordering fresh food packages today!
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <Link href="/store" className="inline-flex items-center gap-2 lg:hidden mb-5">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-green-600">PASAM Store</span>
            </Link>
            <h2 className="font-display font-extrabold text-2xl text-gray-900">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Join thousands of happy customers</p>
          </div>

          <form onSubmit={handle} className="space-y-4">
            {[
              { key: 'fullname', label: 'Full Name', icon: User,  type: 'text',  placeholder: 'John Doe' },
              { key: 'email',    label: 'Email',     icon: Mail,  type: 'email', placeholder: 'you@example.com' },
              { key: 'phone',    label: 'Phone',     icon: Phone, type: 'tel',   placeholder: '08012345678' },
            ].map(field => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="relative">
                  <field.icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input id={field.key} type={field.type} className="pl-10" placeholder={field.placeholder}
                    value={(form as any)[field.key]} onChange={f(field.key)} required />
                </div>
              </div>
            ))}

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input id="password" type={showPw ? 'text' : 'password'} className="pl-10 pr-10" placeholder="Min 6 characters"
                  value={form.password} onChange={f('password')} required />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="orange" loading={loading} className="w-full mt-2">
              <UserPlus size={16} /> {loading ? 'Creating…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
