import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Check, CheckCheck, Clock3, Mail, UserPlus, XCircle } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from '../api/notifications'

const notificationIcons = {
  connection_request: UserPlus,
  connection_accepted: Check,
  connection_rejected: XCircle,
  session_scheduled: Clock3,
  session_reminder: Bell,
  session_completed: CheckCheck,
  session_did_not_happen: XCircle,
} as const

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 60000,
  })

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const unreadCount = notifications?.filter(notification => !notification.read).length || 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Notifications" />
        <main className="p-6 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-800">Notifications</h2>
              <p className="text-sm text-gray-500 mt-1">Updates about your requests and sessions.</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-sm font-medium text-blue-700 hover:text-blue-900 disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500">Loading notifications...</p>
          ) : notifications?.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Bell className="mx-auto text-gray-300" size={28} />
              <p className="text-sm text-gray-500 mt-3">You are all caught up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications?.map((notification: Notification) => {
                const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Mail
                return (
                  <button
                    key={notification.id}
                    onClick={() => !notification.read && markRead.mutate(notification.id)}
                    className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${notification.read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                  >
                    <span className={`p-2 rounded-lg flex-shrink-0 ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-600 text-white'}`}>
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-gray-800">{notification.message}</span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </span>
                    {!notification.read && <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
