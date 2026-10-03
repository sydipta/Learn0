import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { deleteConnection, getMyConnections } from '../api/connections'
import { updateSessionStatus } from '../api/sessions'
import type { Connection } from '../types'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import { useState } from 'react'
import ScheduleSessionModal from '../components/ScheduleSessionModal'
import ReviewModal from '../components/ReviewModal'

type ConnectionFilter = 'all' | 'unscheduled' | 'scheduled' | 'completed' | 'did_not_happen'

export default function ConnectionsPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<ConnectionFilter>('all')

  const { data: connections, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: getMyConnections,
  })

  const accepted = connections?.filter(c => c.status === 'accepted')
  const filteredAccepted = accepted?.filter(connection => {
    const status = connection.session?.status?.toLowerCase()

    if (filter === 'unscheduled') return !connection.session
    if (filter === 'scheduled') return status === 'upcoming'
    if (filter === 'completed') return status === 'completed'
    if (filter === 'did_not_happen') return status === 'did_not_happen'
    return true
  })
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [pendingAction, setPendingAction] = useState<{
    action: 'status' | 'delete'
    connectionId: string
    sessionId: string
    status?: 'completed' | 'did_not_happen'
    label: string
  } | null>(null)
  const { mutate: changeSessionStatus, isPending: isUpdatingSession } = useMutation({
    mutationFn: ({ sessionId, status }: { sessionId: string; status: 'completed' | 'did_not_happen' }) =>
      updateSessionStatus(sessionId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setPendingAction(null)
      if (variables.status === 'completed') {
        const connection = accepted?.find(c => c.session?.id === variables.sessionId)
        if (connection) setReviewConnection(connection)
      }
    },
  })
  const { mutate: removeConnection, isPending: isDeletingConnection } = useMutation({
    mutationFn: (connectionId: string) => deleteConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setPendingAction(null)
    },
  })
  const [reviewConnection, setReviewConnection] = useState<Connection | null>(null)
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Connections" />

        <div className="p-6 max-w-3xl mx-auto w-full">
          <h2 className="text-base font-bold text-gray-800 mb-4">My Connections</h2>

          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : accepted?.length === 0 ? (
            <p className="text-gray-500 text-sm">No accepted connections yet.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                {([
                  ['all', 'All'],
                  ['unscheduled', 'Unscheduled'],
                  ['scheduled', 'Scheduled'],
                  ['completed', 'Completed'],
                  ['did_not_happen', 'Did not happen'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {filteredAccepted?.length === 0 ? (
                <p className="text-gray-500 text-sm">No connections found for this filter.</p>
              ) : (
                <div className="space-y-3">
                  {filteredAccepted?.map((c: Connection) => {
                const other = c.requesterId === user.id ? c.receiver : c.requester
                return (
                  <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/profile/${other.id}`}
                        title={`View ${other.name}'s profile`}
                        className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${other.name}`}
                          alt={`View ${other.name}'s profile`}
                          className="w-10 h-10 rounded-full"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/profile/${other.id}`}
                          className="font-medium text-gray-800 text-sm hover:text-blue-600"
                        >
                          {other.name}
                        </Link>
                        {other.email && <p className="text-xs text-gray-500">{other.email}</p>}
                        <p className="text-xs text-gray-500">{other.program} · {other.branch} · Year {other.year}</p>
                        <p className="text-xs text-gray-500 mt-1">Topic: <span className="font-medium">{c.post.subject}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2 items-center max-w-xs">
                      {!c.session ? (
                        <button
                          onClick={() => setSelectedConnection(c)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Schedule Session
                        </button>
                      ) : c.session.status.toLowerCase() === 'upcoming' ? (
                        <>
                          <button
                            disabled
                            className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 cursor-not-allowed"
                          >
                            Scheduled
                          </button>
                          <button
                            disabled={isUpdatingSession}
                            onClick={() => setPendingAction({ action: 'status', connectionId: c.id, sessionId: c.session!.id, status: 'completed', label: 'mark this session as completed' })}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Completed
                          </button>
                          <button
                            disabled={isUpdatingSession}
                            onClick={() => setPendingAction({ action: 'status', connectionId: c.id, sessionId: c.session!.id, status: 'did_not_happen', label: 'mark that this session did not happen' })}
                            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                          >
                            Did not happen
                          </button>
                          <button
                            disabled={isUpdatingSession}
                            onClick={() => setSelectedConnection(c)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                          >
                            Reschedule
                          </button>
                        </>
                      ) : c.session.status.toLowerCase() === 'completed' ? (
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium">
                          Completed
                        </span>
                      ) : (
                        <>
                          <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium">
                            Did not happen
                          </span>
                          <button
                            onClick={() => setSelectedConnection(c)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => setPendingAction({ action: 'delete', connectionId: c.id, sessionId: c.session!.id, label: 'delete this connection' })}
                            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        Connected
                      </span>
                    </div>
                  </div>
                )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {selectedConnection && (
        <ScheduleSessionModal
          connectionId={selectedConnection.id}
          subject={selectedConnection.post.subject}
          onClose={() => setSelectedConnection(null)}
        />
      )}
      {pendingAction && (
        <ConfirmModal
          title="Confirm session update"
          message={`Are you sure you want to ${pendingAction.label}? This will update it for both participants.`}
          confirmLabel={pendingAction.action === 'delete' ? 'Delete' : 'Confirm'}
          confirmClassName={pendingAction.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : undefined}
          isPending={isUpdatingSession || isDeletingConnection}
          onClose={() => setPendingAction(null)}
          onConfirm={() => {
            if (pendingAction.action === 'delete') {
              removeConnection(pendingAction.connectionId)
            } else if (pendingAction.status) {
              changeSessionStatus({ sessionId: pendingAction.sessionId, status: pendingAction.status })
            }
          }}
        />
      )}
      {reviewConnection && (
        <ReviewModal
          connection={reviewConnection}
          onClose={() => setReviewConnection(null)}
        />
      )}
    </div>
  )
}