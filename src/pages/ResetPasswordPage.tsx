import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, X, Loader2, AlertCircle } from 'lucide-react'; 
import { API_BASE_URL } from '../config/api';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [email, setEmail] = useState('');

  // New state for the custom "Success" popup
  const [showFinalSuccess, setShowFinalSuccess] = useState(false);

  useEffect(() => {
    const state = location.state as { session_id?: string; email?: string };
    if (state?.session_id && state?.email) {
      setSessionId(state.session_id);
      setEmail(state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleResendOTP = async () => {
    setError('');
    setSuccessMessage('');
    setResending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/resend-password-reset-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('New OTP has been sent to your email!');
        setOtp('');
      } else {
        setError(data.error?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          otp: otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        
        setShowFinalSuccess(true);
       
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error?.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 relative">
      
      {/* MODERN SUCCESS POPUP (Replaces window.alert) */}
      {showFinalSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
            <p className="text-slate-500 mb-6">Your password has been reset successfully. Redirecting you to login...</p>
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-purple-600" size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter the OTP sent to <span className="font-semibold">{email}</span> and your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-[0.5em] font-bold outline-none transition-all"
              placeholder="000000"
              disabled={loading || resending}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Enter new password"
                disabled={loading || resending}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Confirm new password"
                disabled={loading || resending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || resending}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Resetting...
              </>
            ) : 'Reset Password'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || resending}
              className="text-purple-600 font-bold hover:text-purple-800 text-sm disabled:opacity-50 transition-colors"
            >
              {resending ? 'Sending new code...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;