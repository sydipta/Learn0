import { useQuery } from '@tanstack/react-query'
import { getStats } from '../api/stats'
import { Users, BookOpen, Link, CheckCircle2 } from 'lucide-react'

export default function StatsBar() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
    })

    const items = [
        { icon: Users, label: 'Students on platform', value: stats?.totalStudents ?? '-' },
        { icon: BookOpen, label: 'Active Posts', value: stats?.activePosts ?? '-' },
        { icon: CheckCircle2, label: 'Completed Sessions', value: stats?.completedSessions ?? '-' },
        { icon: Link, label: 'Connections Made', value: stats?.connectionsMade ?? '-' },
    ]

    return (
        <div className="grid grid-cols-4 gap-3">
            {items.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/90 rounded-lg border border-white shadow-md p-3 flex items-center gap-3">
                    <Icon size={18} className="text-blue-700 flex-shrink-0" />
                    <div>
                        <p className="text-lg font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-600">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}