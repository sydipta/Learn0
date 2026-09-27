import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts'
import type { Post } from '../types'

export default function FeedPage() {
  const [filter, setFilter] = useState<'all' | 'learning_request' | 'teaching_offer'>('all')

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', filter],
    queryFn: () => getPosts(filter === 'all' ? undefined : filter),
  })

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-600">Campus Learn</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">{user.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col items-center text-center">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-16 h-16 rounded-full mb-3"
              />
              <h2 className="font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.program} · {user.branch}</p>
              <p className="text-sm text-gray-500">Year {user.year}</p>
            </div>
          </div>
        </div>

        {/* Center Feed */}
        <div className="col-span-2">
          <div className="flex gap-2 mb-6">
            {(['all', 'learning_request', 'teaching_offer'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${filter === tab ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
              >
                {tab === 'all' ? 'All Posts' : tab === 'learning_request' ? 'Want to Learn' : 'Can Teach'}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : posts?.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts?.map((post: Post) => (
                <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${post.type === 'learning_request' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {post.type === 'learning_request' ? 'Want to Learn' : 'Can Teach'}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{post.subject}</h2>
                  <p className="text-gray-600 text-sm mt-1">{post.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <span>{post.user.name}</span>
                    <span>·</span>
                    <span>{post.user.program} · {post.user.branch} · Year {post.user.year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Share Knowledge</h3>
            <button
              onClick={() => { }}
              className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              + Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}