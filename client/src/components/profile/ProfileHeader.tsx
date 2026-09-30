import type { User } from '../../types'

interface Props {
  user: User
  isOwnProfile: boolean
}

const maskEmail = (email: string | undefined) => {
  if (!email) return null;
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
}

export default function ProfileHeader({ user, isOwnProfile }: Props) {
  return (
    <section className={`${isOwnProfile ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-200'} rounded-xl border p-6 flex flex-col sm:flex-row sm:items-center gap-5`}>
      <img
        src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
        alt={user.name}
        className="w-24 h-24 rounded-full border-4 border-blue-50"
      />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          {isOwnProfile && (
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              Your profile
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{user.program} · {user.branch} · Year {user.year}</p>
        {isOwnProfile ? (
          <p className="text-sm text-gray-500 mt-3">Email: {user.email}</p>
        ) : user.email ? (
          <p className="text-sm text-gray-500 mt-3">Email: {maskEmail(user.email)}</p>
        ) : null}
        <p className="text-xs text-gray-400 mt-1">
          {isOwnProfile ? 'This is the email connected to your account.' : 'Email is shared only after a connection is accepted.'}
        </p>
      </div>
    </section>
  )
}
