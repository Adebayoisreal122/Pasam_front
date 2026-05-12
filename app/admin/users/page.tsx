'use client'
import { useEffect, useState } from 'react'
import { Search, Ban, CheckCircle } from 'lucide-react'
import { adminAPI } from '@/services/api'
import { Input, PageLoader } from '@/components/ui/index'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const [users,      setUsers]      = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = async () => {
    setLoading(true)
    try { const { data } = await adminAPI.getUsers({ page, limit:20, search }); setUsers(data.users); setTotalPages(data.pages) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, search])

  const toggleSuspend = async (id: string, name: string, suspended: boolean) => {
    if (!window.confirm(`${suspended ? 'Unsuspend' : 'Suspend'} "${name}"?`)) return
    try { await adminAPI.toggleSuspend(id); toast.success(suspended ? 'User unsuspended' : 'User suspended'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-xl text-gray-900">Customers</h1>
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input className="pl-10 h-10 text-sm" placeholder="Search customers…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Customer','Phone','Role','Verified','Status','Joined','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.fullname?.charAt(0)}
                        </div>
                        <div><p className="font-semibold text-gray-800">{u.fullname}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${u.role==='admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      {u.isVerified ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Verified</span>
                        : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Pending</span>}
                    </td>
                    <td className="px-4 py-3">
                      {u.isSuspended ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Suspended</span>
                        : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleSuspend(u._id, u.fullname, u.isSuspended)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${u.isSuspended ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}>
                          {u.isSuspended ? <CheckCircle size={15} /> : <Ban size={15} />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No customers found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${page===p ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}
