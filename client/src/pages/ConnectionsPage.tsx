import { useQuery } from '@tanstack/react-query'
import { getMyConnections } from '../api/connections'
import type { Connection } from '../types'
import Sidebar from '../components/Sidebar'
import { Bell } from 'lucide-react'

export default function ConnectionsPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const { data: connections, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: getMyConnections,
  })

  const accepted = connections?.filter(c => c.status === 'accepted')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-800">Connections</h1>
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
          <h2 className="text-base font-bold text-gray-800 mb-4">My Connections</h2>

          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : accepted?.length === 0 ? (
            <p className="text-gray-500 text-sm">No accepted connections yet.</p>
          ) : (
            <div className="space-y-3">
              {accepted?.map((c: Connection) => {
                const other = c.requesterId === user.id ? c.receiver : c.requester
                return (
                  <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${other.name}`} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{other.name}</p>
                        <p className="text-xs text-gray-500">{other.program} · {other.branch} · Year {other.year}</p>
                        <p className="text-xs text-gray-500 mt-1">Topic: <span className="font-medium">{c.post.subject}</span></p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Connected
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}