import { Bell } from 'lucide-react'

interface Props {
  title?: string
  showSearch?: boolean
}

export default function Navbar({ title, showSearch = false }: Props) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
      {showSearch ? (
        <div className="flex-1 min-w-0 flex justify-center">
          <input
            type="text"
            placeholder="Search for topics, concepts, skills or keywords..."
            className="w-full max-w-3xl px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      ) : (
        <h1 className="flex-1 min-w-0 text-lg font-semibold text-gray-800">{title}</h1>
      )}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors" aria-label="Notifications">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-gray-500 text-xs">Year {user.year} · {user.branch}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}