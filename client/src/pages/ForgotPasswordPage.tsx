import { useState } from 'react';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, sendForgotPasswordCode } from '../api/reset-password';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [ticket, setTicket] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (requestError: unknown, fallback: string) => (
    requestError instanceof AxiosError ? requestError.response?.data?.message || fallback : fallback
  );

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await sendForgotPasswordCode(email);
      setTicket(response.ticket);
      setMessage(response.message);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Unable to send the verification code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit verification code.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(ticket, { code, newPassword });
      navigate('/login', { state: { message: 'Password reset successfully. Please log in.' } });
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Unable to reset your password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-300 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot password</h1>
        <p className="text-sm text-gray-500 mb-6">
          {ticket ? 'Enter the code and choose a new password.' : 'We will send a verification code to your email.'}
        </p>

        {!ticket ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send verification code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="6-digit verification code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {message && <p className="text-green-600 mt-4">{message}</p>}
        <p className="mt-6 text-center text-gray-600">
          <Link to="/login" className="text-purple-600 font-medium hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
