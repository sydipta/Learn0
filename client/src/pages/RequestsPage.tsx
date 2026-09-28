import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyConnections, updateConnection } from '../api/connections'
import type { Connection } from '../types'
import Sidebar from '../components/Sidebar'
import { Bell } from 'lucide-react'

export default function RequestsPage() {
  const queryClient = useQueryClient()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const { data: connections, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: getMyConnections,
  })

  const { mutate: respond } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'accepted' | 'rejected' }) =>
      updateConnection(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['connections'] }),
  })

  const incoming = connections?.filter(c => c.receiverId === user.id && c.status === 'pending')
  const outgoing = connections?.filter(c => c.requesterId === user.id)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-800">Requests</h1>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-600" />
            <div className="flex items-center gap-2">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} className="w-8 h-8 rounded-full" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-gray-500 text-xs">Year {user.year} · {user.branch}</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6 max-w-3xl mx-auto w-full">
          {/* Incoming Requests */}
          <h2 className="text-base font-bold text-gray-800 mb-3">Incoming Requests</h2>
          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : incoming?.length === 0 ? (
            <p className="text-gray-500 text-sm mb-6">No pending requests.</p>
          ) : (
            <div className="space-y-3 mb-8">
              {incoming?.map((c: Connection) => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.requester.name}`} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{c.requester.name}</p>
                      <p className="text-xs text-gray-500">{c.requester.program} · {c.requester.branch} · Year {c.requester.year}</p>
                      <p className="text-xs text-gray-500 mt-1">Post: <span className="font-medium">{c.post.subject}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => respond({ id: c.id, status: 'rejected' })}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => respond({ id: c.id, status: 'accepted' })}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Outgoing Requests */}
          <h2 className="text-base font-bold text-gray-800 mb-3">My Requests</h2>
          {outgoing?.length === 0 ? (
            <p className="text-gray-500 text-sm">No outgoing requests.</p>
          ) : (
            <div className="space-y-3">
              {outgoing?.map((c: Connection) => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.receiver.name}`} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{c.receiver.name}</p>
                      <p className="text-xs text-gray-500">{c.receiver.program} · {c.receiver.branch} · Year {c.receiver.year}</p>
                      <p className="text-xs text-gray-500 mt-1">Post: <span className="font-medium">{c.post.subject}</span></p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    c.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}