'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { authAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token }  = useParams<{ token: string }>()
  const [form,    setForm]    = useState({ password: '', confirm: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6)       return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await authAPI.resetPassword({ token, password: form.password })
      setDone(true)
    } catch (err: any) { toast.error(err.response?.data?.message || 'Reset failed') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h2 className="font-display font-extrabold text-xl text-gray-900 mb-2">Password Reset!</h2>
        <p className="text-gray-500 text-sm mb-6">Your password has been updated successfully.</p>
        <Button asChild><Link href="/auth/login">Go to Login</Link></Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-8">
        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
          <Lock size={24} className="text-green-600" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-1">Set New Password</h2>
        <p className="text-gray-500 text-sm mb-6">Choose a strong password for your account</p>
        <form onSubmit={handle} className="space-y-4">
          {[
            { key: 'password', label: 'New Password',     placeholder: 'Min 6 characters' },
            { key: 'confirm',  label: 'Confirm Password', placeholder: 'Re-enter password' },
          ].map(f => (
            <div key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input id={f.key} type={showPw ? 'text' : 'password'} className="pl-10 pr-10" placeholder={f.placeholder}
                  value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Resetting…' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
