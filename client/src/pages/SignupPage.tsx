import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login, sendOtp, signup, verifyOtp } from '../api/auth'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    program: '',
    branch: '',
    year: 1,
    avatarUrl: '',
  })
  const [verificationStep, setVerificationStep] = useState(false)
  const [otp, setOtp] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === 'year' ? Number(e.target.value) : e.target.value})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (!verificationStep) {
        if (!form.email.toLowerCase().endsWith('@iitism.ac.in')) {
          setError('Please use your institute email address ending in @iitism.ac.in')
          return
        }
        await signup(form)
        setVerificationStep(true)
        await sendOtp(form.email)
        return
      }

      await verifyOtp({ email: form.email, code: otp })
      const data = await login({ email: form.email, password: form.password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.location.href = '/feed'
    } catch (err: any) { 
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {verificationStep ? 'Verify Your Email' : 'Create Account'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {verificationStep ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600">Enter the 6-digit code sent to {form.email}.</p>
            <input
              name="otp"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Verification code"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <input name="email" type="email" placeholder="Enter your institute email" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <input name="program" placeholder="Program (e.g. B.Tech)" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <input name="branch" placeholder="Branch (e.g. Electrical Engineering)" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <select name="year" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value={1}>1st Year</option>
            <option value={2}>2nd Year</option>
            <option value={3}>3rd Year</option>
            <option value={4}>4th Year</option>
            <option value={5}>5th Year (For Integrated Masters only)</option>
          </select>
          <input name="avatarUrl" placeholder="Avatar URL (optional)" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        )}
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-purple-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}