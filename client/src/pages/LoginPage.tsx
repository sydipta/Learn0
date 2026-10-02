import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setError('')
        try {
            const data = await login({email, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/feed');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-300 y-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Login to Campus Learn</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 font-semibold transition duration-300 disabled:opacity-50"
                    >
                        {loading? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-purple-600 font-medium hover:underline">Forgot password?</Link>
                </p>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-purple-600 font-medium hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    )
}