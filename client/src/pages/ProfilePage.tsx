import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileStats from '../components/profile/ProfileStats'
import ReviewList from '../components/profile/ReviewList'
import { getMyProfile, getProfileById } from '../api/users'
import { getReviews } from '../api/reviews'

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}')
  const profileQuery = useQuery({
    queryKey: ['profile', userId || 'me'],
    queryFn: () => userId ? getProfileById(userId) : getMyProfile(),
  })

  const reviewsQuery = useQuery({
    queryKey: ['reviews', profileQuery.data?.user.id],
    queryFn: () => getReviews(profileQuery.data!.user.id),
    enabled: Boolean(profileQuery.data?.user.id),
  })

  const isLoading = profileQuery.isLoading || reviewsQuery.isLoading
  const hasError = profileQuery.isError || reviewsQuery.isError
  const isOwnProfile = profileQuery.data?.user.id === loggedInUser.id

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title={isOwnProfile ? 'Profile' : 'Student Profile'} />
        <main className="p-6 max-w-5xl mx-auto w-full space-y-5">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading profile...</p>
          ) : hasError || !profileQuery.data ? (
            <p className="text-sm text-red-600">Unable to load your profile.</p>
          ) : (
            <>
              <ProfileHeader user={profileQuery.data.user} isOwnProfile={isOwnProfile} />
              <ProfileStats summary={profileQuery.data.summary} />
              <ReviewList reviews={reviewsQuery.data || []} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
