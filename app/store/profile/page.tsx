'use client'
import { useState } from 'react'
import { User, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authAPI } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    fullname: user?.fullname||'', phone: user?.phone||'',
    address: { street:user?.address?.street||'', city:user?.address?.city||'', state:user?.address?.state||'', landmark:user?.address?.landmark||'' }
  })
  const [loading, setLoading] = useState(false)

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [key]: e.target.value }))
  const a = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, address: { ...p.address, [key]: e.target.value } }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try { const { data } = await authAPI.updateProfile(form); updateUser(data.user); toast.success('Profile updated!') }
    catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-extrabold text-2xl text-gray-900 mb-7">My Profile</h1>

      {/* Avatar card */}
      <div className="flex items-center gap-5 bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6 mb-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-display font-extrabold text-2xl flex-shrink-0">
          {user?.fullname?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display font-extrabold text-lg text-gray-900">{user?.fullname}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <ShieldCheck size={13} className={user?.isVerified ? 'text-green-600' : 'text-orange-500'} />
            <span className={`text-xs font-semibold ${user?.isVerified ? 'text-green-600' : 'text-orange-500'}`}>
              {user?.isVerified ? 'Verified Account' : 'Email not verified'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-6 space-y-5">
        <h2 className="font-display font-bold text-base text-gray-800 flex items-center gap-2">
          <User size={17} className="text-green-600" /> Personal Info
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input className="pl-10" value={form.fullname} onChange={f('fullname')} required />
            </div>
          </div>
          <div>
            <Label>Email (read-only)</Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input className="pl-10 bg-gray-50 cursor-not-allowed" value={user?.email||''} readOnly />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Phone Number</Label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input className="pl-10" value={form.phone} onChange={f('phone')} placeholder="08012345678" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />
        <h2 className="font-display font-bold text-base text-gray-800 flex items-center gap-2">
          <MapPin size={17} className="text-green-600" /> Delivery Address
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Street Address</Label>
            <Input value={form.address.street} onChange={a('street')} placeholder="House no, street name" />
          </div>
          <div><Label>City</Label><Input value={form.address.city} onChange={a('city')} placeholder="Ibadan" /></div>
          <div><Label>State</Label><Input value={form.address.state} onChange={a('state')} placeholder="Oyo" /></div>
          <div className="sm:col-span-2">
            <Label>Nearest Landmark</Label>
            <Input value={form.address.landmark} onChange={a('landmark')} placeholder="e.g. Beside First Bank" />
          </div>
        </div>

        <Button type="submit" loading={loading} className="gap-2">
          <Save size={15} /> {loading ? 'Saving…' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
