import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts'
import type { Post } from '../types'
import Sidebar from '../components/Sidebar'
import { Bell, BookOpen, GraduationCap } from 'lucide-react'
import StatsBar from '../components/StatsBar'

export default function FeedPage() {
  const [filter, setFilter] = useState<'all' | 'learning_request' | 'teaching_offer'>('all')

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', filter],
    queryFn: () => getPosts(filter === 'all' ? undefined : filter),
  })

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
          <input
            type="text"
            placeholder="Search for topics, concepts, skills or keywords..."
            className="w-96 px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-gray-500 text-xs">Year {user.year} . {user.branch}</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex gap-6 p-6 max-w-7xl mx-auto w-full">

          {/* Center Feed */}
          <div className="flex-1">

            {/* Hero Banner */}
            <div
              className="rounded-xl p-6 mb-6 text-white relative overflow-hidden min-h-48"
              style={{
                backgroundImage: 'url(/campus.gif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to transparent rounded-xl" />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-40">
                <div>
                  <h2 className="text-2xl font-bold">Good morning, {user.name?.split(' ')[0]}! 👋</h2>
                  <p className="text-white mt-2">Learn from peers. Teach what you know. Grow together.</p>
                </div>
                <div className="mt-6">
                  <StatsBar />
                </div>
              </div>
            </div>

            {/*Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {(['all', 'learning_request', 'teaching_offer'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${filter === tab ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`} >
                  {tab === 'all' ? 'All Posts' : tab === 'learning_request' ? 'Want to Learn' : 'Can Teach'}
                </button>
              ))}
            </div>

            {/* Posts */}
            {isLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : posts?.length === 0 ? (
              <p className="text-center text-gray-500">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts?.map((post: Post) => (
                  <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user.name}`}
                          alt={post.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{post.user.name}</p>
                          <p className="text-xs text-gray-500">Year {post.user.year} . {post.user.branch}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${post.type === 'learning_request' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {post.type === 'learning_request' ? 'Looking to Learn' : 'Can Teach'}
                      </span>
                    </div>

                    <h2 className="text-base font-semibold text-gray-800 mt-3">{post.subject}</h2>
                    <p className="text-sm text-gray-600 mt-1">{post.description}</p>

                    <div className="mt-4 flex justify-end">
                      <button className="text-sm text-white px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                        {post.type === 'learning_request' ? 'I can teach this' : 'I want to learn this'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-72 flex-shrink-0">
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 mb-4 flex items-center justify-center gap-2">
              <span className="text-lg">+</span>Create a New Post
            </button>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 cursor-pointer hover:shadow-sm">
                <BookOpen size={24} className="text-red-500 mb-2" />
                <p className="font-semibold text-gray-800 text-sm">I want to Learn</p>
                <p className="text-sm text-gray-500 mt-1">Get help from peears on a topic</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 cursor-pointer hover:shadow-sm">
                <GraduationCap size={24} className="text-green-600 mb-2" />
                <p className="font-semibold text-gray-800 text-sm">I want to Teach</p>
                <p className="text-sm text-gray-500 mt-1">Share your knowledge and help others</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}