import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { resetPassword, sendResetPasswordCode } from '../api/reset-password';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await sendResetPasswordCode();
      setMessage(response.message);
      setStep(2);
    } catch (requestError: unknown) {
      const message = requestError instanceof AxiosError ? requestError.response?.data?.message : undefined;
      setError(message || 'Unable to send the verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
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
      const response = await resetPassword({ code, newPassword });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { state: { message: response.message } });
    } catch (requestError: unknown) {
      const message = requestError instanceof AxiosError ? requestError.response?.data?.message : undefined;
      setError(message || 'Unable to reset your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Reset password</h2>
        <p className="text-sm text-gray-500 mt-1">
          Verify your email before choosing a new password.
        </p>
      </div>

      {step === 1 ? (
        <button
          type="button"
          onClick={handleSendCode}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send verification code'}
        </button>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification code
            </label>
            <input
              id="reset-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      {message && <p className="text-sm text-green-600 mt-4">{message}</p>}
    </section>
  );
}
