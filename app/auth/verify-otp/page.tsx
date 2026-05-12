'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, CheckCircle } from 'lucide-react'
import { authAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  const [otp,       setOtp]       = useState(['', '', '', '', '', ''])
  const [loading,   setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!userId) router.push('/auth/register')
    const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [userId])

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setOtp(pasted.split('')); inputs.current[5]?.focus() }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) return toast.error('Enter the 6-digit OTP')
    setLoading(true)
    try {
      const { data } = await authAPI.verifyOTP({ userId, otp: code })
      localStorage.setItem('pasam_token', data.token)
      localStorage.setItem('pasam_user', JSON.stringify(data.user))
      toast.success('Email verified! Welcome!')
      router.push('/store')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setResending(true)
    try { await authAPI.resendOTP({ userId }); toast.success('OTP resent!'); setCountdown(60) }
    catch { toast.error('Failed to resend') }
    finally { setResending(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-green-600" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-2">Check Your Email</h2>
        <p className="text-gray-500 text-sm mb-8">Enter the 6-digit code we sent to your email address</p>

        <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={el => { inputs.current[i] = el }}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)] transition-all"
              maxLength={1} value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)} />
          ))}
        </div>

        <Button onClick={handleVerify} loading={loading} disabled={otp.join('').length < 6} className="w-full mb-4">
          {loading ? 'Verifying…' : 'Verify Email'}
        </Button>

        <p className="text-sm text-gray-500">
          Didn&apos;t get the code?{' '}
          {countdown > 0
            ? <span className="text-gray-400">Resend in {countdown}s</span>
            : <button onClick={handleResend} disabled={resending} className="text-green-600 font-semibold hover:underline">
                {resending ? 'Resending…' : 'Resend OTP'}
              </button>
          }
        </p>
      </div>
    </div>
  )
}
