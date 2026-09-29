import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPosts, deletePost } from '../api/posts'
import { getMyConnections } from '../api/connections'
import type { Post } from '../types'
import Sidebar from '../components/Sidebar'
import { Bell, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import CreatePostModal from '../components/CreatePostModal'

type PostFilter = 'all' | 'connected' | 'completed'

export default function MyPostsPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const queryClient = useQueryClient()
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [filter, setFilter] = useState<PostFilter>('all')
  const [pendingDeletePost, setPendingDeletePost] = useState<Post | null>(null)

  const { data: allPosts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })

  const { data: connections } = useQuery({
    queryKey: ['connections'],
    queryFn: getMyConnections,
  })

  const myPosts = allPosts
    ?.filter((p: Post) => p.userId === user.id)
    .filter((post: Post) => {
      const postConnections = connections?.filter(item => item.postId === post.id) || []
      const hasCompletedSession = postConnections.some(item => item.session?.status.toLowerCase() === 'completed')
      const hasConnectedSession = !hasCompletedSession && postConnections.some(item =>
        item.status === 'accepted' && item.session?.status.toLowerCase() !== 'did_not_happen'
      )

      if (filter === 'completed') return hasCompletedSession
      if (filter === 'connected') return hasConnectedSession
      return true
    })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'Unable to delete post'
      alert(message)
    },
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-800">My Posts</h1>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-600" />
            <div className="flex items-center gap-2">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} className="w-8 h-8 rounded-full" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-gray-500 text-xs">Year {user.year} · {user.branch}</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6 max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-800">My Posts</h2>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              + New Post
            </button>
          </div>

          <div className="flex gap-2 mb-5">
            {(['all', 'connected', 'completed'] as const).map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : myPosts?.length === 0 ? (
            <p className="text-gray-500 text-sm">{filter === 'all' ? "You haven't created any posts yet." : `No ${filter} posts found.`}</p>
          ) : (
            <div className="space-y-3">
              {myPosts?.map((post: Post) => (
                <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${post.type === 'learning_request' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {post.type === 'learning_request' ? 'Want to Learn' : 'Can Teach'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800">{post.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags?.map((tag: string) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    {(() => {
                      const postConnections = connections?.filter(item => item.postId === post.id) || []
                      const isCompleted = postConnections.some(item => item.session?.status.toLowerCase() === 'completed')
                      const didNotHappen = postConnections.some(item => item.session?.status.toLowerCase() === 'did_not_happen')
                      const isConnected = postConnections.some(item => item.status === 'accepted')
                      const hasPendingRequest = postConnections.some(item => item.status === 'pending')

                      if (isCompleted) {
                        return <span className="ml-4 text-sm font-medium text-blue-600">Completed</span>
                      }

                      if (didNotHappen) {
                        return <span className="ml-4 text-sm font-medium text-gray-600">Did not happen</span>
                      }

                      if (isConnected) {
                        return <span className="ml-4 text-sm font-medium text-green-600">Connected</span>
                      }

                      if (hasPendingRequest) {
                        return <span className="ml-4 text-sm font-medium text-amber-600">Request pending</span>
                      }

                      return (
                        <button
                          onClick={() => setPendingDeletePost(post)}
                          className="ml-4 text-gray-400 hover:text-red-500"
                          aria-label="Delete post"
                        >
                          <Trash2 size={18} />
                        </button>
                      )
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
        />
      )}
      {pendingDeletePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800">Delete post?</h2>
              <button onClick={() => setPendingDeletePost(null)} aria-label="Close confirmation">
                <X size={20} className="text-gray-500 hover:text-gray-800" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-semibold">{pendingDeletePost.subject}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDeletePost(null)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  remove(pendingDeletePost.id)
                  setPendingDeletePost(null)
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Delete post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}