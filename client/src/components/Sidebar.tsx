import { NavLink, useNavigate } from 'react-router-dom';
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
                    {label}
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