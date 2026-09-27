import { useQuery } from '@tanstack/react-query'
import { getStats } from '../api/stats'
import { Users, BookOpen, Link, Star } from 'lucide-react'

export default function StatsBar() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
    })

    const items = [
        {icon: Users, label: 'Students on platform', value: stats?.totalStudents ?? '-' },
        {icon: BookOpen, label: 'Active Posts', value: stats?.activePosts ?? '-' },
        {icon: Link, label: 'Connections Made', value: stats?.connectionsMade ?? '-' },
        {icon: Star, label: 'Your Rating', value: stats?.yourRating ? `${stats.yourRating} ★` : 'No ratings yet' },
    ]

    return (
        <div className="grid grid-cols-4 gap-3">
            {items.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 p-3 flex items-center gap-3">
                    <Icon size={18} className="text-whiteflex-shrink-0" />
                    <div>
                        <p className="text-lg font-bold text-white">{value}</p>
                        <p className="text-xs text-white/70">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}