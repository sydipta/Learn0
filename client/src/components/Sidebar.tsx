import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyConnections } from '../api/connections';
import { getNotifications } from '../api/notifications';
import { Home, FileText, Inbox, Users, Bell, User, Settings, LogOut } from 'lucide-react';

const NavItems = [
    { icon: Home, label: 'Home', path: '/feed' },
    { icon: FileText, label: 'My Posts', path: '/my-posts' },
    { icon: Inbox, label: 'Requests', path: '/requests' },
    { icon: Users, label: 'Connections', path: '/connections' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const { data: connections } = useQuery({
        queryKey: ['connections'],
        queryFn: getMyConnections,
        refetchInterval: 15000,
    })
    const { data: notifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        refetchInterval: 60000,
    })
    const incomingRequestCount = connections?.filter(connection =>
        connection.receiverId === user.id && connection.status === 'pending'
    ).length || 0
    const activeConnectionCount = connections?.filter(connection => {
        const sessionStatus = connection.session?.status?.toLowerCase()
        return connection.status === 'accepted' &&
            sessionStatus !== 'completed' &&
            sessionStatus !== 'did_not_happen'
    }).length || 0
    const unreadNotificationCount = notifications?.filter(notification => !notification.read).length || 0

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <div className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col py-6 px-4">
            {/* Logo */}
            <div className="mb-8 px-2">
                <h1 className="text-2xl font-bold text-gray-900">Campus Learn</h1>
                <p className="text-xs text-gray-500">IIT (ISM) Dhanbad</p>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-1 flex-1">
                {NavItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({isActive }) => 
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                        }`
                    }
                >
                    <Icon size={18} />
                    <span className="flex-1">{label}</span>
                    {label === 'Requests' && incomingRequestCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-teal-600 text-white text-[11px] font-semibold flex items-center justify-center">
                            {incomingRequestCount > 99 ? '99+' : incomingRequestCount}
                        </span>
                    )}
                    {label === 'Connections' && activeConnectionCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-semibold flex items-center justify-center">
                            {activeConnectionCount > 99 ? '99+' : activeConnectionCount}
                        </span>
                    )}
                    {label === 'Notifications' && unreadNotificationCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-white text-[11px] font-semibold flex items-center justify-center">
                            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                        </span>
                    )}
                </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 mt-2">
                <LogOut size={18} />
                Logout
            </button>
        </div>
    )
}