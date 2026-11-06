'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  FileText, CheckCircle, XCircle, Clock, Search, MessageCircle, Building2,
  Calendar, MapPin, AlertTriangle, ArrowLeft, Mail,
} from 'lucide-react'
import API from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea, PageLoader } from '@/components/ui/index'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

type Creds = { token?: string; email?: string }

const STATUS_INFO: Record<string, { label: string; text: string; tone: string; icon: any }> = {
  pending: {
    label: 'Request received',
    text: 'Our team is reviewing your request. We will email you as soon as your quote is ready.',
    tone: 'bg-orange-50 border-orange-200 text-orange-800', icon: Clock,
  },
  reviewed: {
    label: 'Under review',
    text: 'We are preparing your price. You will get an email when it is ready.',
    tone: 'bg-blue-50 border-blue-200 text-blue-800', icon: Clock,
  },
  quoted: {
    label: 'Your quote is ready',
    text: 'Review the price below, then accept or decline.',
    tone: 'bg-green-50 border-green-200 text-green-800', icon: FileText,
  },
  accepted: {
    label: 'Quote accepted',
    text: 'Thank you. Complete the payment below and we will confirm your delivery date.',
    tone: 'bg-green-50 border-green-200 text-green-800', icon: CheckCircle,
  },
  declined: {
    label: 'Quote declined',
    text: 'You declined this quote. If you change your mind, message us on WhatsApp.',
    tone: 'bg-gray-50 border-gray-200 text-gray-700', icon: XCircle,
  },
  rejected: {
    label: 'Unable to fulfil',
    text: 'We are unable to fulfil this request as submitted. Please contact us on WhatsApp to discuss alternatives.',
    tone: 'bg-red-50 border-red-200 text-red-800', icon: XCircle,
  },
}

const CARD = 'bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6'

export default function QuoteContent() {
  const { quoteNumber } = useParams<{ quoteNumber: string }>()
  const searchParams = useSearchParams()
  const WA = process.env.NEXT_PUBLIC_WHATSAPP || '2349078757151'

  const [creds, setCreds]           = useState<Creds>({})
  const [quote, setQuote]           = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [responding, setResponding] = useState(false)
  const [showDecline, setShowDecline] = useState(false)
  const [reason, setReason]         = useState('')

  const load = useCallback(async (c: Creds) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await API.get(`/quotes/public/${encodeURIComponent(quoteNumber)}`, { params: c })
      setQuote(data.quote)
      setCreds(c)
    } catch (err: any) {
      setQuote(null)
      setError(err.response?.data?.message || 'Could not load this quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [quoteNumber])

  useEffect(() => {
    const token = searchParams.get('token') || undefined
    const email = searchParams.get('email') || undefined
    if (token || email) load({ token, email })
    else setLoading(false)
  }, [searchParams, load])

  const respond = async (decision: 'accept' | 'decline') => {
    setResponding(true)
    try {
      const { data } = await API.post(`/quotes/public/${encodeURIComponent(quoteNumber)}/respond`, {
        ...creds,
        decision,
        message: decision === 'decline' ? reason : undefined,
      })
      setQuote(data.quote)
      setShowDecline(false)
      toast.success(decision === 'accept' ? 'Quote accepted. We will be in touch shortly.' : 'Your response has been sent.')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not send your response')
    } finally {
      setResponding(false)
    }
  }

  const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`

  if (loading) return <PageLoader />

  // ── Lookup form (no token in the link, or it did not match) ──
  if (!quote) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className={CARD}>
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
            <Search size={24} className="text-green-600" />
          </div>
          <h1 className="font-display font-extrabold text-xl text-gray-900 mb-1">Find your quote</h1>
          <p className="text-sm text-gray-500 mb-5">
            Enter the email address you used on the bulk order form to view quote{' '}
            <span className="font-mono font-bold text-gray-700">{quoteNumber}</span>.
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
              <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={e => { e.preventDefault(); load({ email: emailInput.trim() }) }} className="space-y-4">
            <div>
              <Label htmlFor="quote-email">Email address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input id="quote-email" type="email" className="pl-10" placeholder="contact@organization.com"
                  value={emailInput} onChange={e => setEmailInput(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full">View quote</Button>
          </form>
        </div>
      </div>
    )
  }

  const info = STATUS_INFO[quote.status] || STATUS_INFO.pending
  const StatusIcon = info.icon
  const amount = quote.adminQuote?.totalAmount
  const showPrice = !!amount && ['quoted', 'accepted', 'declined'].includes(quote.status)
  const canRespond = quote.status === 'quoted' && !quote.isExpired

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">
      <Link href="/store/bulk-quote" className="flex items-center gap-1.5 text-sm text-green-600 hover:underline font-semibold">
        <ArrowLeft size={14} /> Bulk orders
      </Link>

      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Quote reference</p>
        <h1 className="font-display font-extrabold text-2xl text-gray-900 font-mono">{quote.quoteNumber}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {quote.organizationName} · submitted {formatDate(quote.createdAt)}
        </p>
      </div>

      {/* Status banner */}
      <div className={`border-2 rounded-2xl p-4 flex items-start gap-3 ${info.tone}`}>
        <StatusIcon size={22} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm">{info.label}</p>
          <p className="text-sm opacity-90">{info.text}</p>
        </div>
      </div>

      {/* Price */}
      {showPrice && (
        <div className={CARD}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Quoted total</p>
          <p className="font-display font-extrabold text-4xl text-green-600">{formatPrice(amount)}</p>

          {quote.adminQuote?.validUntil && (
            <p className={`text-sm mt-1.5 flex items-center gap-1.5 ${quote.isExpired ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
              <Calendar size={14} />
              {quote.isExpired
                ? `Expired on ${formatDate(quote.adminQuote.validUntil)}`
                : `Valid until ${formatDate(quote.adminQuote.validUntil)}`}
            </p>
          )}

          {quote.adminQuote?.breakdown && (
            <div className="mt-5">
              <p className="text-sm font-bold text-gray-700 mb-1.5">Price breakdown</p>
              <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-600 whitespace-pre-wrap">{quote.adminQuote.breakdown}</div>
            </div>
          )}
          {quote.adminQuote?.notes && (
            <div className="mt-4">
              <p className="text-sm font-bold text-gray-700 mb-1.5">Notes from our team</p>
              <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-600 whitespace-pre-wrap">{quote.adminQuote.notes}</div>
            </div>
          )}
        </div>
      )}

      {/* Expired */}
      {quote.status === 'quoted' && quote.isExpired && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5">
          <p className="font-bold text-orange-800 text-sm mb-1">This quote has expired</p>
          <p className="text-sm text-orange-700 mb-3">Prices may have changed. Message us and we will send an updated quote.</p>
          <Button variant="whatsapp" size="sm" asChild>
            <a href={waLink(`Hi PASAM Store, my quote ${quote.quoteNumber} has expired. Please send an updated quote.`)} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> Request updated quote
            </a>
          </Button>
        </div>
      )}

      {/* Accept / decline */}
      {canRespond && (
        <div className={CARD}>
          <h2 className="font-display font-bold text-base text-gray-800 mb-1">Your decision</h2>
          <p className="text-sm text-gray-500 mb-4">Accepting lets our team begin preparing your order.</p>

          {!showDecline ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" loading={responding} onClick={() => respond('accept')}>
                <CheckCircle size={16} /> Accept quote
              </Button>
              <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                disabled={responding} onClick={() => setShowDecline(true)}>
                <XCircle size={16} /> Decline
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea id="reason" rows={3} placeholder="Tell us why, for example the price is above budget"
                  value={reason} onChange={e => setReason(e.target.value)} maxLength={500} />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 border border-gray-200" onClick={() => setShowDecline(false)}>
                  Go back
                </Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600 from-red-500 to-red-500" loading={responding}
                  onClick={() => respond('decline')}>
                  Confirm decline
                </Button>
              </div>
            </div>
          )}

          <a href={waLink(`Hi PASAM Store, I have a question about quote ${quote.quoteNumber}.`)} target="_blank" rel="noreferrer"
            className="mt-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <MessageCircle size={14} /> Have a question? Ask on WhatsApp
          </a>
        </div>
      )}

      {/* After accepting: payment */}
      {quote.status === 'accepted' && amount && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
          <p className="font-bold text-green-800 text-sm mb-3">Next step: pay by bank transfer</p>
          <div className="bg-white rounded-xl p-4 text-sm space-y-1.5 mb-3">
            {[
              ['Bank', 'First Bank Nigeria'],
              ['Account number', '1234567890'],
              ['Account name', 'PASAM Store Ltd'],
              ['Amount', formatPrice(amount)],
              ['Reference', quote.quoteNumber],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold font-mono text-gray-800 text-right">{v}</span>
              </div>
            ))}
          </div>
          <Button variant="whatsapp" size="sm" asChild>
            <a href={waLink(`Hi PASAM Store, I have paid for quote ${quote.quoteNumber} (${formatPrice(amount)}). Sending proof of payment.`)} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> Send payment proof on WhatsApp
            </a>
          </Button>
        </div>
      )}

      {/* Your response */}
      {quote.customerResponse?.respondedAt && (
        <p className="text-xs text-gray-400 text-center">
          You {quote.customerResponse.decision} this quote on {formatDate(quote.customerResponse.respondedAt)}.
          {quote.customerResponse.message ? ` Your message: "${quote.customerResponse.message}"` : ''}
        </p>
      )}

      {/* Request summary */}
      <div className={CARD}>
        <h2 className="font-display font-bold text-base text-gray-800 mb-3 flex items-center gap-2">
          <Building2 size={16} className="text-green-600" /> Your request
        </h2>
        <div className="space-y-2">
          {quote.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800">{item.productName}</p>
                {item.notes && <p className="text-xs text-gray-400">{item.notes}</p>}
              </div>
              <span className="font-bold text-gray-700 flex-shrink-0">x{item.quantity}</span>
            </div>
          ))}
        </div>
        {(quote.deliveryAddress || quote.deliveryDate) && (
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm text-gray-600">
            {quote.deliveryAddress && (
              <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" /> {quote.deliveryAddress}</p>
            )}
            {quote.deliveryDate && (
              <p className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> Preferred date: {formatDate(quote.deliveryDate)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
