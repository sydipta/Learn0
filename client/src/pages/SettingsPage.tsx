import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getMyProfile, updateMyProfile } from '../api/users'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const profileQuery = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMyProfile,
  })
  const [form, setForm] = useState({
    program: '',
    branch: '',
    year: 1,
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (profileQuery.data?.user) {
      setForm({
        program: profileQuery.data.user.program,
        branch: profileQuery.data.user.branch,
        year: profileQuery.data.user.year,
      })
    }
  }, [profileQuery.data])

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updatedUser) => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }))
      setMessage('Profile updated successfully.')
      setError('')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['connections'] })
    },
    onError: (requestError: any) => {
      setMessage('')
      setError(requestError.response?.data?.message || 'Unable to update your profile.')
    },
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === 'year' ? Number(value) : value,
    }))
    setMessage('')
    setError('')
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    setError('')
    updateMutation.mutate(form)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Settings" />
        <main className="p-6 max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">Academic profile</h2>
              <p className="text-sm text-gray-500 mt-1">
                Keep your study details up to date so other students can find you.
              </p>
            </div>

            {profileQuery.isLoading ? (
              <p className="text-sm text-gray-500">Loading your settings...</p>
            ) : profileQuery.isError ? (
              <p className="text-sm text-red-600">Unable to load your settings.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                  </label>
                  <input
                    id="program"
                    name="program"
                    value={form.program}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <input
                    id="branch"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>5th Year</option>
                  </select>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {message && <p className="text-sm text-green-600">{message}</p>}

                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
