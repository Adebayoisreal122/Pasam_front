'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { authAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.forgotPassword({ email })
      setSent(true)
    } catch { toast.error('Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-8">
        <Link href="/auth/login" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Login
        </Link>
        {sent ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h2 className="font-display font-extrabold text-xl text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm">
              If an account exists for <strong>{email}</strong>, you&apos;ll receive a reset link shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
              <Mail size={24} className="text-orange-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-1">Forgot Password?</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your email and we&apos;ll send a reset link</p>
            <form onSubmit={handle} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Input id="email" type="email" className="pl-10" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full">
                <Send size={15} /> {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
