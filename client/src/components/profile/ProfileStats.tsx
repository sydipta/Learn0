import { BookOpen, GraduationCap, Link, Star } from 'lucide-react'
import type { ProfileSummary } from '../../types'

interface Props {
  summary: ProfileSummary
}

export default function ProfileStats({ summary }: Props) {
  const stats = [
    { label: 'Lessons taught', value: summary.lessonsTaught, icon: GraduationCap, color: 'text-green-600' },
    { label: 'Lessons learned', value: summary.lessonsLearned, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Connections', value: summary.acceptedConnections, icon: Link, color: 'text-purple-600' },
    { label: 'Teaching rating', value: summary.reviewCount ? `${summary.averageRating} / 5` : 'No ratings yet', icon: Star, color: 'text-amber-500' },
  ]

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
          <Icon size={20} className={`${color} mb-3`} />
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </section>
  )
}
